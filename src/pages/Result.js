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
// 게임 결과 창



const Result = () => {
  const dispatch = useDispatch()

  const leaveRoom = () => {
    history.push('/lobby')
      // dispatch(roomActions.leaveRoomDB(userId, roomId));
  }

  //room Id 필요한지..?
  const reStart = () => {
    history.goBack()
  }

  const shared = () =>{

  }

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
      <Restart onClick={reStart}>
        <span
          style={{
            fontSize: '18px',
            fontFamily: 'yg-jalnan',
            color: '#ffe179',
          }}
        >
          다<br />시<br />하<br />기
        </span>
      </Restart>
      <LeaveRoom onClick={leaveRoom}>
        <span
          style={{
            fontSize: '18px',
            fontFamily: 'yg-jalnan',
            color: '#ffe179',
          }}
        >
          방<br />나<br />가<br />기
        </span>
      </LeaveRoom>
      <Shared onClick={shared}>
        <span
          style={{
            fontSize: '18px',
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
  height: 100vh;
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
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  :hover {
    cursor: pointer;
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
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  :hover {
    cursor: pointer;
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
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  :hover {
    cursor: pointer;
  }
  z-index: 50;
`;

export default Result;
