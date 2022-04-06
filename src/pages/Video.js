import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';
import React, { Component } from 'react';
import styled from 'styled-components';
import OpenViduVideoComponent from '../OvVideo';
import PubUserProfile from '../components/PubUserProfile';
import BasicProfileDeath from '../images/BasicProfile_Death.png';

const OPENVIDU_SERVER_URL = 'https://wawoong.shop';
const OPENVIDU_SERVER_SECRET = 'INDUSTRIAL_SPY';
const userNick = localStorage.getItem('nickname');

class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mySessionId: this.props.roomId,
      myUserName: userNick,
      session: undefined,
      mainStreamManager: undefined,
      publisher: undefined,
      subscribers: [],
      pubspeaking: false,
      subspeaking: false,
      speakingId: undefined,
      userId: undefined,
    };

    this.joinSession = this.joinSession.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.switchCamera = this.switchCamera.bind(this);
    this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
    this.handleChangeUserName = this.handleChangeUserName.bind(this);
    this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
    this.onbeforeunload = this.onbeforeunload.bind(this);
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.onbeforeunload);
    this.joinSession();
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onbeforeunload);
  }

  onbeforeunload(event) {
    this.leaveSession();
  }

  handleChangeSessionId(e) {
    this.setState({
      mySessionId: e.target.value,
    });
  }

  handleChangeUserName(e) {
    this.setState({
      myUserName: e.target.value,
    });
  }

  handleMainVideoStream(stream) {
    if (this.state.mainStreamManager !== stream) {
      this.setState({
        mainStreamManager: stream,
      });
    }
  }

  deleteSubscriber(streamManager) {
    let subscribers = this.state.subscribers;
    let index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      subscribers.splice(index, 1);
      this.setState({
        subscribers: subscribers,
      });
    }
  }

  joinSession() {
    // --- 1) Get an OpenVidu object ---

    this.OV = new OpenVidu();
    this.OV.setAdvancedConfiguration({
      noStreamPlayingEventExceptionTimeout: 10000,
      iceConnectionDisconnectedExceptionTimeout: 10000,
    });
    // --- 2) Init a session --

    this.setState(
      {
        session: this.OV.initSession(),
      },
      () => {
        var mySession = this.state.session;

        // --- 3) Specify the actions when events take place in the session --

        // On every new Stream received...
        mySession.on('streamCreated', (event) => {
          // Subscribe to the Stream to receive it. Second parameter is undefine
          // so OpenVidu doesn't create an HTML video by its own
          var subscriber = mySession.subscribe(event.stream, undefined);
          var subscribers = this.state.subscribers;
          subscribers.push(subscriber);

          subscriber.on('publisherStartSpeaking', (event) => {
            this.setState({
              subspeaking: true,
              speakingId: event.connection.connectionId,
            });
            console.log(this.state.speakingId);
          });

          subscriber.on('publisherStopSpeaking', (event) => {
            this.setState({
              subspeaking: false,
              speakingId: event.connection.connectionId,
            });
            console.log(this.state.speakingId);
          });

          this.setState({
            subscribers: subscribers,
          });
        });

        // On every Stream destroyed...
        mySession.on('streamDestroyed', (event) => {
          // Remove the stream from 'subscribers' array
          this.deleteSubscriber(event.stream.streamManager);
        });

        // On every asynchronous exception...
        mySession.on('exception', (exception) => {
          // console.warn(exception);
        });

        // --- 4) Connect to the session with a valid user token ---

        // 'getToken' method is simulating what your server-side should do.
        // 'token' parameter should be retrieved and returned by your own backend
        this.getToken().then((token) => {
          // console.log(token);
          // First param is the token got from OpenVidu Server. Second param can be retrieved by every user on event
          // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
          mySession
            .connect(token, { clientData: this.state.myUserName })

            .then(async () => {
              var devices = await this.OV.getDevices();
              var videoDevices = devices.filter(
                (device) => device.kind === 'videoinput'
              );

              // --- 5) Get your own camera stream ---

              // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
              // element: we will manage it on our own) and with the desired properties
              let publisher = this.OV.initPublisher(undefined, {
                audioSource: undefined, // The source of audio. If undefined default microphone
                videoSource: videoDevices[0].deviceId, // The source of video. If undefined default webcam
                publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
                publishVideo: true, // Whether you want to start publishing with your video enabled or not
                resolution: '640x480', // The resolution of your video
                frameRate: 30, // The frame rate of your video
                insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
                mirror: true, // Whether to mirror your local video or not
              });

              publisher.on('publisherStartSpeaking', (event) => {
                this.setState({ pubspeaking: true });
                console.log('퍼블리셔시작', this.state.pubspeaking);
                console.log(event.connection.connectionId);
              });

              publisher.on('publisherStopSpeaking', (event) => {
                this.setState({ pubspeaking: false });
                console.log('퍼블리셔종료', this.state.pubspeaking);
                console.log(event.connection.connectionId);
              });

              // --- 6) Publish your stream ---

              mySession.publish(publisher);

              // Set the main video in the page to display our webcam and store our Publisher
              this.setState({
                currentVideoDevice: videoDevices[0],
                mainStreamManager: publisher,
                publisher: publisher,
              });
            })
            .catch((error) => {
              // console.log(
              //   'There was an error connecting to the session:',
              //   error.code,
              //   error.message
              // );
            });
        });
      }
    );
  }

  leaveSession() {
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ----

    const mySession = this.state.session;

    if (mySession) {
      mySession.disconnect();
    }

    // Empty all properties...
    this.OV = null;
    this.setState({
      session: undefined,
      subscribers: [],
      mySessionId: undefined,
      myUserName: undefined,
      mainStreamManager: undefined,
      publisher: undefined,
    });
  }

  async switchCamera() {
    try {
      const devices = await this.OV.getDevices();
      var videoDevices = devices.filter(
        (device) => device.kind === 'videoinput'
      );

      if (videoDevices && videoDevices.length > 1) {
        var newVideoDevice = videoDevices.filter(
          (device) => device.deviceId !== this.state.currentVideoDevice.deviceId
        );

        if (newVideoDevice.length > 0) {
          // Creating a new publisher with specific videoSource
          // In mobile devices the default and first camera is the front one
          var newPublisher = this.OV.initPublisher(undefined, {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          });

          //newPublisher.once("accessAllowed", () => {
          await this.state.session.unpublish(this.state.mainStreamManager);

          await this.state.session.publish(newPublisher);
          this.setState({
            currentVideoDevice: newVideoDevice,
            mainStreamManager: newPublisher,
            publisher: newPublisher,
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
  render() {
    const id = this.state.subscribers.map(
      (i) => i.stream.connection.connectionId
    );
    const idIndex = id.indexOf(this.state.speakingId);
    const userId = this.props.roomUserList.map((i) => i.nickname);
    const theOther = this.props.roomUserList.filter(
      (i) => i.nickname !== userNick
    );
    const DeathInfo = theOther.map((i) => i.isEliminated.includes('N'));
    const userInfo = this.props.userInfo;

    return (
      ///////////////////////////////////////////////////////
      //방의 인원수에 따른 grid 배치 변경 필요 현재 5x2
      <div>
        {this.state.session !== undefined ? (
          <VideoContainer>
            {this.state.publisher !== undefined ? (
              <div>
                <PubVideoBox
                  className={this.state.pubspeaking ? 'speaking' : ''}
                >
                  <OpenViduVideoComponent
                    streamManager={this.state.publisher}
                    deathinfo={DeathInfo}
                    userinfo={userInfo}
                  />
                  <PubUserProfile />
                </PubVideoBox>
              </div>
            ) : null}
            {this.state.subscribers[0] ? (
              <div>
                <SubVideoBox
                  className={
                    idIndex === 0 && this.state.subspeaking ? 'speaking' : ''
                  }
                >
                  <OpenViduVideoComponent
                    streamManager={this.state.subscribers[0]}
                    userid={userId}
                    deathinfo={DeathInfo[0]}
                    userinfo={userInfo}
                  />
                </SubVideoBox>
              </div>
            ) : (
              ''
            )}
            {this.state.subscribers[1] ? (
              <div>
                <SubVideoBox
                  className={
                    idIndex === 1 && this.state.subspeaking ? 'speaking' : ''
                  }
                >
                  <OpenViduVideoComponent
                    streamManager={this.state.subscribers[1]}
                    userid={userId}
                    deathinfo={DeathInfo[1]}
                    userinfo={userInfo}
                  />
                </SubVideoBox>
              </div>
            ) : (
              ''
            )}
            {this.state.subscribers[2] ? (
              <div>
                <SubVideoBox
                  className={
                    idIndex === 2 && this.state.subspeaking ? 'speaking' : ''
                  }
                >
                  <OpenViduVideoComponent
                    streamManager={this.state.subscribers[2]}
                    userid={userId}
                    deathinfo={DeathInfo[2]}
                    userinfo={userInfo}
                  />
                </SubVideoBox>
              </div>
            ) : (
              ''
            )}

            {this.state.subscribers[3] ? (
              <div>
                <SubVideoBox
                  className={
                    idIndex === 3 && this.state.subspeaking ? 'speaking' : ''
                  }
                >
                  <OpenViduVideoComponent
                    streamManager={this.state.subscribers[3]}
                    userid={userId}
                    deathinfo={DeathInfo[3]}
                    userinfo={userInfo}
                  />
                </SubVideoBox>
              </div>
            ) : (
              ''
            )}
            {this.state.subscribers[4] ? (
              <div>
                <SubVideoBox
                  className={
                    idIndex === 4 && this.state.subspeaking ? 'speaking' : ''
                  }
                >
                  <OpenViduVideoComponent
                    streamManager={this.state.subscribers[4]}
                    userid={userId}
                    deathinfo={DeathInfo[4]}
                    userinfo={userInfo}
                  />
                </SubVideoBox>
              </div>
            ) : (
              ''
            )}
            {this.state.subscribers[5] ? (
              <div>
                <SubVideoBox
                  className={
                    idIndex === 5 && this.state.subspeaking ? 'speaking' : ''
                  }
                >
                  <OpenViduVideoComponent
                    streamManager={this.state.subscribers[5]}
                    userid={userId}
                    deathinfo={DeathInfo[5]}
                    userinfo={userInfo}
                  />
                </SubVideoBox>
              </div>
            ) : (
              ''
            )}
            {this.state.subscribers[6] ? (
              <div>
                <SubVideoBox
                  className={
                    idIndex === 6 && this.state.subspeaking ? 'speaking' : ''
                  }
                >
                  <OpenViduVideoComponent
                    streamManager={this.state.subscribers[6]}
                    userid={userId}
                    deathinfo={DeathInfo[6]}
                    userinfo={userInfo}
                  />
                </SubVideoBox>
              </div>
            ) : (
              ''
            )}
            {this.state.subscribers[7] ? (
              <div>
                <SubVideoBox
                  className={
                    idIndex === 7 && this.state.subspeaking ? 'speaking' : ''
                  }
                >
                  <OpenViduVideoComponent
                    streamManager={this.state.subscribers[7]}
                    userid={userId}
                    deathinfo={DeathInfo[7]}
                    userinfo={userInfo}
                  />
                </SubVideoBox>
              </div>
            ) : (
              ''
            )}
            {this.state.subscribers[8] ? (
              <div>
                <SubVideoBox
                  className={
                    idIndex === 8 && this.state.subspeaking ? 'speaking' : ''
                  }
                >
                  <OpenViduVideoComponent
                    streamManager={this.state.subscribers[8]}
                    userid={userId}
                    deathinfo={DeathInfo[8]}
                    userinfo={userInfo}
                  />
                </SubVideoBox>
              </div>
            ) : (
              ''
            )}
            {this.state.subscribers[9] ? (
              <div>
                <SubVideoBox
                  className={
                    idIndex === 9 && this.state.subspeaking ? 'speaking' : ''
                  }
                >
                  <OpenViduVideoComponent
                    streamManager={this.state.subscribers[9]}
                    userid={userId}
                    deathinfo={DeathInfo[9]}
                    userinfo={userInfo}
                  />
                </SubVideoBox>
              </div>
            ) : (
              ''
            )}
          </VideoContainer>
        ) : null}
      </div>
      ////////////////////////////////////////////////////////////////////////////
    );
  }

  /**
   * --------------------------
   * SERVER-SIDE RESPONSIBILITY
   * --------------------------
   * These methods retrieve the mandatory user token from OpenVidu Server.
   * This behavior MUST BE IN YOUR SERVER-SIDE IN PRODUCTION (by using
   * the API REST, openvidu-java-client or openvidu-node-client):
   *   1) Initialize a Session in OpenVidu Server   (POST /openvidu/api/sessions)
   *   2) Create a Connection in OpenVidu Server (POST /openvidu/api/sessions/<SESSION_ID>/connection)
   *   3) The Connection.token must be consumed in Session.connect() method
   */

  getToken() {
    return this.createSession(this.state.mySessionId).then((sessionId) =>
      this.createToken(sessionId)
    );
  }

  createSession(sessionId) {
    //var sessionId = this.state.mySessionId
    // console.log(sessionId);
    return new Promise((resolve, reject) => {
      let data = JSON.stringify({ customSessionId: sessionId });
      axios
        .post(OPENVIDU_SERVER_URL + `/openvidu/api/sessions`, data, {
          headers: {
            Authorization:
              'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          // console.log('CREATE SESION', response);
          resolve(response.data.id);
        })
        .catch((response) => {
          var error = Object.assign({}, response);
          if (error?.response?.status === 409) {
            resolve(sessionId);
          } else {
            console.log(error);
            console.warn(
              'No connection to OpenVidu Server. This may be a certificate error at ' +
                OPENVIDU_SERVER_URL
            );
            if (
              window.confirm(
                'No connection to OpenVidu Server. This may be a certificate error at "' +
                  OPENVIDU_SERVER_URL +
                  '"\n\nClick OK to navigate and accept it. ' +
                  'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                  OPENVIDU_SERVER_URL +
                  '"'
              )
            ) {
              window.location.assign(
                OPENVIDU_SERVER_URL + '/accept-certificate'
              );
            }
          }
        });
    });
  }

  createToken(sessionId) {
    return new Promise((resolve, reject) => {
      var data = {};
      axios
        .post(
          OPENVIDU_SERVER_URL +
            `/openvidu/api/sessions/${sessionId}/connection`,
          data,
          {
            headers: {
              Authorization:
                'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
              'Content-Type': 'application/json',
            },
          }
        )
        .then((response) => {
          // console.log('TOKEN', response)
          resolve(response.data.token);
        })
        .catch((error) => reject(error));
    });
  }
}

const VideoContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  @media screen and (max-width: 997px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media screen and (max-width: 819px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Text = styled.div`
  color: #6164ce;
  font-size: 20px;
  text-align: center;
  font-family: 'yg-jalnan';
  @media screen and (max-width: 1416px) {
    margin: 20px;
    font-size: 14px;
  }
`;

const SubVideoBox = styled.div`
  width: 250px;
  height: 250px;
  border-radius: 250px;
  overflow: hidden;
  margin: 30px auto 30px auto;
  background-color: #ffe179;
  box-shadow: 5px 5px 5px gray;
  border: 8px solid #6164ce;
  @media screen and (max-width: 1416px) {
    width: 200px;
    height: 200px;
    border-radius: 200px;
    margin: 30px auto 0px auto;
  }
  &.speaking {
    border: 8px solid green;
  }
`;

const PubVideoBox = styled.div`
  width: 250px;
  height: 250px;
  border-radius: 250px;
  overflow: hidden;
  margin: 30px auto 30px auto;
  background-color: #ffe179;
  box-shadow: 5px 5px 5px gray;
  border: 8px solid #6164ce;
  @media screen and (max-width: 1416px) {
    width: 200px;
    height: 200px;
    border-radius: 200px;
    margin: 30px auto 0px auto;
  }
  &.speaking {
    border: 8px solid green;
  }
`;

export default Video;
