import React from 'react';
import styled from 'styled-components';
import Video from './Video';
import IngameHeader from '../components/IngameHeader';
import Footer from '../components/Footer';
import blueDoor from '../images/blueDoor.png';
import WinEffect from '../images/WinEffect.gif';
import { useDispatch } from 'react-redux';
import { actionCreators as roomActions } from '../redux/modules/room';
import { history } from '../redux/configureStore';
import click from '../sound/Click Sound.mp3';

// 게임 결과 창

const Result = () => {
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

  return (
    <React.Fragment>
      <Wrap>
        <div
          style={{
            width: '100%',
            boxShadow: '0px 5px 5px gray',
          }}
        >
          <IngameHeader />
        </div>
        <WinnerWrap>
          <H1 height="auto"> ~~ 의 승리!</H1>
          <Win src={WinEffect}>
            <Winner>
              <Video />
            </Winner>
          </Win>
        </WinnerWrap>
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
  background-color: #ffe179;
`;

const H1 = styled.p`
  width: 50vw;
  margin: auto;
  font-size: 48px;
  text-align: center;
  padding: 30px;
`;

const WinnerWrap = styled.div`
  width: 100%;
  height: 100vh;
`;

const Win = styled.div`
  width: 80%;
  height: 100vh;
  margin: auto;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url('${(props) => props.src}');
`;

const Winner = styled.div`
  margin: 0px 10% 0px 10%;
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
