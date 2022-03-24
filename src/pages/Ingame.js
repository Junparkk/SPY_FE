import '../components/Chat.css';
import '../shared/App.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import Chat from '../components/Chat.js';
import { useDispatch, useSelector } from 'react-redux';
import {
  actionCreators,
  actionCreators as roomActions,
} from '../redux/modules/room';
import vote, { actionCreators as voteActions } from '../redux/modules/vote';
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

import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//socket 서버
// const socket = io.connect('https://mafia.milagros.shop');
const socket = io.connect('http://localhost:3001');

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
  ////////////////////////////////////////////////////////////////////
  const round = useSelector((state) => state.room.round);
  const [isReady, setIsReady] = useState(false);
  const roomUserList = useSelector((state) => state.vote.userList);
  const changeMaxLength = roomUserList.length;
  const isVote = useSelector((state) => state.vote._isVote);

  //소켓으로 받아온 값 임시저장용
  const [status, setStatus] = useState('');
  const [msg, setMsg] = useState('');

  // 각 직업 투표시 띄울 모달
  const [isDayTimeModalShowing, setIsDayTimeModalShowing] = useState(false);
  const [isRoleModalShowing, setIsRoleModalShowing] = useState(false);
  const [isLawyerModalShowing, setIsLawyerModalShowing] = useState(false); //변호사
  const [isDetectiveModalShowing, setIsDetectiveModalShowing] = useState(false); // 탐정
  const [isSpyModalShowing, setIsSpyModalShowing] = useState(false); // 스파이
  //본인 확인 용도
  const host = roomUserList.filter((user) => user.isHost === 'Y');
  const isLawyer = roomUserList.filter((user) => user.role === 2);
  const isDetective = roomUserList.filter((user) => user.role === 3);
  const isSpy = roomUserList.filter((user) => user.role === 4);
  // 유저리스트에서 본인 정보만 뽑아 내기
  const findMe = roomUserList.filter(
    (user) => user.userId === parseInt(userId)
  );
  //빈 값 넘겨주는 용도
  const lawyerNullVote = useSelector((state) => state.vote.isLawyerNull);
  const spyNullVote = useSelector((state) => state.vote.isSpyNull);

  //시작했는지 여부 확인용
  const isStart = useSelector((state) => state.room.startCheck);

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

  //업데이트 상태값
  const updateStatus = () => {
    if (host[0].userId === parseInt(userId)) {
      apis
        .statusCheck2(roomId, userId)
        .then((res) => {
          setStatus(res.data.nextStatus);
          console.log(
            res.data.nextStatus,
            '#######updateStatus 넥스트 스테이터스'
          );
        })
        .catch((err) => console.log(err));
    }
  };
  //버튼 클릭시 상태 업데이트와 투표날 함수 실행
  const voteDayStart = () => {
    voteDay();
    updateStatus();
  };
  //상태가 바뀔 때 마다 유저의 리스트를 받아옴
  useEffect(() => {
    dispatch(voteActions.getUserDB(roomId));
  }, [status]);

  useEffect(() => {
    // 이 당시 status는 DB 상으로 roleGive
    socket.on('getStatus', (gameStatus) => {
      console.log(
        '==========실시간 소켓 Status 값 ======= :',
        gameStatus.status,
        gameStatus.msg,
        gameStatus.roundNo
      );

      setStatus(gameStatus.status);
      setMsg(gameStatus.msg);
      dispatch(roomActions.roundNoInfo(gameStatus.roundNo));
    });
  }, [isStart, status]); // false -> true

  // 로직 흐름
  useEffect(() => {
    let showRoleSetTimeOut,
      dayTimeSetTimeOut,
      voteDaySetTimeOut,
      invalidAndAiVoteCnt,
      dayVoteResult,
      lawyerVote,
      detectiveVote,
      spyVoteCnt,
      endOfTheDayResult,
      detectiveMsg,
      modalSpyResult;

    switch (status) {
      case 'isStart':
        // 이미 기능이 완료된 상태

        break;
      case 'roleGive':
        console.log('######역할 부여 요청', Date().toString());
        roleGive();
        break;
      case 'showRole':
        console.log('######역할 불러오기 요청', Date().toString());
        showRoleSetTimeOut = setTimeout(showRole, 3000);
        break;
      case 'dayTime':
        console.log('######데이 시작 요청', Date().toString());
        clearTimeout(modalSpyResult);
        clearTimeout(showRoleSetTimeOut);
        dayTimeSetTimeOut = setTimeout(dayTime, 2000);
        break;
      case 'voteDay':
        console.log('######투표 시작 요청', Date().toString());
        clearTimeout(dayTimeSetTimeOut);
        voteDaySetTimeOut = setTimeout(voteDay, 10000);
        break;
      case 'invalidVoteCnt':
        console.log('######무효표 처리 시작 요청', Date().toString());
        clearTimeout(voteDaySetTimeOut);
        invalidAndAiVoteCnt = setTimeout(invalidVoteCnt, 1000);
        break;
      case 'showResultDay':
        console.log('######낮투표 결과 요청', Date().toString());
        dayVoteResult = setTimeout(showResultDay, 1000);
        clearTimeout(invalidAndAiVoteCnt);
        break;
      case 'voteNightLawyer':
        toast.success(msg, {
          draggable: true,
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
        });
        console.log('######변호사 투표 시작 요청', Date().toString());
        lawyerVote = setTimeout(voteNightLawyer, 8000);
        clearTimeout(dayVoteResult);
        break;
      case 'voteNightDetective':
        console.log('######탐정 투표 시작 요청', Date().toString());
        detectiveVote = setTimeout(voteNightDetective, 8000);
        clearTimeout(lawyerVote);
        break;
      case 'showMsgDetective': // 모달로 보여줄 예정
        console.log('######탐정 답변확인 요청', Date().toString());
        detectiveMsg = setTimeout(showMsgDetective, 3000);
        clearTimeout(detectiveVote);
        break;
      case 'voteNightSpy':
        console.log('######스파이 투표 요청', Date().toString());
        spyVoteCnt = setTimeout(voteNightSpy, 8000);
        clearTimeout(detectiveMsg);
        break;
      case 'isGameResult_2':
        console.log('######밤 투표 결과 요청', Date().toString());
        endOfTheDayResult = setTimeout(isGameResult_2, 3000);
        clearTimeout(spyVoteCnt);
        break;
      case 'showResultNight':
        console.log('######스파이 투표 결과 보여주기 요청', Date().toString());
        modalSpyResult = setTimeout(showResultNight, 5000);
        clearTimeout(endOfTheDayResult);
        break;
      default:
        console.log('실행안됨');
    }
    clearTimeout(modalSpyResult);
  }, [status]);

  //롤부여하기
  const roleGive = () => {
    dispatch(voteActions.divisionRole(roomId));
    //백엔드에서 api 호출을 받고 showRole로 바꿔줌

    toast.success('게임이 시작했습니다', {
      draggable: true,
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000,
    });
  };

  //롤보여주기
  const showRole = () => {
    setIsRoleModalShowing(true);
    const Timer = setTimeout(() => {
      setIsRoleModalShowing(false);
      updateStatus();
    }, 3000);
    return () => clearTimeout(Timer);
    // 롤 보여주기가 끝나면 showRole만 호출이 되고 있고
    // 다음 status로 넘겨주는게 필요함
    // if 살아있는 사람중에 첫번쨰라면 소켓으로 요청을 해라~~~~
  };

  //토론시간
  const dayTime = () => {
    const voteDayTimeSet = setTimeout(() => {
      updateStatus();
    }, 1000);
    return () => clearTimeout(voteDayTimeSet);
  };

  //투표시간
  const voteDay = () => {
    setIsDayTimeModalShowing(true);

    const notiJobRoleTimer = setTimeout(() => {
      setIsDayTimeModalShowing(false);
      if (!isVote) updateStatus();
    }, 10000);
    return () => clearTimeout(notiJobRoleTimer);
  };

  //무효표 던지는 시간
  const invalidVoteCnt = () => {
    console.log(round, '<<<< 여기 현재 라운드임 ');
    dispatch(voteActions.invalidVote(roomId, round, userId));
  };

  //낮 투표 결과 확인
  function showResultDay() {
    //호스트만 보내고 값 전체가 받는거 나중
    if (host[0].userId === parseInt(userId)) {
      dispatch(voteActions.resultDayTimeVoteAPI(roomId, round));

      const Timer = setTimeout(() => {
        dispatch(voteActions.voteResult(roomId));
      }, 1000);
      return () => clearTimeout(Timer);
    }
  }

  //변호사 투표
  function voteNightLawyer() {
    if (isLawyer[0] && isLawyer[0].userId === parseInt(userId)) {
      setIsLawyerModalShowing(true);
      apis
        .aiLawyerAct(roomId)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    } else {
      setIsRoleModalShowing(true);
    }

    const Timer = setTimeout(() => {
      setIsLawyerModalShowing(false);
      setIsRoleModalShowing(false);
      if (isLawyer[0] && isLawyer[0].userId === parseInt(userId)) {
        if (lawyerNullVote === true) {
          dispatch(voteActions.lawyerActDB(roomId, null));
        }
      }
      if (isLawyer[0] && isLawyer[0].isAi === 'Y') {
        if (lawyerNullVote === true) {
          dispatch(voteActions.lawyerActDB(roomId, null));
        }
      }

      // voteNightDetective();
    }, 10000);
    return () => clearTimeout(Timer);
  }
  //탐정 투표
  function voteNightDetective() {
    if (lawyerNullVote === false) {
      dispatch(voteActions.lawyerNullVote(true));
    }
    const Timer = setTimeout(() => {
      if (isDetective[0] && isDetective[0].userId === parseInt(userId)) {
        setIsDetectiveModalShowing(true);
      } else {
        setIsRoleModalShowing(true);
      }
    }, 1000);
    const Timer1 = setTimeout(() => {
      setIsDetectiveModalShowing(false);
      setIsRoleModalShowing(false);
    }, 10000);
    return () => clearTimeout(Timer, Timer1);
  }

  // 탐정 투표결과 보여주기
  function showMsgDetective() {
    // 탐정 투표 결과
  }

  // 스파이 투표
  function voteNightSpy() {
    const Timer = setTimeout(() => {
      if (isSpy[0] && isSpy[0].userId === parseInt(userId)) {
        setIsSpyModalShowing(true);
        apis
          .aiSpyAct(roomId)
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
      } else {
        setIsRoleModalShowing(true);
      }
    }, 1000);
    const Timer1 = setTimeout(() => {
      setIsSpyModalShowing(false);
      setIsRoleModalShowing(false);
      if (isSpy[0] && isSpy[0].isAi === 'Y') {
        if (spyNullVote === true) {
          dispatch(voteActions.spyActDB(roomId, null));
        }
      }
    }, 10000);
    return () => clearTimeout(Timer, Timer1);
  }
  //밤 투표결과 확인 요청 (버튼으로 동작)
  function isGameResult_2() {
    if (spyNullVote === false) {
      dispatch(voteActions.spyNullVote(true));
    }
    apis.gameResult(roomId).then((res) => {
      if (res.data.result === 0) {
        updateStatus();
      } else if (res.data.result === 1) {
        window.replace('/result');
      } else if (res.data.result === 2) {
        window.replace('/result');
      }
    });
  }

  //아침에 최종 결과 공지 (버튼으로 동작)
  function showResultNight() {
    if (host[0].userId === parseInt(userId)) {
      console.log(round, ' : showResultNight 라운드! ');
      dispatch(voteActions.resultDayTimeVoteAPI(roomId, round));
    }
    const Timer = setTimeout(() => {
      console.log('여기는 showResult Night');

      apis
        .gameResult(roomId)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
      updateStatus();
      console.log(round, ': 라운드 ');
    }, 10000);
    return () => clearTimeout(Timer);
  }
  //////////////////////////////////////////////////////////////////////
  return (
    <>
      <Wrap>
        <ToastContainer />
        {isDayTimeModalShowing && <VoteModal isMe={findMe} roomId={roomId} />}
        {isRoleModalShowing && <JobCheckModal roomId={roomId} />}
        {isLawyerModalShowing && <LawyerVoteModal />}
        {isDetectiveModalShowing && <DetectiveVoteModal />}
        {isSpyModalShowing && <SpyVoteModal />}
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
          </ButtonContainer>
        )}

        {chatView ? (
          <ChatButton onClick={Chatting}>채팅창닫기</ChatButton>
        ) : (
          <ChatButton onClick={Chatting}>채팅창열기</ChatButton>
        )}

        <ChatButton onClick={voteDayStart}>다음 state</ChatButton>
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
