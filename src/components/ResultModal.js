import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { apis } from '../shared/apis';
import Header from '../components/Header';
import Footer from '../components/Footer';
import blueDoor from '../images/blueDoor.png';
import WinEffect from '../images/WinEffect.gif';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as roomActions } from '../redux/modules/room';
import { history } from '../redux/configureStore';
import io from 'socket.io-client';
import click from '../sound/Click Sound.mp3';
//이미지
import citizenWin from '../images/citizenWin.png'; // 시민 승리시 회장 모습
import spyWin from '../images/spyWin.png'; // 스파이 승리시 회장 모습
import BasicProfile from '../images/BasicProfile.png';
import ByunProfile from '../images/ByunProfile.png';
import SpyProfile from '../images/SpyProfile.png';
import TamProfile from '../images/TamProfile.png';

//게임 결과 모달
const ResultModal = (props) => {
  const [list, setList] = useState([]);
  const socket = io.connect('https://mafia.milagros.shop');
//승리자 명단
const winnerList = props.winnerList
console.log(winnerList, '@@@@@승자 리스트')
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

  const shared = () => {
    sound.play();
  };

  // 방나가기 소켓 요청
//   const leaveRoom = () => {
//     sound.play();
//     socket.emit('leaveRoom', {
//       roomId,
//     });
//     console.log(roomId, '방 나가기 소켓요처어어어엉');
//     history.push('/lobby');
//   };

  // 승리자 리스트 소켓 요청
  //   useEffect(() => {
//   socket.on('winner', (users) => {
//     console.log('@@@@@@ 위너 값이 들어옴 --->');
//     console.log(users);
//     setList(users);
//   });

//   socket.on('winnerforHost', (users) => {
//     console.log('@@@@@@ 방장전용@@@ 위너 값이 들어옴 --->');
//     console.log(users);
//     setList(users);
//   });
  //   }, []);
  
  console.log(list.users, '들어오는 값 ');

  const divideWinner = list.users && list.users[0] === 4;
  console.log(divideWinner);

  return createPortal(
    <Container>
      <Background />
      <ModalBlock>
        <Wrap src={WinEffect}>
          <CEOComent src={divideWinner ? spyWin : citizenWin} />
          <H1 height="auto"> {divideWinner ? '스파이' : '사원들'}의 승리!</H1>
          <WinWrap>
            {list.user &&
              list.users.map((p, idx) => {
                return (
                  <Winner
                    key={p.id}
                    src={
                      p.role === 1
                        ? BasicProfile
                        : p.role === 2
                        ? ByunProfile
                        : p.role === 3
                        ? TamProfile
                        : p.role === 4
                        ? SpyProfile
                        : ''
                    }
                  >
                    <NickName>{p.nickname}</NickName>
                  </Winner>
                );
              })}
          </WinWrap>
        </Wrap>

        {/* 소켓으로 현재 뭐 눌렀는지 통신 & 누르면 비활성화 시키기*/}
      </ModalBlock>
    </Container>,
    document.getElementById('VoteModal')
  );
};

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Background = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
  animation: modal-bg-show 1s;
  @keyframes modal-bg-show {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalBlock = styled.div`
  position: absolute;
  border-radius: 20%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  background: url('${(props) => props.src}') no-repeat center/cover;
  width: 100%;
  height: 100%;
  @media (max-width: 1120px) {
    width: 80%;
  }
  @media (max-width: 50rem) {
    width: 90%;
  }
  min-height: 35rem;
  animation: modal-show 1s;
  @keyframes modal-show {
    from {
      opacity: 0;
      margin-top: -50px;
    }
    to {
      opacity: 1;
      margin-top: 0;
    }
  }
`;

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
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url('${(props) => props.src}');
  z-index: 99999;
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
  color: #494cb2;
  font-family: 'yg-jalnan';
`;

const WinWrap = styled.div`
  width: 100%;
  height: 60%;
  display: grid;
  gap: 30px 50px;
  grid-template-columns: repeat(4, 10rem);
  grid-template-rows: repeat(2, 1fr);
  justify-content: center;
  align-items: center;

  @media screen and (min-width: 1607px) {
    grid-template-columns: repeat(4, 10rem);
  }
  @media screen and (min-width: 1065px) and (max-width: 1607px) {
    grid-template-columns: repeat(4, 10rem);
    grid-template-rows: repeat(3, 1fr);
    gap: 20px 10px;
  }
  @media screen and (min-width: 551px) and (max-width: 1065px) {
    grid-template-columns: repeat(4, 7rem);
    grid-template-rows: repeat(3, 1fr);
    gap: 20px 10px;
  }
`;

const Winner = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: url('${(props) => props.src}') no-repeat center/contain;
  margin: auto;

  @media screen and (min-width: 1065px) and (max-width: 1607px) {
    width: 130px;
    height: 130px;
  }
  @media screen and (min-width: 551px) and (max-width: 1065px) {
    width: 100px;
    height: 100px;
  }
  @media screen and (min-width: 0px) and (max-width: 551px) {
  }
`;

const NickName = styled.h3`
  font-family: 'yg-jalnan';
  margin: 0.5rem;
  font-size: 1rem;
  align-items: center;
  position: relative;
  top: 8rem;
`;

export default ResultModal;
