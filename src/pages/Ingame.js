import '../components/Chat.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import Chat from '../components/Chat.js';
import { useDispatch } from 'react-redux';
import { actionCreators as roomActions } from '../redux/modules/room';

const socket = io.connect('http://localhost:3001');

function Ingame(props) {
  const dispatch = useDispatch()
  const roomId = props.match.params.roomId;
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState(false);
  const islogin = localStorage.getItem('token')
  console.log(roomId)

  useEffect(() => {
    localStorage.getItem('token')
    dispatch(roomActions.enterRoomDB(islogin, roomId))
  }, []);

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
