import '../components/Chat.css';
import io from 'socket.io-client';
import { useState } from 'react';
import Chat from '../components/Chat.js';


const socket = io.connect('http://localhost:3001');

function Ingame() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== '' && room !== '') {
      socket.emit('join_room', room);
      setShowChat(true);
    }
  };

  return (
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

      <Chat socket={socket} username={username} room={room} />
    </div>
  );
}

export default Ingame;
