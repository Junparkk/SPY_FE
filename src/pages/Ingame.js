import '../components/Chat.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import Chat from '../components/Chat.js';
import { useDispatch } from 'react-redux';
import { actionCreators as roomActions } from '../redux/modules/room';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import { useRef } from 'react';
import { OpenVidu } from 'openvidu-browser';

const socket = io.connect('http://localhost:3001');
const OPENVIDU_SERVER_URL = 'https://i5a608.p.ssafy.io:8443';
const OPENVIDU_SERVER_SECRET = 'HOMEDONG';

function Ingame(props) {
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
  //채팅
  const dispatch = useDispatch();
  const userId = localStorage.getItem('userid');
  const roomId = props.match.params.roomId;
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [session, setSession] = useState('');
  const userNick = localStorage.getItem('nickname');


  // 여기 socket data를 리듀서에 저장이 가능 한 지 확인 및 구현.
  useEffect(() => {
    localStorage.getItem('userid');
    dispatch(roomActions.enterRoomDB(userId, roomId));
    socket.on('join_room', (roomNumber, nickName, socketId) => {
      console.log(roomNumber, nickName, socketId)
    })
    joinChat();
  }, []);

  const joinVideo = () => {
    const OV = new OpenVidu();

    setSession({ session: OV.initSession() }, () => {
      let mySession = session.session
      mySession.on('streamCreated', (event) => {
        let subscriber = mySession.subscribe(event.stream, undefined)
        let subscribers = session.subscribers
        subscribers.push(subscriber);

        setSession({subscribers});
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

  return (
    <>
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
