import '../components/Chat.css';
import '../shared/App.css';
import '../components/Video.css';
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
import { RiArrowGoBackFill } from 'react-icons/ri';

import VoteModal from '../components/VoteModal';

//socket 서버
const socket = io.connect('http://52.78.147.217:4000');
//openvidu 서버
const OPENVIDU_SERVER_URL = 'https://' + window.location.hostname + ':4443';
const OPENVIDU_SERVER_SECRET = 'INDERSTRIAL_SPY'; // 프론트와 백을 이어주는 것

function Ingame(props) {
  //채팅
  const dispatch = useDispatch();
  const userId = localStorage.getItem('userid');
  const roomId = props.match.params.roomId;
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [chatView, setChatView] = useState(false);
  const [session, setSession] = useState('');
  const userNick = localStorage.getItem('nickname');

  const Chatting = () => {
    setChatView(!chatView);
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


  // 방 입장 시 socket으로 닉네임 방번호 전송
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

  useEffect(() => {
    dispatch(voteActions.getUserDB(roomId));
  }, []);
  // 유저리스트에서 본인 정보만 뽑아 내기
  const findMe = roomUserList.filter(
    (user) => user.userId === parseInt(userId)
  );

  function gameStart() {
    //게임스타트 함수 실행
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

  function nightDoLawyerVote() {
    //변호사 함수 실행
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
        {/* <Draggable
          nodeRef={nodeRef}
          onDrag={(e, data) => trackPos(data)}
          onStart={handleStart}
          onStop={handleEnd}
        > */}
          {chatView ? (
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
          ) : null}
          <ButtonContainer>
            <RiArrowGoBackFill
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '30px',
                backgroundColor: '#9296fd',
                cursor: 'pointer',
                color: '#ffe179',
                padding: '10px',
                cursor: 'pointer',
                margin: '850px 50px 0px 50px',
                zIndex: '100000',
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
            <ChatButton onClick={Chatting}>채팅창</ChatButton>
          </ButtonContainer>
        {/* </Draggable> */}
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
  margin: 850px 50px 0px 50px;
  line-height: 59px;
  font-family: 'yg-jalnan';
  color: white;
  z-index: 100000;
  cursor: pointer;
`;
const StartButton = styled.div`
  width: 103px;
  height: 59px;
  border-radius: 40px;
  background-color: #9296fd;
  text-align: center;
  margin: 850px 50px 0px 50px;
  line-height: 59px;
  font-family: 'yg-jalnan';
  color: white;
  z-index: 100000;
  cursor: pointer;
`;

const ChatButton = styled.div`
  width: 103px;
  height: 59px;
  border-radius: 40px;
  background-color: #9296fd;
  text-align: center;
  margin: 850px 50px 0px 50px;
  line-height: 59px;
  font-family: 'yg-jalnan';
  color: white;
  z-index: 100000;
  cursor: pointer;
`;

const ChatBox = styled.div`
  float: right;
  z-index: 100000;
`;

export default Ingame;
