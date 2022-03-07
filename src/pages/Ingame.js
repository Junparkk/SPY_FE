import io from 'socket.io-client';
import React from 'react';
import { useState } from 'react';
import Chat from '../components/Chat';

const socket = io.connect('http://localhost:3001');

const Ingame = () => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== '' && room !== '') {
      socket.emit('join_room', room);
      setShowChat(true)
    }
  };

  return (
    <React.Fragment>
      {!showChat ? (
        <div>
          <h3>Join</h3>
          <input
            type="text"
            placeholder="John..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join a Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </React.Fragment>
  );
};

export default Ingame;
