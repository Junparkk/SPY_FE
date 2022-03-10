import '../components/Chat.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import Chat from '../components/Chat.js';
import { useDispatch } from 'react-redux';
import { actionCreators as roomActions } from '../redux/modules/room';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import { useRef } from 'react';

const socket = io.connect('http://localhost:3001');

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
  const islogin = localStorage.getItem('userid');

  useEffect(() => {
    localStorage.getItem('userid');
    dispatch(roomActions.enterRoomDB(islogin, roomId));
  }, []);

  const joinRoom = () => {
    if (username !== '' && room !== '') {
      socket.emit('join_room', room);
      setShowChat(true);
    }
  };

  const liveRoom = () => {
    dispatch(roomActions.liveRoomDB(userId, roomId));
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
          <button onClick={joinRoom}>참여하기</button>
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
            <Chat socket={socket} username={username} room={room} />
          </ChatBox>
        </Draggable>
        <button onClick={liveRoom}>방나가기</button>
      </div>
    </>
  );
}

const ChatBox = styled.div`
  float: right;
`;

export default Ingame;
