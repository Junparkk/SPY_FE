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
import { OpenVidu } from 'openvidu-browser';
import axios from 'axios';
import OpenViduSession from 'openvidu-react';
import '../components/Video.css';
import { RiArrowGoBackFill } from 'react-icons/ri';

//컴포넌트
import VoteModal from '../components/VoteModal';
import LawyerVoteModal from '../components/LawyerVoteModal';
import DetectiveVoteModal from '../components/DetectiveVoteModal';
import SpyVoteModal from '../components/SpyVoteModal';
import JobCheckModal from '../components/JobCheckModal';
import { apis } from '../shared/apis';

//socket 서버
const socket = io.connect('http://localhost:3001');
//openvidu 서버
const OPENVIDU_SERVER_URL = 'https://' + window.location.hostname + ':4443';
const OPENVIDU_SERVER_SECRET = 'MY_SECRET'; // 프론트와 백을 이어주는 것

function Ingame(props) {
  //채팅
  const dispatch = useDispatch();
  const userId = localStorage.getItem('userid');
  const roomId = props.match.params.roomId;
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [session, setSession] = useState('');
  const userNick = localStorage.getItem('nickname');
  //화상채팅
  const [token, setToken] = useState(undefined);

  const handlerJoinSessionEvent = () => {
    console.log('Join session');
  };
  // const handlerLeaveSessionEvent = () => {
  //   console.log('Leave session');
  //   setMySessionId(undefined);
  // };
  const handlerErrorEvent = () => {
    console.log('Leave session');
  };

  // const handleChangeSessionId = (e) => {
  //   setMySessionId(e.target.value);
  // };

  // const handleChangeUserName = (e) => {
  //   setMyUsername(e.target.value);
  // };

  // const joinSession = (event) => {
  //   if (roomId && userNick) {
  //     getToken().then((token) => {
  //       setMySessionId();
  //       setToken(token);
  //     });
  //   }
  //   event.preventDefault();
  // };

  const createSession = () => {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({ customSessionId: roomId });

      axios
        .post(OPENVIDU_SERVER_URL + '/openvidu/api/sessions', data, {
          headers: {
            Authorization:
              'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          console.log('CREATE SESION', res);
          resolve(res.data.id);
        })
        .catch((response) => {
          var error = Object.assign({}, response);
          if (error.response && error.response.status === 409) {
            resolve(roomId);
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
  };
  const createToken = (sessionId) => {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({});
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
  };

  const getToken = () => {
    return createSession(roomId)
      .then((roomId) => createToken(roomId))
      .catch((Err) => console.error(Err));
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

  //백엔드 서버와 통신 가능한 비디오
  const joinVideo = () => {
    const OV = new OpenVidu();

    setSession({ session: OV.initSession() }, () => {
      let mySession = session.session;
      mySession.on('streamCreated', (event) => {
        let subscriber = mySession.subscribe(event.stream, undefined);
        let subscribers = session.subscribers;
        subscribers.push(subscriber);

        setSession({ subscribers });
      });
    });
  };

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
  console.log(roomUserList);
  useEffect(() => {
    dispatch(voteActions.getUserDB(roomId));
  }, []);
  const round = useSelector((state) => state.room.round);
  // 유저리스트에서 본인 정보만 뽑아 내기
  const findMe = roomUserList.filter(
    (user) => user.userId === parseInt(userId)
  );

  useEffect(() => {
    gameStart();
  }, []);

  function gameStart() {
    //게임스타트 함수 실행
    dispatch(roomActions.roundNoAIP(roomId));
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

  //병우 추가
  function nightDoLawyerVote() {
    console.log('변호사 투표');

    const notiTimer = setTimeout(() => {}, 3000);
    return () => clearTimeout(notiTimer);
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
        nightDoLawyerVote();
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
        <Draggable
          nodeRef={nodeRef}
          onDrag={(e, data) => trackPos(data)}
          onStart={handleStart}
          onStop={handleEnd}
        >
          <div id="session">
            <OpenViduSession
              id="opv-session"
              sessionName={roomId}
              user={userNick}
              token={token}
              joinSession={handlerJoinSessionEvent}
              // leaveSession={handlerLeaveSessionEvent}
              error={handlerErrorEvent}
            />
          </div>
        </Draggable>

        <div>
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

          {round >= 1 ? null : (
            <ButtonContainer>
              <RiArrowGoBackFill
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '40px',
                  backgroundColor: '#9296fd',
                  cursor: 'pointer',
                  color: '#ffe179',
                  padding: '10px',
                  cursor: 'pointer',
                  margin: '100px 50px',
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

          {/* 변호사추가  + 탐정 추가 */}
          {/* 근데 자연스럽게 뜨고 사라지는건 어떻게 구현? */}
          {/* <LawyerVoteModal/> */}
          {/* <DetectiveVoteModal/> */}
          {/* <SpyVoteModal/> */}
          <JobCheckModal roomId={roomId}/>
        </div>
      </Wrap>
    </>
  );
}

const Wrap = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #ffe179;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const ReadyButton = styled.div`
  width: 103px;
  height: 59px;
  border-radius: 40px;
  background-color: #9296fd;
  text-align: center;
  margin: 100px 50px;
  line-height: 59px;
  font-family: 'yg-jalnan';
  color: white;
`;
const StartButton = styled.div`
  width: 103px;
  height: 59px;
  border-radius: 40px;
  background-color: #9296fd;
  text-align: center;
  margin: 100px 50px;
  line-height: 59px;
  font-family: 'yg-jalnan';
  color: white;
`;

const ChatBox = styled.div`
  float: right;
`;

export default Ingame;
