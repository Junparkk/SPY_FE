import '../components/Chat.css';
import '../shared/App.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import Chat from '../components/Chat.js';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as roomActions } from '../redux/modules/room';
import { actionCreators as voteActions } from '../redux/modules/vote';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import { useRef } from 'react';
import axios from 'axios';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { OpenVidu } from 'openvidu-browser';
import UserVideoComponent from '../UserVideoComponent';
import Video from './Video';
import IngameHeader from '../components/IngameHeader';
import { history } from '../redux/configureStore';

//컴포넌트
import VoteModal from '../components/VoteModal';
import LawyerVoteModal from '../components/LawyerVoteModal';
import DetectiveVoteModal from '../components/DetectiveVoteModal';
import SpyVoteModal from '../components/SpyVoteModal';
import JobCheckModal from '../components/JobCheckModal';
import { apis } from '../shared/apis';

//socket 서버
const socket = io.connect('https://mafia.milagros.shop');

function Ingame(props) {
  //채팅
  const dispatch = useDispatch();
  const userId = localStorage.getItem('userid');
  const roomId = props.match.params.roomId;
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [chatView, setChatView] = useState(false);
  const userNick = localStorage.getItem('nickname');
  
  //채팅창 드레그
  const nodeRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [Opacity, setOpacity] = useState(false);

  
  //채팅
  const Chatting = () => {
    setChatView(!chatView);
  };
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
  const start = useSelector((state) => state.room.gameStart);
  const roomUserList = useSelector((state) => state.vote.userList);
  const round = useSelector((state) => state.room.round);
  console.log(round, '현재라운드');

  const [state, setState] = useState('preStart');
  const [isDayTimeModalShowing, setIsDayTimeModalShowing] = useState(false);
  const [isRoleModalShowing, setIsRoleModalShowing] = useState(true);
  // const [isLawyerModalShowing, setIsLawyerModalShowing] = useState(false); //변호사
  // const [isDetectiveModalShowing, setIsDetectiveModalShowing] = useState(false); // 탐정
  // const [isSpyModalShowing, setIsSpyModalShowing] = useState(false);  // 스파이

  const [isReady, setIsReady] = useState(false);
  const changeMaxLength = roomUserList.length;
  // 유저리스트에서 본인 정보만 뽑아 내기
  const findMe = roomUserList.filter(
    (user) => user.userId === parseInt(userId)
  );

  const doReady = () => {
    dispatch(roomActions.doReadyAPI(roomId, userId));
    setIsReady(!isReady);
  };
  const cancelReady = () => {
    dispatch(roomActions.cancelReadyAPI(roomId, userId));
    setIsReady(!isReady);
  };
  const doStart = () => {
    dispatch(roomActions.doStartAPI(roomId, userId, changeMaxLength));
  };

  ///////////////////////////////////////////////////////////////

  //시작 여부 확인 1초마다 반복 실행하도록

  const [status, setStatus] = useState('');
  const [status2, setStatus2] = useState('');

  useEffect(() => {
    const interval = setInterval(function () {
      console.log('ji');
      apis
        .statusCheck(roomId)
        .then((res) => {
          setStatus(res.data.status);
          console.log(res.data.status);
          // if (res.data.status === 'showRole') {
          //   clearInterval(interval);
          // }
        })
        .catch((err) => console.log(err));
    }, 1000);
  }, []);

  useEffect(() => {
    switch (status) {
      case 'isStart':
        isStart();
        //게임이 시작되엇습니다 알려주기
        console.log('isStart');
        break;
      case 'roleGive':
        roleGive();
        console.log('roleGive');
        break;
      case 'showRole':
        showRole();
        console.log('쇼롤!');
        break;

      // case 'voteDay':
      //   voteDay();
      //   console.log('voteDay까지 들어왔나요?');
      //   break;
      // case 'voteResultDay':
      //   break;
      // case 'showResultDay':
      //   break;
      // case 'isGameResult':
      //   break;
      // case 'voteNightLawyer':
      //   break;
      // case 'showMsgLawyer':
      //   break;
      // case 'voteNightDetective':
      //   break;
      // case 'showMsgDetective':
      //   break;
      // case 'voteNightSpy':
      //   break;
      // case 'showResultNight':
      //   break;
      default:
        console.log('실행안됨');
    }
  }, [status]);

  //state가 바뀔 때 마다 새로운 유저리스트 db에서 불러오기
  useEffect(() => {
    dispatch(voteActions.getUserDB(roomId));
  }, [status]);

  function isStart() {
    dispatch(roomActions.roundNoAIP(roomId));
  }

  function roleGive() {
    dispatch(voteActions.divisionRole(roomId));
    const notiTimer = setTimeout(() => {}, 1000);
    return () => clearTimeout(notiTimer);
  }

  function showRole() {
    setIsRoleModalShowing(true);

    const notiTimer = setTimeout(() => {
      setIsRoleModalShowing(false);
    }, 3000);

    const voteTimer = setTimeout(() => {
      sendStatus_2();
      console.log('voteTimer');
    }, 5000);
    return () => clearTimeout(notiTimer, voteTimer);
  }

  useEffect(() => {
    console.log('내가왕이야', status, 'status2', status2);
    switch (status2 || status) {
      case 'voteDay':
        voteDay();
        break;
      case 'showResultDay':
        showResultDay();
        break;
      case 'isGameResult_1':
        break;
      case 'voteNightLawyer':
        break;
      case 'showMsgLawyer':
        break;
      case 'voteNightDetective':
        break;
      case 'showMsgDetective':
        break;
      case 'voteNightSpy':
        break;
      case 'showResultNight':
        break;
      case 'isGameResult_2':
        break;
      default:
        console.log('실행안됨');
        break;
    }
  }, [status, status2]);

  function voteDay() {
    // setStatus2('voteResultDay');
    function 이거먼저실행(나중) {
      setIsDayTimeModalShowing(true);
      setTimeout(() => {
        나중();
      }, 3000);
    }
    function 이게나중() {
      setIsDayTimeModalShowing(false);
      dispatch(voteActions.invalidVote(roomId, round));
    }
    이거먼저실행(function () {
      이게나중();
    });
    const notiJobRoleTimer = setTimeout(() => {
      console.log('게임스타트 안 모달 끄는 타이머');
      // const people = roomUserList.filter((user) => user.isAi !== 'Y');
      // const person = people.filter((user) => user.isEliminated !== 'Y');
      // if (person[0].user.id === parseInt(userId)) {
      //   console.log('제발부탁이야 제발.... 살려줘');
      //   apis
      //     .statusCheck2(roomId)
      //     .then((res) => {
      //       setStatus2(res.data.status);
      //       console.log(res.data.status);
      //     })
      //     .catch((err) => console.log(err));
      // }
      sendStatus_2();
    }, 5000);

    return () => clearTimeout(notiJobRoleTimer);
  }

  function showResultDay() {
    console.log('투표날');
    console.log('----', roomId);
    console.log('======', round);

    dispatch(voteActions.resultDayTimeVoteAPI(roomId, round));

    const notiJobRoleTimer = setTimeout(() => {
      sendStatus_2();
    }, 5000);

    return () => clearTimeout(notiJobRoleTimer);
  }

  function sendStatus_2() {
    const people = roomUserList.filter((user) => user.isAi !== 'Y');
    const person = people.filter((user) => user.isEliminated !== 'Y');
    if (person[0].user.id === parseInt(userId)) {
      console.log('제발부탁이야 제발.... 살려줘');
      apis
        .statusCheck2(roomId)
        .then((res) => {
          setStatus2(res.data.status);
          console.log(res.data.status);
        })
        .catch((err) => console.log(err));
    }
  }

  ////////////////////////////////////////////////////////////////////
  function isGameResult() {
    // 낮과 밤 모두 사용 가능
  }

  function voteNightLawyer() {
    //변호사 투표
  }

  function showMsgLawyer() {
    //변호사 투표 결과 보기
  }

  function voteNightDetective() {
    //탐정 투표
  }

  function showMsgDetective() {
    //변호사 투표 결과 보기
  }

  function voteNightSpy() {
    //스파이 투표
  }

  function showResultNight() {
    //밤 투표 결과
  }

  ////////////////////////////////////////////////////////////////////
  return (
    <>
      <Wrap>
        {isDayTimeModalShowing && <VoteModal isMe={findMe}></VoteModal>}
        {/* {isRoleModalShowing && <JobCheckModal roomId={roomId}></JobCheckModal>} */}
        <div
          style={{
            width: '100%',
            boxShadow: '0px 5px 5px gray',
          }}
        >
          <IngameHeader />
        </div>
        <VideoContainer>
          <Video roomId={roomId} />
        </VideoContainer>
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
        {round >= 1 ? null : (
          <ButtonContainer>
            <RiArrowGoBackFill
              style={{
                width: '35px',
                minWidth: '35px',
                height: '35px',
                borderRadius: '35px',
                backgroundColor: '#9296fd',
                cursor: 'pointer',
                color: '#ffe179',
                padding: '10px',
                cursor: 'pointer',
                marginLeft: '100px',
                zIndex: '5',
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
            {chatView ? (
              <ChatButton onClick={Chatting}>채팅창닫기</ChatButton>
            ) : (
              <ChatButton onClick={Chatting}>채팅창열기</ChatButton>
            )}
          </ButtonContainer>
        )}

        {/* 변호사추가  + 탐정 추가 */}
        {/* 근데 자연스럽게 뜨고 사라지는건 어떻게 구현? */}
        {/* <LawyerVoteModal /> */}
        {/* <DetectiveVoteModal/> */}
        {/* <SpyVoteModal/> */}
      </Wrap>
    </>
  );
}

const Wrap = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #ffe179;
  //반응형 손봐야함
  @media screen and (min-width: 663px) {
    width: 100%;
    height: 100vh;
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  position: absolute;
  left: 10%;
  bottom: 50px;
  @media screen and (max-width: 763px) {
    left: 0%;
  }
`;

const VideoContainer = styled.div`
  width: 100%;
`;

const ReadyButton = styled.div`
  width: 6.2%;
  min-width: 90px;
  height: 59px;
  border-radius: 35px;
  background-color: #9296fd;
  text-align: center;
  line-height: 59px;
  font-family: 'yg-jalnan';
  color: white;
  z-index: 5;
  margin-left: 100px;
  cursor: pointer;
`;
const StartButton = styled.div`
  width: 6.2%;
  min-width: 90px;
  height: 59px;
  border-radius: 35px;
  background-color: #9296fd;
  text-align: center;
  line-height: 59px;
  font-family: 'yg-jalnan';
  color: white;
  z-index: 5;
  margin-left: 100px;
  cursor: pointer;
`;

const ChatButton = styled.div`
  width: 6.2%;
  min-width: 90px;
  height: 59px;
  border-radius: 35px;
  background-color: #9296fd;
  text-align: center;
  line-height: 59px;
  font-family: 'yg-jalnan';
  color: white;
  z-index: 5;
  margin-left: 100px;
  cursor: pointer;
`;

const ChatBox = styled.div`
  position: absolute;
  right: 50px;
  top: 50px;
  float: right;
  z-index: 500;
`;

export default Ingame;
