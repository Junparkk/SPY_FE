import React, { useEffect } from 'react';
import styled from 'styled-components';
import Video from './Video';
import IngameHeader from '../components/IngameHeader';
import Footer from '../components/Footer';
import blueDoor from '../images/blueDoor.png';
import WinEffect from '../images/WinEffect.gif';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as roomActions } from '../redux/modules/room';
import { history } from '../redux/configureStore';
import click from '../sound/Click Sound.mp3';
//이미지
import citizenWin from '../images/citizenWin.png';
import spyWin from '../images/spyWin.png';

// 게임 결과 창

const Result = (props) => {
  //클릭 효과음
  const sound = new Audio(click);

  //방 버튼 스크롤 컨트롤
  const [ScrollY, setScrollY] = React.useState(0);

  const handleFollow = () => {
    setScrollY(window.scrollY);
  };

  React.useEffect(() => {
    const watch = () => {
      window.addEventListener('scroll', handleFollow);
    };
    watch();
    return () => window.removeEventListener('scroll', handleFollow);
  });

  const dispatch = useDispatch();

  const leaveRoom = () => {
    history.push('/lobby');
    sound.play();
    // dispatch(roomActions.leaveRoomDB(userId, roomId));
  };

  //room Id 필요한지..?
  const reStart = () => {
    sound.play();
    history.goBack();
  };

  const shared = () => {
    sound.play();
  };
  ////////////////////////////////////////////////////////////////////////
  const roomId = props.match.params.roomId;
  console.log(props);

  //결과페이지에서 결과 리스트 불러오기
  useEffect(() => {
    dispatch(roomActions.WinnerDB(roomId));
  }, []);

  //승자 목록
  const winnerList = useSelector((state) => state.room.winner);
  console.log(winnerList, '콘솔 확인');
  console.log(winnerList[0], '콘솔 확인2');
  // console.log(winnerList[0].role, '콘솔 확인3');
  // 직업 구분 4번이면 스파이 아니면 시민
  const divideWinner = winnerList && winnerList[0] === 4;
  console.log(divideWinner);

  // 승자 목록에서 [0] 유저의 롤이 4이면 스파이승리 아니면 시민 승리 제목
  // const title = winnerList[0].role === 4
  // console.log(title)

  return (
    <React.Fragment>
      <IngameHeader />
      <Wrap>
        <CEOComent src={divideWinner ? spyWin : citizenWin} />
        <H1 height="auto"> {divideWinner ? '스파이' : '시민'}의 승리!</H1>
        <Win src={WinEffect}>
          {winnerList.map((p, idx) => {
            <Winner  key={p.id}>
              승리한 사람들 캐릭터 들어가기
            </Winner>;
          })}
        </Win>
        ;
      </Wrap>

      <Footer />
      <Restart className={ScrollY > 0 ? 'Change_Button' : ''} onClick={reStart}>
        <span
          style={{
            fontFamily: 'yg-jalnan',
            color: '#ffe179',
          }}
        >
          다<br />시<br />하<br />기
        </span>
      </Restart>
      <LeaveRoom
        className={ScrollY > 0 ? 'Change_Button' : ''}
        onClick={leaveRoom}
      >
        <span
          style={{
            fontFamily: 'yg-jalnan',
            color: '#ffe179',
          }}
        >
          방<br />나<br />가<br />기
        </span>
      </LeaveRoom>
      <Shared className={ScrollY > 0 ? 'Change_Button' : ''} onClick={shared}>
        <span
          style={{
            fontFamily: 'yg-jalnan',
            color: '#ffe179',
          }}
        >
          공<br />유<br />하<br />기
        </span>
      </Shared>
    </React.Fragment>
  );
};

const Wrap = styled.div`
  width: 100%;
  min-width: 380px;
  height: 100vh;
  min-height: 670px;
  display: flex;
  flex-direction: column;
  background-color: #ffe179;
  justify-content: center;
  align-items: center;
  padding: 50px 30px;
`;

const CEOComent = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  /* margin: auto; */
  background: url('${(props) => props.src}') no-repeat center/contain;
`;

const H1 = styled.p`
  width: 50vw;
  /* margin: auto; */
  text-align: center;
  font-size: 48px;
  font-family: 'Jalnan';
  font-weight: 700;
  padding: 30px;
  
  font-family:yg-jalnan;
`;

const Win = styled.div`
  width: 80%;
  height: 100vh;
  margin: auto;
  border-radius: 1px solid;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url('${(props) => props.src}');
  z-index:99;
`;

const Winner = styled.div`
  display: flex;
  justify-content: center;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: url('${(props) => props.src}') no-repeat center/contain;
  margin: auto;
  cursor: pointer;
`;

const LeaveRoom = styled.button`
  position: fixed;
  bottom: 20px;
  right: 150px;
  width: 4rem;
  height: 8rem;
  border: none;
  border-radius: 16px;
  background: url('${blueDoor}') no-repeat 0 0 / 100% 100%;
  color: white;
  font-weight: bold;
  font-size: 18px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  &.Change_Button {
    position: absolute;
  }
  :hover {
    cursor: pointer;
  }
  @media (max-width: 763px) {
    width: 3rem;
    height: 6rem;
    right: 90px;
    font-size: 14px;
  }
  z-index: 50;
`;

const Restart = styled.button`
  position: fixed;
  bottom: 20px;
  right: 250px;
  width: 4rem;
  height: 8rem;
  border: none;
  border-radius: 16px;
  background: url('${blueDoor}') no-repeat 0 0 / 100% 100%;
  color: white;
  font-weight: bold;
  font-size: 18px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  &.Change_Button {
    position: absolute;
  }
  :hover {
    cursor: pointer;
  }
  @media (max-width: 763px) {
    width: 3rem;
    height: 6rem;
    right: 150px;
    font-size: 14px;
  }
  z-index: 50;
`;

const Shared = styled.button`
  position: fixed;
  bottom: 20px;
  right: 50px;
  width: 4rem;
  height: 8rem;
  border: none;
  border-radius: 16px;
  background: url('${blueDoor}') no-repeat 0 0 / 100% 100%;
  color: white;
  font-weight: bold;
  font-size: 18px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  &.Change_Button {
    position: absolute;
  }
  :hover {
    cursor: pointer;
  }
  @media (max-width: 763px) {
    width: 3rem;
    height: 6rem;
    right: 30px;
    font-size: 14px;
  }
  z-index: 50;
`;

export default Result;
