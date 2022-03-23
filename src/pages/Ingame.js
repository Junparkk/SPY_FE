import '../components/Chat.css';
import '../shared/App.css';
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
import IngameHeader from '../components/IngameHeader';

//컴포넌트
import VoteModal from '../components/VoteModal';
import LawyerVoteModal from '../components/LawyerVoteModal';
import DetectiveVoteModal from '../components/DetectiveVoteModal';
import SpyVoteModal from '../components/SpyVoteModal';
import JobCheckModal from '../components/JobCheckModal';
import { apis } from '../shared/apis';

//socket 서버
const socket = io.connect('https://mafia.milagros.shop');
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
  ////////////////////////////////////////////////////////////////////
  const round = useSelector((state) => state.room.round);
  const [isReady, setIsReady] = useState(false);
  const roomUserList = useSelector((state) => state.vote.userList);
  const changeMaxLength = roomUserList.length;

  const doReady = () => {
    dispatch(roomActions.doReadyAPI(roomId, userId));
    setIsReady(!isReady);
  };
  const cancelReady = () => {
    dispatch(roomActions.cancelReadyAPI(roomId, userId));
    setIsReady(!isReady);
  };
  const doStart = () => {
    dispatch(roomActions.doStartAPI(roomId, userId, changeMaxLength));
  };
  // 유저리스트에서 본인 정보만 뽑아 내기
  const findMe = roomUserList.filter(
    (user) => user.userId === parseInt(userId)
  );

  //////////////////////////////////////소켓////////////////////////////////////////////////////////////
  socket.on('getStatus', (roomId) => {
    setStatus(status);
    console.log(status, '------------------------');
  });
  sendRoomId();

  function sendRoomId() {
    return socket.emit('getStatus', roomId);
  }
  socket.on('getStatus', (status) => {
    setStatus(status);
    console.log(status, '------------------------');
  });
  sendRoomId();

  function test() {
    socket.on('news', (test) => {
      console.log(test);
    });
  }
  test();

  socket.on('news', function (data) {
    console.log(data);
    socket.emit('reply', 'Hello Node.JS');
  });

  //////////////////////////////////////////////////////////////////////////////////////

  const [status, setStatus] = useState('isStart');
  const [status2, setStatus2] = useState('');

  const [isDayTimeModalShowing, setIsDayTimeModalShowing] = useState(false);
  const [isRoleModalShowing, setIsRoleModalShowing] = useState(false);
  const [isLawyerModalShowing, setIsLawyerModalShowing] = useState(false); //변호사
  const [isDetectiveModalShowing, setIsDetectiveModalShowing] = useState(false); // 탐정
  const [isSpyModalShowing, setIsSpyModalShowing] = useState(false); // 스파이

  const host = roomUserList.filter((user) => user.isHost === 'Y');
  const isLawyer = roomUserList.filter((user) => user.role === 2);
  const isDetective = roomUserList.filter((user) => user.role === 3);
  const isSpy = roomUserList.filter((user) => user.role === 4);

  const nullVote = useSelector((state) => state.vote.isLawyerNull);

  console.log(nullVote, '========= null Vote ============');

  const updateStatus = () => {
    if (host[0].userId === parseInt(userId)) {
      apis
        .statusCheck2(roomId, userId)
        .then((res) => {
          setStatus(res.data.nextStatus);
          console.log(res.data.nextStatus, 'status2 값임');
        })
        .catch((err) => console.log(err));
    }
  };

  const nextState = () => {
    voteDay();
    updateStatus();
  };

  useEffect(() => {
    dispatch(voteActions.getUserDB(roomId));
  }, [status]);

  useEffect(() => {
    const interval = setInterval(function () {
      apis
        .statusCheck(roomId)
        .then((res) => {
          setStatus(res.data.status);
          console.log(res.data.status);
        })
        .catch((err) => console.log(err));
    }, 1000);
  }, []);

  useEffect(() => {
    switch (status) {
      case 'isStart':
        //게임이 시작되엇습니다 알려주기
        console.log('isStart');
        break;
      case 'roleGive':
        roleGive();
        console.log('roleGive');
        break;
      case 'showRole':
        showRole();
        console.log('쇼롤!');
        break;
      case 'dayTime':
        dayTime();
        console.log('스위치케이스 안 daytime');
        break;
      case 'voteDay':
        voteDay();
        break;
      case 'invailedVoteCnt':
        invailedVoteCnt();
        break;
      case 'showResultDay':
        showResultDay();
        break;
      case 'voteNightLawyer':
        voteNightLawyer();
        break;
      case 'voteNightDetective':
        voteNightDetective();
        break;
      case 'showMsgDetective':
        showMsgDetective();
        break;
      case 'voteNightSpy':
        voteNightSpy();
        break;
      case 'isGameResult_2':
        isGameResult_2();
        break;
      case 'showResultNight':
        showResultNight();
        break;
      default:
        console.log('실행안됨');
    }
  }, [status]);

  //롤부여하기
  const roleGive = () => {
    dispatch(voteActions.divisionRole(roomId));
  };

  //롤보여주기
  const showRole = () => {
    console.log('showRole 지금은 역할을 나눠주는 시간~~!!');
    setIsRoleModalShowing(true);

    const notiTimer = setTimeout(() => {
      setIsRoleModalShowing(false);
      updateStatus();
      console.log('?????????????????????????????????');
    }, 3000);
    return () => clearTimeout(notiTimer);
  };

  //토론시간
  const dayTime = () => {
    console.log('dayTime 지금은 낮 토론시간입니다.');
    dispatch(roomActions.roundNoAIP(roomId));
    const 효쥰 = setTimeout(() => {
      console.log('daytime 끄으으으읏');
      // updateStatus();
    }, 30000);
    return () => clearTimeout(효쥰);
  };

  //투표시간
  const voteDay = () => {
    console.log('voteDay 지금은 투표시간 !!@!~@~@~!@~!@');
    setIsDayTimeModalShowing(true);

    const notiJobRoleTimer = setTimeout(() => {
      setIsDayTimeModalShowing(false);
      updateStatus();
    }, 15000);
    return () => clearTimeout(notiJobRoleTimer);
  };

  const invailedVoteCnt = () => {
    console.log(roomId, round, userId);

    dispatch(voteActions.invalidVote(roomId, round, userId));
  };

  //낮 투표 결과 확인
  function showResultDay() {
    console.log('투표날');
    console.log('----', roomId);
    console.log('======', round);

    console.log(host[0].userId);
    // console.log(userId);
    //호스트만 보내고 값 전체가 받는거 나중
    if (host[0].userId === parseInt(userId)) {
      dispatch(voteActions.resultDayTimeVoteAPI(roomId, round));

      const Timer = setTimeout(() => {
        apis
          .gameResult(roomId)
          .then((res) => {
            if (res.data.result === 0) {
              updateStatus();
            } else if (res.data.result === 1) {
              window.replace('/result');
            } else if (res.data.result === 2) {
              window.replace('/result');
            }
          })
          .catch((err) => console.log(err));
      }, 10000);
      return () => clearTimeout(Timer);
    }
  }
  //변호사 투표
  async function voteNightLawyer() {
    console.log(isLawyer[0].userId, '---------------------------');
    if (isLawyer[0] && isLawyer[0].userId === parseInt(userId)) {
      setIsLawyerModalShowing(true);
      await apis
        .aiLawyerAct(roomId)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    } else {
      setIsRoleModalShowing(true);
    }

    const Timer = setTimeout(() => {
      setIsLawyerModalShowing(false);
      setIsRoleModalShowing(false);
      if (isLawyer[0] && isLawyer[0].userId === parseInt(userId)) {
        if (nullVote === true) {
          dispatch(voteActions.lawyerActDB(roomId, null));
        }
      }
      if (isLawyer[0] && isLawyer[0].isAi === 'Y') {
        if (nullVote === true) {
          dispatch(voteActions.lawyerActDB(roomId, null));
        }
      }

      updateStatus();
      // voteNightDetective();
    }, 15000);
    return () => clearTimeout(Timer);
  }
  //탐정 투표
  function voteNightDetective() {
    if (nullVote === false) {
      dispatch(voteActions.lawyerNullVote(true));
    }
    const Timer = setTimeout(() => {
      if (isDetective[0] && isDetective[0].userId === parseInt(userId)) {
        setIsDetectiveModalShowing(true);
      } else {
        setIsRoleModalShowing(true);
      }
    }, 1000);
    const Timer1 = setTimeout(() => {
      setIsDetectiveModalShowing(false);
      setIsRoleModalShowing(false);
      updateStatus();
    }, 15000);
    return () => clearTimeout(Timer, Timer1);
  }

  // 탐정 투표결과 보여주기
  function showMsgDetective() {
    // 탐정 투표 결과
    updateStatus();
  }

  // 스파이 투표
  function voteNightSpy() {
    const Timer = setTimeout(() => {
      if (isSpy[0] && isSpy[0].userId === parseInt(userId)) {
        setIsSpyModalShowing(true);
        apis
          .aiSpyAct(roomId)
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
      } else {
        setIsRoleModalShowing(true);
      }
    }, 1000);
    const Timer1 = setTimeout(() => {
      setIsSpyModalShowing(false);
      setIsRoleModalShowing(false);
      if (isSpy[0] && isSpy[0].isAi === 'Y') {
        if (nullVote === true) {
          dispatch(voteActions.spyActDB(roomId, null));
        }
      }
    }, 15000);
    return () => clearTimeout(Timer, Timer1);
  }
  //밤 투표결과 확인 요청 (버튼으로 동작)
  function isGameResult_2() {
    if (nullVote === false) {
      dispatch(voteActions.lawyerNullVote(true));
    }
    apis.gameResult(roomId).then((res) => {
      if (res.data.result === 0) {
        updateStatus();
      } else if (res.data.result === 1) {
        window.replace('/result');
      } else if (res.data.result === 2) {
        window.replace('/result');
      }
    });
  }

  //아침에 최종 결과 공지 (버튼으로 동작)
  function showResultNight() {
    if (host[0].userId === parseInt(userId)) {
      console.log(round, ' : showResultNight 라운드! ');
      dispatch(voteActions.resultDayTimeVoteAPI(roomId, round));
    }
    const Timer = setTimeout(() => {
      console.log('여기는 showResult Night');

      apis
        .gameResult(roomId)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
      updateStatus();
      console.log(round, ': 라운드 ');
    }, 15000);
    return () => clearTimeout(Timer);
  }
  //////////////////////////////////////////////////////////////////////
  return (
    <>
      <Wrap>
        {isDayTimeModalShowing && <VoteModal isMe={findMe} />}
        {isRoleModalShowing && <JobCheckModal roomId={roomId} />}
        {isLawyerModalShowing && <LawyerVoteModal />}
        {isDetectiveModalShowing && <DetectiveVoteModal />}
        {isSpyModalShowing && <SpyVoteModal />}
        <div
          style={{
            width: '100%',
            boxShadow: '0px 5px 5px gray',
          }}
        >
          <IngameHeader />
        </div>
        <VideoContainer>
          <Video roomId={roomId} />
        </VideoContainer>
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
        {round >= 1 ? null : (
          <ButtonContainer>
            <RiArrowGoBackFill
              style={{
                width: '35px',
                minWidth: '35px',
                height: '35px',
                borderRadius: '35px',
                backgroundColor: '#9296fd',
                cursor: 'pointer',
                color: '#ffe179',
                padding: '10px',
                marginLeft: '100px',
                zIndex: '5',
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
          </ButtonContainer>
        )}

        {chatView ? (
          <ChatButton onClick={Chatting}>채팅창닫기</ChatButton>
        ) : (
          <ChatButton onClick={Chatting}>채팅창열기</ChatButton>
        )}

        <ChatButton onClick={nextState}>다음 state</ChatButton>
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
  position: absolute;
  left: 10%;
  bottom: 50px;
  @media screen and (max-width: 763px) {
    left: 0%;
  }
`;

const VideoContainer = styled.div`
  width: 100%;
`;

const ReadyButton = styled.div`
  width: 6.2%;
  min-width: 90px;
  height: 59px;
  border-radius: 35px;
  background-color: #9296fd;
  text-align: center;
  line-height: 59px;
  font-family: 'yg-jalnan';
  color: white;
  z-index: 5;
  margin-left: 100px;
  cursor: pointer;
`;
const StartButton = styled.div`
  width: 6.2%;
  min-width: 90px;
  height: 59px;
  border-radius: 35px;
  background-color: #9296fd;
  text-align: center;
  line-height: 59px;
  font-family: 'yg-jalnan';
  color: white;
  z-index: 5;
  margin-left: 100px;
  cursor: pointer;
`;

const ChatButton = styled.div`
  width: 6.2%;
  min-width: 90px;
  height: 59px;
  border-radius: 35px;
  background-color: #9296fd;
  text-align: center;
  line-height: 59px;
  font-family: 'yg-jalnan';
  color: white;
  z-index: 5;
  margin-left: 100px;
  cursor: pointer;
`;

const ChatBox = styled.div`
  position: absolute;
  right: 50px;
  top: 50px;
  float: right;
  z-index: 500;
`;

export default Ingame;
