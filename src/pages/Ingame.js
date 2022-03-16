import '../components/Chat.css';
import '../shared/App.css';
import '../components/Video.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import Chat from '../components/Chat.js';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as roomActions } from '../redux/modules/room';
import { actionCreators as voteActions } from '../redux/modules/vote';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import { useRef } from 'react';
import axios from 'axios';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { OpenVidu } from 'openvidu-browser';
import UserVideoComponent from '../UserVideoComponent';
import Video from './Video';

//socket 서버
const socket = io.connect('http://3.38.211.55:4000');
//openvidu 서버
const OPENVIDU_SERVER_URL = 'https://inderstrial-spy.firebaseapp.com';
const OPENVIDU_SERVER_SECRET = 'MY_SECRET'; // 프론트와 백을 이어주는 것

function Ingame(props) {
  //화상 채팅
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [currentVideoDevice, setCurrentVideoDevice] = useState(undefined);

  const onbeforeunload = () => {
    leaveSession();
  };

  const handleMainVideoStream = (stream) => {
    if (mainStreamManager !== stream) {
      setMainStreamManager({
        mainStreamManager: stream,
      });
    }
  };

  const deleteSubscriber = (streamManager) => {
    let subscribers = subscribers;
    let index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      subscribers.splice(index, 1);
      setSubscribers({
        subscribers: subscribers,
      });
    }
  };

  function getToken(roomId) {
    return createSession(roomId).then((sessionId) => createToken(sessionId));
  }

  function createSession(sessionId) {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({ customSessionId: sessionId });
      axios
        .post(OPENVIDU_SERVER_URL + '/openvidu/api/sessions', data, {
          headers: {
            Authorization:
              'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          console.log('CREATE SESION', response);
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

  function createToken(sessionId) {
    return new Promise((resolve, reject) => {
      var data = {};
      axios
        .post(
          OPENVIDU_SERVER_URL +
            '/openvidu/api/sessions/' +
            sessionId +
            '/connection',
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
          console.log('TOKEN', response);
          resolve(response.data.token);
        })
        .catch((error) => reject(error));
    });
  }

  function joinSession() {
    const OV = new OpenVidu();

    setSession({ session: OV.initSession() }, () => {
      var mySession = roomId;

      mySession.on('streamCreates', (event) => {
        var subscriber = mySession.subscribe(event.stream, undefined);
        subscribers.push(subscriber);

        setSubscribers(subscribers);
      });

      mySession.on('streamDestroyed', (event) => {
        deleteSubscriber(event.stream.streamManager);
      });

      mySession.on('exception', (exception) => {
        console.worn(exception);
      });

      getToken().then((token) => {
        mySession
          .connect(token, { clientData: userNick })
          .then(async () => {
            var devices = await OV.getDevices();
            var videoDevices = devices.filter(
              (device) => device.kind === 'videoinput'
            );

            let publisher = OV.initPublisher(undefined, {
              audioSource: undefined, // The source of audio. If undefined default microphone
              videoSource: videoDevices[0].deviceId, // The source of video. If undefined default webcam
              publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
              publishVideo: true, // Whether you want to start publishing with your video enabled or not
              resolution: '640x480', // The resolution of your video
              frameRate: 30, // The frame rate of your video
              insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
              mirror: false, // Whether to mirror your local video or not
            });

            mySession.publish(publisher);

            setCurrentVideoDevice(videoDevices[0]);
            setMainStreamManager(publisher);
            setPublisher(publisher);
          })
          .catch((err) => {
            console.log(
              'There was an error connecting to the session:',
              err.code,
              err.message
            );
          });
      });
    });
  }

  const leaveSession = () => {
    const mySession = session;
    const OV = new OpenVidu();

    if (mySession) {
      mySession.disconnect();
    }

    OV = null;
    setSession(undefined);
    setSubscribers([]);
    setMainStreamManager(undefined);
    setPublisher(undefined);
  };

  async function switchCamera() {
    const OV = new OpenVidu();

    try {
      const devices = await OV.getDevices();
      var videoDevices = devices.filter(
        (device) => device.kind === 'videoinput'
      );

      if (videoDevices && videoDevices.length > 1) {
        var newVideoDevice = videoDevices.filter(
          (device) => device.deviceId !== currentVideoDevice.deviceId
        );

        if (newVideoDevice.length > 0) {
          // Creating a new publisher with specific videoSource
          // In mobile devices the default and first camera is the front one
          var newPublisher = OV.initPublisher(undefined, {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          });

          //newPublisher.once("accessAllowed", () => {
          await session.unpublish(mainStreamManager);

          await session.publish(newPublisher);

          setCurrentVideoDevice(newVideoDevice);
          setMainStreamManager(newPublisher);
          setPublisher(newPublisher);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    window.addEventListener('beforeunload', onbeforeunload);
    return () => {
      window.removeEventListener('beforeunload', onbeforeunload);
    };
  }, []);

  //채팅
  const dispatch = useDispatch();
  const userId = localStorage.getItem('userid');
  const roomId = props.match.params.roomId;
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [chatView, setChatView] = useState(false);
  const userNick = localStorage.getItem('nickname');

  const Chatting = () => {
    setChatView(!chatView);
  };

  //채팅창 드레그
  const nodeRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [Opacity, setOpacity] = useState(false);
  const trackPos = (data) => {
    setPosition({ x: data.x, y: data.y });
  };
  const handleStart = () => {
    setOpacity(true);
  };
  const handleEnd = () => {
    setOpacity(false);
  };

  // 여기 socket data를 리듀서에 저장이 가능 한 지 확인 및 구현.
  useEffect(() => {
    localStorage.getItem('userid');
    // dispatch(roomActions.enterRoomDB(userId, roomId));
    socket.on('join_room', (roomNumber, nickName, socketId) => {
      console.log(roomNumber, nickName, socketId);
    });
    joinChat();
  }, []);

  // 방 입장 시 socket으로 닉네임 방번호 전송
  const joinChat = () => {
    socket.emit('join_room', roomId, userNick);
    setShowChat(true);
  };

  const leaveRoom = () => {
    dispatch(roomActions.leaveRoomDB(userId, roomId));
  };
  ///////////////////////////////////////////////////////////
  const [state, setState] = useState('dayTimeVote');
  const [isShowing, setIsShowing] = useState(false);
  const [isReady, setIsReady] = useState(false);

  //현재 방에 접속해 있는 리스트 뽑아내기
  const roomUserList = useSelector((state) => state.vote.userList);

  useEffect(() => {
    dispatch(voteActions.getUserDB(roomId));
  }, []);

  // 유저리스트에서 본인 정보만 뽑아 내기
  const findMe = roomUserList.filter(
    (user) => user.userId === parseInt(userId)
  );

  function gameStart() {
    //게임스타트 함수 실행
  }

  function daytimeVote() {
    const notiTimer = setTimeout(() => {
      setIsShowing(true);
    }, 3000);

    return () => clearTimeout(notiTimer);
  }

  function showVoteResult() {
    console.log('결과함수보여주기');

    const notiTimer = setTimeout(() => {}, 3000);
    return () => clearTimeout(notiTimer);
  }

  function nightDoLawyerVote() {
    //변호사 함수 실행
  }

  function nightDoDetectiveVote() {
    //탐정 함수 실행
  }

  function nightDoSpyVote() {
    //스파이 함수 실행
  }

  useEffect(() => {
    switch (state) {
      case 'gameStart':
        break;
      case 'dayTimeVote':
        daytimeVote();
        break;
      case 'showVoteResult':
        showVoteResult();
        break;
      case 'nightDoLawyerVote':
        break;
      case 'nightDoDetectiveVote':
        break;
      case 'nightDoSpyVote':
        break;
      default:
        console.log('실행안됨');
    }
  }, [state]);

  const doReady = () => {
    dispatch(roomActions.doReadyAPI(roomId, userId));
    setIsReady(!isReady);
  };
  const cancelReady = () => {
    dispatch(roomActions.cancelReadyAPI(roomId, userId));
    setIsReady(!isReady);
  };
  const doStart = () => {
    dispatch(roomActions.doStartAPI(roomId, userId));
  };
  ///////////////////////////////////////////////////////////////
  return (
    <>
      <Wrap>
        {/* {isShowing && <VoteModal isMe={findMe}></VoteModal>} */}
        <div>
          <Video roomId={roomId} />
          <ButtonContainer>
            <RiArrowGoBackFill
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '30px',
                backgroundColor: '#9296fd',
                cursor: 'pointer',
                color: '#ffe179',
                padding: '10px',
                cursor: 'pointer',
                marginLeft: "100px",
                zIndex: '100000',
              }}
              onClick={leaveRoom}
            />
            {findMe[0] && findMe[0].isHost === 'N' ? (
              isReady ? (
                <ReadyButton onClick={() => cancelReady()}>
                  준비취소
                </ReadyButton>
              ) : (
                <ReadyButton onClick={() => doReady()}>준비</ReadyButton>
              )
            ) : (
              <StartButton onClick={() => doStart()}>시작</StartButton>
            )}
            <ChatButton onClick={Chatting}>채팅창</ChatButton>
          </ButtonContainer>
          {chatView ? (
            <Draggable
              nodeRef={nodeRef}
              onDrag={(e, data) => trackPos(data)}
              onStart={handleStart}
              onStop={handleEnd}
            >
              <ChatBox>
                <Chat socket={socket} username={username} room={roomId} />
              </ChatBox>
            </Draggable>
          ) : null}
        </div>
      </Wrap>
    </>
  );
}

const Wrap = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #ffe179;
  //반응형 손봐야함
  @media screen and (min-width: 663px) {
    width: 100%;
    height: 100vh;
  }
`;
const ButtonContainer = styled.div`
  display: flex;
`;

const ReadyButton = styled.div`
  width: 6.2%;
  min-width: 60px;
  height: 59px;
  border-radius: 40px;
  background-color: #9296fd;
  text-align: center;
  line-height: 59px;
  font-family: 'yg-jalnan';
  color: white;
  z-index: 100000;
  margin-left: 100px;
  cursor: pointer;
`;
const StartButton = styled.div`
  width: 6.2%;
  min-width: 60px;
  height: 59px;
  border-radius: 40px;
  background-color: #9296fd;
  text-align: center;
  line-height: 59px;
  font-family: 'yg-jalnan';
  color: white;
  z-index: 100000;
  margin-left: 100px;
  cursor: pointer;
`;

const ChatButton = styled.div`
  width: 6.2%;
  min-width: 60px;
  height: 59px;
  border-radius: 40px;
  background-color: #9296fd;
  text-align: center;
  line-height: 59px;
  font-family: 'yg-jalnan';
  color: white;
  z-index: 100000;
  margin-left: 100px;
  cursor: pointer;
`;

const ChatBox = styled.div`
  position: absolute;
  float: right;
  z-index: 100000;
  margin: -380px 50px 0px 70%;
`;

export default Ingame;
