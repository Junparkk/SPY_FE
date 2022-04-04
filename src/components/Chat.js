import React, { useEffect, useState, useRef } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Draggable from 'react-draggable';

function Chat({ socket, username, roomId }) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [change, setChange] = useState(false);
  const [sendtype, setSendtype] = useState('send_message');
  const [toUser, setToUser] = useState('');
  const [userList, setUsetList] = useState([]);
  const roomUserList = useSelector((state) => state.vote.userList);
  const userSocketId = useSelector((state) => state.user.userinfo).socketId;
  //채팅창 드레그
  const nodeRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [Opacity, setOpacity] = useState(false);
  //채팅창 드레그
  const trackPos = (data) => {
    setPosition({ x: data.x, y: data.y });
  };
  const handleStart = () => {
    setOpacity(true);
  };
  const handleEnd = () => {
    setOpacity(false);
  };
  const userNick = localStorage.getItem('nickname');

  const chageChat = (props) => {
    setChange(!change);
  };

  const List = userList.map((u) => ({
    value: u.socketId,
    name: u.nickname,
  }));

  const sendMessage = async () => {
    if (currentMessage !== '') {
      const messageData = {
        roomId: roomId,
        author: userNick,
        message: currentMessage,
        socketId: toUser,
        time:
          new Date(Date.now()).getHours() +
          ':' +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit(sendtype, messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage('');
    }
  };
  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageList((list) => [...list, data]);
    });
    socket.emit('currUsers', { roomId });

    socket.on('currUsers', (user) => {
      setUsetList(user);
    });
    socket.on('currUsersToMe', (user) => {
      setUsetList(user);
    });
  }, [socket]);
  console.log(userList);

  const not_To_me = () => {
    alert('자기자신에게는 귓속말을 할 수 없어요');
    setToUser('');
  };

  const handleChange = (e) => {
    userSocketId === e.target.value ? not_To_me() : setToUser(e.target.value);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      onDrag={(e, data) => trackPos(data)}
      onStart={handleStart}
      onStop={handleEnd}
    >
      <div className="chat-window">
        <div className="chat-header" onClick={chageChat}>
          <p>채팅</p>
        </div>
        <div className={change ? 'chat-Longbody' : 'chat-body'}>
          <ScrollToBottom className="message-container">
            {messageList.map((messageContent, i) => {
              return (
                <>
                  <div
                    className="message"
                    id={
                      userNick === messageContent.author
                        ? 'you'
                        : userNick === messageContent.author &&
                          messageContent.socketId !== ''
                        ? 'whisperyou'
                        : messageContent.socketId !== ''
                        ? 'whisper'
                        : 'other'
                    }
                  >
                    <div>
                      <div className="message-meta">
                        {userNick === messageContent.author ? (
                          <p id="author"></p>
                        ) : userNick === messageContent.author &&
                          messageContent.socketId !== '' ? (
                          <p id="author">귓속말</p>
                        ) : messageContent.socketId !== '' ? (
                          <p id="author">{messageContent.author}님의 귓속말</p>
                        ) : (
                          <p id="author">{messageContent.author}</p>
                        )}
                      </div>
                      <div className="message-content">
                        <p>{messageContent.message}</p>
                      </div>
                      <div className="message-time" style={{ display: 'flex' }}>
                        <p id="time">{messageContent.time}</p>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </ScrollToBottom>
          <Select onChange={(e) => handleChange(e)}>
            <option value="">모두에게</option>
            {List.map((option) => (
              <option key={option.value} value={option.value}>
                {option.name}에게
              </option>
            ))}
          </Select>
        </div>
        <div className="chat-footer">
          <input
            type="text"
            value={currentMessage}
            onChange={(event) => {
              setCurrentMessage(event.target.value);
            }}
            onKeyPress={(event) => {
              event.key === 'Enter' && sendMessage();
            }}
          />
          <button onClick={sendMessage} style={{ minWidth: '55px' }}>
            전송
          </button>
        </div>
      </div>
    </Draggable>
  );
}

export default Chat;

const Select = styled.select`
  min-width: 0;
  width: 180px;
  padding: 4px 4px;
  font-size: 12px;
  font-weight: 600;
  color: #434343;
  line-height: inherit;
  border: none;
  background-color: transparent;
  /* -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none; */
  &:focus {
    border-color: #9296fd;
  }
`;

const Wrap = styled.div`
  display: flex;
`;
