import '../components/Chat.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import Chat from '../components/Chat.js';
import { useDispatch } from 'react-redux';
import { actionCreators as roomActions } from '../redux/modules/room';
import { actionCreators as voteActions } from '../redux/modules/vote';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import { useRef } from 'react';
import { OpenVidu } from 'openvidu-browser';
import axios from 'axios';
import OpenViduSession from 'openvidu-react';

import VoteModal from '../components/VoteModal';

//socket 서버
const socket = io.connect('http://localhost:3001');
//openvidu 서버
const OPENVIDU_SERVER_URL = 'https://' + window.location.hostname + ':4443';
const OPENVIDU_SERVER_SECRET = 'MY_SECRET';

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
  const [mySessionId, setMySessionId] = useState('SessionA');
  const [myUserName, setMyUsername] = useState(
    'OpenVidu_User_' + Math.floor(Math.random() * 100)
  );
  const [token, setToken] = useState(undefined);

  const handlerJoinSessionEvent = () => {
    console.log('Join session');
  };
  const handlerLeaveSessionEvent = () => {
    console.log('Leave session');
    setMySessionId(undefined);
  };
  const handlerErrorEvent = () => {
    console.log('Leave session');
  };

  const handleChangeSessionId = (e) => {
    setMySessionId(e.target.value);
  };

  const handleChangeUserName = (e) => {
    setMyUsername(e.target.value);
  };

  const joinSession = (event) => {
    if (roomId && userNick) {
      getToken().then((token) => {
        setMySessionId();
        setToken(token);
      });
    }
    event.preventDefault();
  };

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
      .then((sessionId) => createToken(sessionId))
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

  const [state, setState] = useState('vote');
  const [isShowing, setIsShowing] = useState(true);
  function daytimeVote() {
    if (isShowing) {
      dispatch(voteActions.getUserDB(roomId));
      const notiTimer = setTimeout(() => {
        setIsShowing(false);
      }, 2000);
      return () => clearTimeout(notiTimer);
    }
  }
  useEffect(() => {
    switch (state) {
      case 'vote':
        daytimeVote();
        break;
      default:
        console.log('실행안됨');
    }
  }, [state]);

  return (
    <>
      {isShowing && <VoteModal children="마퓌아"></VoteModal>}
      <div>
        {mySessionId === undefined ? (
          <div id="join">
            <div id="join-dialog">
              <h1> Join a video session </h1>
              <form onSubmit={joinSession}>
                <p>
                  <label>Participant: </label>
                  <input
                    type="text"
                    id="userName"
                    value={myUserName}
                    onChange={handleChangeUserName}
                    required
                  />
                </p>
                <p>
                  <label> Session: </label>
                  <input
                    type="text"
                    id="sessionId"
                    value={mySessionId}
                    onChange={handleChangeSessionId}
                    required
                  />
                </p>
                <p>
                  <input name="commit" type="submit" value="JOIN" />
                </p>
              </form>
            </div>
          </div>
        ) : (
          <div>
            {/* <OpenViduSession
              id="opv-session"
              sessionName={mySessionId}
              user={myUserName}
              token={token}
              joinSession={handlerJoinSessionEvent}
              leaveSession={handlerLeaveSessionEvent}
              error={handlerErrorEvent}
            /> */}
          </div>
        )}
      </div>
      <div className="App">
        <div className="joinChatContainer">
          <input
            type="text"
            placeholder="닉네임을 입력해주세요"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="방 번호를 입력해주세요"
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinChat}>참여하기</button>
        </div>
      </div>
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
        <button onClick={leaveRoom}>방나가기</button>
      </div>
    </>
  );
}

const ChatBox = styled.div`
  float: right;
`;

export default Ingame;
