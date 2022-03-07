import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useState } from 'react';

const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMassage] = useState();
  const [MessageList, setMassageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== '') {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ':' +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit('send_message', messageData);
      setMassageList((list) => [...list, messageData]);
    }
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMassageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <React.Fragment>
      <ChatHeader>
        <p>Live chat</p>
      </ChatHeader>
      <ChatBody>
        {MessageList.map((messageContent) => {
          return (
            <div>
              <div>
                {messageContent.author}:{messageContent.message}(
                {messageContent.time})
              </div>
            </div>
          );
        })}
      </ChatBody>
      <ChatFooter>
        <input
          type="text"
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMassage(event.target.value);
          }}
          onKeyPress={(e) => {
            e.key === 'Enter' && sendMessage("")
          }}
        />
        <button
          onClick={sendMessage}
        >
          보내기
        </button>
      </ChatFooter>
    </React.Fragment>
  );
};

const ChatHeader = styled.div``;

const ChatBody = styled.div``;

const ChatFooter = styled.div``;

export default Chat;
