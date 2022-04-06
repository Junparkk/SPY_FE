import '../components/Chat.css';
import '../shared/App.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import Chat from '../components/Chat.js';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as roomActions } from '../redux/modules/room';
import { actionCreators as voteActions } from '../redux/modules/vote';
import { actionCreators as userActions } from '../redux/modules/user';
import { useHistory } from 'react-router-dom';

import styled from 'styled-components';
import { useRef } from 'react';
import { RiArrowGoBackFill } from 'react-icons/ri';
import Video from './Video';
import IngameHeader from '../components/IngameHeader';

//효과음
import click from '../sound/Click Sound.mp3';

//컴포넌트
import VoteModal from '../components/VoteModal';
import LawyerVoteModal from '../components/LawyerVoteModal';
import DetectiveVoteModal from '../components/DetectiveVoteModal';
import SpyVoteModal from '../components/SpyVoteModal';
import JobCheckModal from '../components/JobCheckModal';
import { apis } from '../shared/apis';
import VoteDetective from '../components/VoteWaitingModal/VoteDetective';
import VoteSpy from '../components/VoteWaitingModal/VoteSpy';
import VoteLawyer from '../components/VoteWaitingModal/VoteLawyer';
import Fired from '../components/Fired';

import { ToastContainer, toast} from 'react-toastify';
import '../styles/toast.css';


const socket = io.connect('https://mafia.milagros.shop');
// const socket = io.connect('http://localhost:3001');
//socket 서버

function Ingame(props) {
  const history = useHistory();
  //채팅
  const dispatch = useDispatch();
  const userId = localStorage.getItem('userid');
  const roomId = props.match.params.roomId;
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [chatView, setChatView] = useState(false);
  const userNick = localStorage.getItem('nickname');

  //클릭 효과음
  const sound = new Audio(click);

  //채팅창 드레그
  const nodeRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [Opacity, setOpacity] = useState(false);

  const [msg, setMsg] = useState(() => {
    socket.on('getMsgToMe', (voteMsg) => {
     
      setMsg(voteMsg);
    });
    socket.on('getMsg', (voteMsg) => {
 
      setMsg(voteMsg);
    });
  });

  //채팅
  const Chatting = () => {
    setChatView(!chatView);
    sound.play();
  };

  // 여기 socket data를 리듀서에 저장이 가능 한 지 확인 및 구현.
  useEffect(() => {
    joinChat();

    socket.on('readyCnt', (num) => {
    
      setReadyCnt(num.readyCnt);
    });
    socket.on('cancelReady', (num) => {
    
      setReadyCnt(num.readyCnt);
    });

    socket.on('myReadyCnt', (num) => {
  
   
      setReadyCnt(num.myReadyCnt);
    });

    socket.on('myCancelReady', (num) => {
    
      setReadyCnt(num.myReadyCnt);
     
    });
   
  }, []);
 

  useEffect(() => {
    dispatch(userActions.GetUser(userId, roomId));
  }, []);

  // 방 입장 시 socket으로 닉네임 방번호 전송
  const joinChat = () => {
    socket.emit('join_room', { roomId, userId });
    setShowChat(true);
  };
  const leaveRoom = () => {
    sound.play();
    dispatch(roomActions.leaveRoomDB(userId, roomId));
  };
  ////////////////////////////////////////////////////////////////////
  const round = useSelector((state) => state.room.round);
  const [isReady, setIsReady] = useState(false);
  const roomUserList = useSelector((state) => state.vote.userList);
  const changeMaxLength = roomUserList.length;
  const userInfo = useSelector((state) => state.user.userinfo);
  const isVote = useSelector((state) => state.vote._isVote);

  //소켓으로 받아온 값 임시저장용
  const [status, setStatus] = useState('');

  // 각 직업 투표시 띄울 모달
  const [isDayTimeModalShowing, setIsDayTimeModalShowing] = useState(false);
  const [isRoleModalShowing, setIsRoleModalShowing] = useState(false);
  const [isLawyerModalShowing, setIsLawyerModalShowing] = useState(false); //변호사
  const [isDetectiveModalShowing, setIsDetectiveModalShowing] = useState(false); // 탐정
  const [isSpyModalShowing, setIsSpyModalShowing] = useState(false); // 스파이
  const [isVotingLawyer, setIsVotingLawyer] = useState(false); // 변호사 투표 시
  const [isVotingDetective, setIsVotingDetective] = useState(false); // 탐정 투표 시
  const [iVotingSpy, setIsVotingSpy] = useState(false); // 스파이 투표 시
  const [isFired_, setIsFired] = useState(false); //해고 당한 사람이 투표 되는동안 볼 모달
  const [changeDay, setChangeDay] = useState(''); //낮과 밤을 셋팅

  //본인 확인 용도
  const host = roomUserList.filter((user) => user.isHost === 'Y');
  const isLawyer = roomUserList.filter((user) => user.role === 2);
  const aiLawyer = isLawyer.filter((list) => list.isEliminated.includes('N'));
  const isDetective = roomUserList.filter((user) => user.role === 3);
  const isSpy = roomUserList.filter((user) => user.role === 4);
  const aiSpy = isSpy.filter((list) => list.isEliminated.includes('N'));
  const isFired = roomUserList.filter((user) =>
    user.isEliminated.includes('Y')
  ); // 해고당한 명단
  const isFireds = isFired.map((user) => {
    return user.userId;
  });

  const _isFired = isFireds.includes(parseInt(userId));



  // 유저리스트에서 본인 정보만 뽑아
  const findMe = roomUserList.filter(
    (user) => user.userId === parseInt(userId)
  );

  //빈 값 넘겨주는 용도
  const lawyerNullVote = useSelector((state) => state.vote.isLawyerNull);
  const spyNullVote = useSelector((state) => state.vote.isSpyNull);

  //시작했는지 여부 확인용
  const isStart = useSelector((state) => state.room.startCheck);
  const [ready, setReady] = useState(false);
  const readyCheck = useSelector((state) => state.room.readyCheck);

  const doReady = () => {
    sound.play();
    socket.emit('readyCnt', { roomId, userId });

    // dispatch(roomActions.readyCheck(true));
    setIsReady(!isReady);
  };
  const cancelReady = () => {
    socket.emit('cancelReady', { roomId, userId });
    setIsReady(!isReady);

    // dispatch(roomActions.readyCheck(false));
    sound.play();
  };
  const doStart = () => {
    dispatch(roomActions.doStartAPI(roomId, userId, changeMaxLength));
    sound.play();
  };
  //소켓 으로 ready 받기
  const [readyCnt, setReadyCnt] = useState();

  const [isResult, setIsResult] = useState(0);

  //시작하는 기능
  useEffect(() => {
    return () => setStatus('isStart');
  }, [isStart]);

  if (host[0] && host[0].userId !== parseInt(userId)) {
    socket.on('getStatus', (gameStatus) => {
      setStatus(gameStatus.status);
      setMsg(gameStatus.msg);
      setIsResult(gameStatus.isResult);
      dispatch(roomActions.roundNoInfo(gameStatus.roundNo));
    });
  } else {
    socket.on('getStatusToMe', (gameStatus) => {
      dispatch(roomActions.roundNoInfo(gameStatus.roundNo));
      setMsg(gameStatus.msg);
      setIsResult(gameStatus.isResult);
    });
  }

  // 상태가 바뀔 때 마다 유저의 리스트를 받아옴
  useEffect(() => {
    dispatch(voteActions.getUserDB(roomId));
  }, [status, readyCheck]);

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
      finalResultNight,
      modalSpyResult,
      winner;

    switch (status) {
      case 'isStart':
        setStatus('roleGive');
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
        setChangeDay('afternoon');
        toast.success(msg, {
          draggable: false,
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
          pauseOnFocusLoss: false,
          pauseOnHover: false,
        });
        setTimeout(() => {
          toast.success('아침이 밝았습니다.', {
            draggable: false,
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
            pauseOnFocusLoss: false,
            pauseOnHover: false,
          });
        }, 5000);

        console.log('######데이 시작 요청', Date().toString());
        clearTimeout(finalResultNight);
        clearTimeout(showRoleSetTimeOut);
        dayTimeSetTimeOut = setTimeout(dayTime, 10000);
        break;
      case 'voteDay':
        console.log('######투표 시작 요청', Date().toString());
        clearTimeout(dayTimeSetTimeOut);
        voteDaySetTimeOut = setTimeout(voteDay, 5000);
        break;
      case 'invalidVoteCnt':
        console.log('######무효표 처리 시작 요청', Date().toString());
        clearTimeout(voteDaySetTimeOut);
        invalidAndAiVoteCnt = setTimeout(invalidVoteCnt, 500);
        break;
      case 'showResultDay': // 결과가 1,2 가 되면 'winner' 스테이터스로 이동
        console.log('######낮투표 결과 요청', Date().toString());
        dayVoteResult = setTimeout(showResultDay, 500);
        clearTimeout(invalidAndAiVoteCnt);
        break;
      case 'voteNightLawyer':
        setChangeDay('night');
        toast.success(msg, {
          draggable: false,
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
          pauseOnFocusLoss: false,
          pauseOnHover: false,
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
      case 'voteNightSpy':
        console.log('######스파이 투표 요청', Date().toString());
        spyVoteCnt = setTimeout(voteNightSpy, 13000);
        clearTimeout(detectiveVote);
        break;
      case 'showResultNight':
        console.log('######밤 투표 결과 요청', Date().toString());
        modalSpyResult = setTimeout(showResultNight, 5000);
        clearTimeout(spyVoteCnt);
        break;
      case 'finalResult':
        console.log('######라운드 종료 결과 요청', Date().toString());
        finalResultNight = setTimeout(finalResult, 3000);
        clearTimeout(modalSpyResult);
        break;
      case 'winner':
        console.log('++++게임 종료 결과 페이지 요청', Date().toString());
        winner = setTimeout(winnerFn, 1000);
        break;
      default:
        clearTimeout(winner);
    }
  }, [status]);

  //롤부여하기
  const roleGive = () => {
   
    if (host[0] && host[0].userId === parseInt(userId)) {
      console.log('@@@@ roleGive if문 시작');
      dispatch(voteActions.divisionRole(roomId));
      setTimeout(() => {
        setStatus('showRole');
      }, 500);
      // updateStatus();
      //백엔드에서 api 호출을 받고 showRole로 바꿔줌
    }
    toast.success('게임이 시작하였습니다 :)', {
      draggable: false,
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000,
      pauseOnFocusLoss: false,
      pauseOnHover: false,
    });
  };

  //롤보여주기
  const showRole = () => {
    
    setIsRoleModalShowing(true);
    setTimeout(() => {
    
      setIsRoleModalShowing(false);
      if (host[0] && host[0].userId === parseInt(userId)) {
        socket.emit('getStatus', { roomId: roomId, status: 'dayTime' });
        setTimeout(() => {
          setStatus('dayTime');
        }, 500);
      }
    }, 3000);

    // 롤 보여주기가 끝나면 showRole만 호출이 되고 있고
    // 다음 status로 넘겨주는게 필요함
    // if 살아있는 사람중에 첫번쨰라면 소켓으로 요청을 해라~~~~
  };
  //토론시간
  const dayTime = () => {

    if (host[0] && host[0].userId === parseInt(userId)) {
      socket.emit('getStatus', { roomId: roomId, status: 'voteDay' });
      setTimeout(() => {
        setStatus('voteDay');
      }, 500);
    }
  };

  //투표시간
  const voteDay = () => {
    _isFired ? setIsFired(true) : setIsDayTimeModalShowing(true);

    const notiJobRoleTimer = setTimeout(() => {
      setIsFired(false);
      setIsDayTimeModalShowing(false);
    
      if (host[0] && host[0].userId === parseInt(userId)) {
        socket.emit('getStatus', { roomId: roomId, status: 'invalidVoteCnt' });
        setStatus('invalidVoteCnt');
      }
    }, 13000);
    return () => clearTimeout(notiJobRoleTimer);
  };

  //무효표 던지는 시간
  const invalidVoteCnt = () => {
    console.log(round, '<<<< 여기 현재 라운드임 ');

    if (host[0] && host[0].userId === parseInt(userId)) {
      dispatch(voteActions.invalidVote(roomId, round, userId));
      setTimeout(() => {
        setStatus('showResultDay');
      }, 500);
    }
  };

  //낮 투표 결과 확인
  function showResultDay() {
    //호스트만 보내고 값 전체가 받는거 나중
   
    if (host[0].userId === parseInt(userId)) {
      dispatch(voteActions.resultDayTimeVoteAPI(roomId, round));
 
      setTimeout(() => {
        setStatus('voteNightLawyer');
      }, 3000);
    }
  }

  //결과가 나오면 페이지 이동
  function winnerFn() {
    history.replace(`/result/${roomId}`);

  }

  //변호사 투표
  function voteNightLawyer() {

    setTimeout(() => {
      if (isLawyer[0] && isLawyer[0].userId === parseInt(userId)) {
     
        _isFired ? setIsFired(true) : setIsLawyerModalShowing(true);
      } else {
        setIsVotingLawyer(true);
      }
    }, 3000);
    const Timer = setTimeout(async () => {
      setIsLawyerModalShowing(false);
      setIsVotingLawyer(false);
      setIsFired(false);
  
      if (
        isLawyer[0] &&
        isLawyer[0].isAi === 'N' &&
        isLawyer[0].userId === parseInt(userId) &&
        lawyerNullVote === true
      ) {
  
        dispatch(voteActions.lawyerActDB(roomId, null));
      }

      if (host[0] && host[0].userId === parseInt(userId)) {
  
        setTimeout(() => {
          setStatus('voteNightDetective');
        }, 500);

        if (aiLawyer[0] && aiLawyer[0].isAi === 'Y') {
      

          await apis
            .aiLawyerAct(roomId)
            .then(() => {
              setTimeout(() => {
                socket.emit('getStatus', {
                  roomId: roomId,
                  status: 'voteNightDetective',
                });
                setStatus('voteNightDetective');
              }, 500);
           
            })
            .catch(
              (err) => console.log(err),

              socket.emit('getStatus', {
                roomId: roomId,
                status: 'voteNightDetective',
              })
            );
        }
      }
    }, 10000);
    return () => clearTimeout(Timer);
  }
  //탐정 투표
  function voteNightDetective() {
    if (isDetective[0] && isDetective[0].userId === parseInt(userId)) {
      _isFired ? setIsFired(true) : setIsDetectiveModalShowing(true);
    } else {
      setIsVotingDetective(true);
    }

    const Timer1 = setTimeout(() => {
      setIsDetectiveModalShowing(false);
      setIsVotingDetective(false);
      setIsFired(false);

      if (host[0] && host[0].userId === parseInt(userId)) {
        setTimeout(() => {
          socket.emit('getStatus', { roomId: roomId, status: 'voteNightSpy' });
          setStatus('voteNightSpy');
        }, 500);
      }
    }, 10000);

    return () => clearTimeout(Timer1);
  }

  // 스파이 투표
  function voteNightSpy() {
    if (isSpy[0] && isSpy[0].userId === parseInt(userId)) {
      _isFired ? setIsFired(true) : setIsSpyModalShowing(true);
    } else {
      setIsVotingSpy(true);
    }

    const Timer = setTimeout(() => {
      setIsSpyModalShowing(false);
      setIsVotingSpy(false);
      setIsFired(false);
 
      if (
        isSpy[0] &&
        isSpy[0].isAi === 'N' &&
        isSpy[0].userId === parseInt(userId) &&
        isSpy[0].isEliminated.includes('N') &&
        spyNullVote === true
      ) {
        dispatch(voteActions.spyActDB(roomId, null));
      }

      if (host[0] && host[0].userId === parseInt(userId)) {
        setTimeout(() => {
          setStatus('showResultNight');
        }, 500);

        if (aiSpy[0] && aiSpy[0].isAi === 'Y') {
          // false
          apis
            .aiSpyAct(roomId)
            .then((res) =>
              setTimeout(() => {
                console.log(res.data.msg);
                socket.emit('getStatus', {
                  roomId,
                  status: 'showResultNight',
                });
                socket.emit('getMsg', {
                  roomId,
                  msg: res.data.msg,
                }); 
              }, 500)
            )
            .catch((err) =>
              setTimeout(() => {
                socket.emit('getStatus', {
                  roomId,
                  status: 'showResultNight',
                });
                socket.emit('getMsg', {
                  roomId,
                  msg: err,
                }); 
              }, 500)
            );
        }
      }
    }, 10000);
    return () => clearTimeout(Timer);
  }

  //밤 투표결과 확인 요청
  function showResultNight() {
    //스파이 투표여부 초기화
    if (spyNullVote === false) {
      dispatch(voteActions.spyNullVote(true));
    }
    //변호사 투표여부 초기화
    if (lawyerNullVote === false) {
      dispatch(voteActions.lawyerNullVote(true));
    }
    setTimeout(() => {
      socket.emit('getStatus', { roomId: roomId, status: 'finalResult' });
      if (host[0] && host[0].userId === parseInt(userId)) {
        setStatus('finalResult');
      }
    }, 500);
  }

  //아침에 최종 결과 공지
  function finalResult() {
    const Timer = setTimeout(() => {
  
      dispatch(voteActions.voteResult(roomId, userId));

      setStatus('dayTime');
    }, 2000);
    return () => clearTimeout(Timer);
  }

  //////////////////////////////////////////////////////////////////////
  return (
    <>
      <Wrap className={changeDay === 'night' ? 'night' : ''}>
        <ToastContainer className={'toast-container'} />
        {isDayTimeModalShowing && <VoteModal isMe={findMe} roomId={roomId} />}
        {isRoleModalShowing && <JobCheckModal roomId={roomId} />}
        {isLawyerModalShowing && <LawyerVoteModal />}
        {isDetectiveModalShowing && <DetectiveVoteModal />}
        {isSpyModalShowing && <SpyVoteModal />}
        {isVotingLawyer && <VoteLawyer />}
        {isVotingDetective && <VoteDetective />}
        {iVotingSpy && <VoteSpy />}
        {isFired_ && <Fired />}
        <div
          style={{
            width: '100%',
            boxShadow: '0px 5px 5px gray',
          }}
        >
          <IngameHeader readyCnt={readyCnt} status={status} />
        </div>
        <VideoContainer>
          <Video
            roomId={roomId}
            roomUserList={roomUserList}
            userinfo={userInfo}
          />
        </VideoContainer>
        {chatView ? (
          <ChatBox>
            <Chat socket={socket} username={username} roomId={roomId} />
          </ChatBox>
        ) : null}
        <ButtonContainer>
          {round >= 1 ? null : (
            <>
              <GoBack>
                <RiArrowGoBackFill
                  style={{
                    width: '50px',
                    minWidth: '50px',
                    height: '50px',
                    borderRadius: '50px',
                    backgroundColor: '#9296fd',
                    cursor: 'pointer',
                    color: '#ffe179',
                    padding: '10px',
                    marginLeft: '100px',
                    zIndex: '5',
                    boxShadow: '5px 5px 5px gray',
                  }}
                  onClick={leaveRoom}
                />
              </GoBack>
            </>
          )}
          {round >= 1 ? null : (
            <div>
              {findMe[0] && findMe[0].isHost === 'N' ? (
                isReady ? (
                  <ReadyButton onClick={() => cancelReady()}>
                    준비취소
                  </ReadyButton>
                ) : (
                  <ReadyButton onClick={() => doReady()}>준 비</ReadyButton>
                )
              ) : (
                <StartButton onClick={() => doStart()}>시 작</StartButton>
              )}
            </div>
          )}
          {chatView ? (
            <ChatButton onClick={Chatting}>채팅창닫기</ChatButton>
          ) : (
            <ChatButton onClick={Chatting}>채팅창열기</ChatButton>
          )}
        </ButtonContainer>
      </Wrap>
    </>
  );
}

const Wrap = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #ffe179;
  &.night {
    background-color: #32346b;
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  position: absolute;
  left: 10%;
  bottom: 50px;
  @media screen and (max-width: 794px) {
    left: 0%;
  }
  @media screen and (max-width: 663px) {
    position: fixed;
    left: -100px;
  }
`;

const VideoContainer = styled.div`
  width: 100%;
`;

const ReadyButton = styled.div`
  width: 150px;
  min-width: 90px;
  height: 80px;
  font-size: 22px;
  border-radius: 50px;
  background-color: #9296fd;
  text-align: center;
  line-height: 80px;
  font-family: 'yg-jalnan';
  color: white;
  z-index: 5;
  margin-left: 100px;
  cursor: pointer;
  box-shadow: 5px 5px 5px gray;
  @media screen and (max-width: 794px) and (min-width: 663px) {
    margin-left: 75px;
    width: 120px;
    height: 63px;
    font-size: 18px;
    border-radius: 45px;
    line-height: 63px;
  }
  @media screen and (max-width: 663px) {
    margin-left: 0px;
    width: 100px;
    height: 57px;
    font-size: 16px;
    border-radius: 35px;
    line-height: 57px;
  }
`;
const StartButton = styled.div`
  width: 150px;
  min-width: 90px;
  height: 80px;
  font-size: 22px;
  border-radius: 50px;
  background-color: #9296fd;
  text-align: center;
  line-height: 80px;
  font-family: 'yg-jalnan';
  color: white;
  z-index: 5;
  margin-left: 100px;
  cursor: pointer;
  box-shadow: 5px 5px 5px gray;
  @media screen and (max-width: 663px) {
    margin-left: 0px;
    width: 100px;
    height: 57px;
    font-size: 16px;
    border-radius: 35px;
    line-height: 57px;
    bottom: 0;
  }
  @media screen and (max-width: 794px) and (min-width: 663px) {
    margin-left: 75px;
    width: 120px;
    height: 63px;
    font-size: 18px;
    border-radius: 45px;
    line-height: 63px;
  }
`;

const ChatButton = styled.div`
  width: 150px;
  min-width: 90px;
  height: 80px;
  font-size: 22px;
  border-radius: 50px;
  background-color: #9296fd;
  text-align: center;
  line-height: 80px;
  font-family: 'yg-jalnan';
  color: white;
  z-index: 5;
  margin-left: 100px;
  cursor: pointer;
  box-shadow: 5px 5px 5px gray;
  @media screen and (max-width: 663px) {
    margin-left: 0px;
    width: 100px;
    height: 57px;
    font-size: 14px;
    border-radius: 35px;
    line-height: 57px;
  }
  @media screen and (max-width: 794px) and (min-width: 663px) {
    margin-left: 75px;
    width: 120px;
    height: 63px;
    font-size: 18px;
    border-radius: 45px;
    line-height: 63px;
  }
`;

const ChatBox = styled.div`
  position: absolute;
  right: 50px;
  top: 50px;
  float: right;
  z-index: 500;
`;

const GoBack = styled.div`
  @media screen and (max-width: 663px) {
    display: none;
  }
`;

const GoBackMobile = styled.div`
  display: none;
  @media screen and (max-width: 663px) {
    display: flex;
  }
`;

export default Ingame;
