import React, { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [change, setChange] = useState(false);
  const userNick = localStorage.getItem('nickname');

  const chageChat = () => {
    setChange(!change);
  };

  const [selectUser, setSelectUser] = useState('');

  const sendMessage = async () => {
    if (currentMessage !== '') {
      const messageData = {
        room: room,
        author: userNick,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ':' +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit('send_message', messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage('');
    }
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  //귓속말 기능 보류
  // useEffect(() => {
  //   socket.on('join_room', (roomNumber, nickName, socketId) => {
  //     console.log(roomNumber, nickName, socketId);
  //   });
  // }, []);
  // const userInfo = socket.on('join_room', (roomNumber, nickName, socketId) => {
  //   console.log(roomNumber, nickName, socketId)
  // })

  return (
    <div className="chat-window">
      <div className="chat-header" onClick={chageChat}>
        <p>채팅</p>
      </div>
      <div className={change ? 'chat-Longbody' : 'chat-body'}>
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <>
                <div
                  className="message"
                  id={userNick === messageContent.author ? 'you' : 'other'}
                >
                  <div>
                    <div className="message-meta">
                      <p id="author">{messageContent.author}</p>
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
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
}

export default Chat;
