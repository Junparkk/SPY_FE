import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Video from './Video';
import { apis } from '../shared/apis';
import Header from '../components/Header';
import Footer from '../components/Footer';
import blueDoor from '../images/blueDoor.png';
import WinEffect from '../images/WinEffect.gif';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as roomActions } from '../redux/modules/room';
import { history } from '../redux/configureStore';

//효과음
import click from '../sound/Click Sound.mp3';
import win from '../sound/Win.mp3';

//이미지
import citizenWin from '../images/citizenWin.png'; // 시민 승리시 회장 모습
import spyWin from '../images/spyWin.png'; // 스파이 승리시 회장 모습
import BasicProfile from '../images/BasicProfile.png';
import ByunProfile from '../images/ByunProfile.png';
import SpyProfile from '../images/SpyProfile.png';
import TamProfile from '../images/TamProfile.png';
import io from 'socket.io-client';

// 게임 결과 창

const Result = (props) => {
  const socket = io.connect('https://mafia.milagros.shop');

  //클릭 효과음
  const sound = new Audio(click);
  const Win = new Audio(win);

  //방 버튼 스크롤 컨트롤
  const [ScrollY, setScrollY] = useState(0);

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

  React.useEffect(() => {
    Win.play();
  }, []);

  const dispatch = useDispatch();

  const leaveRoom = () => {
    // 셋타임 아웃 - 몇초내로 방 자동 나가짐
    // DB삭제 api
    // 이 함수를 유즈이펙트에 넣기
    history.replace('/lobby');
    sound.play();
    // dispatch(roomActions.leaveRoomDB(userId, roomId));
  };

  setTimeout(() => {}, 5000);

  // const reStart = () => {
  //   sound.play();
  //   history.goBack();
  // };

  const shared = () => {
    sound.play();
  };

  const roomId = props.match.params.roomId;
  console.log(roomId, '룸, 아이디');
  const userId = localStorage.getItem('userid');
  console.log(userId, '유져, 아이디');
  const roomUserList = useSelector((state) => state.vote.userList);
  const host = roomUserList.filter((user) => user.isHost === 'Y');
  console.log(host, 's나는 방장이다 맨 ');
  console.log(roomUserList, '@@@@리스트');
  console.log(host[0] && host[0].userId === parseInt(userId), '방장인지 확인');

  // 승자명단
  const users = useSelector((state) => state.room.winner);
  console.log(users);
  useEffect(() => {
    dispatch(roomActions.WinnerDB(roomId, userId));
  }, []);

  // 결과페이지에서 일정 시간이 지나면 방나가기 기능이 실현 되도록
  useEffect(() => {
    setTimeout(() => {
      if (users[0]) {
        dispatch(roomActions.deleteDB(roomId));
      }
    }, 5000);
  });

  //   //결과페이지에서 결과 리스트 불러오기
  //   // const [list, setList] = useState();

  //   setTimeout(() => {
  //     socket.emit('winner', {
  //       roomId,
  //       userId,
  //     });
  //   }, 0);

  // 유저 전체 리스트 > 결과값 0 ~ 2 // 1 : role 1~3  승리 / ㅈㅈ
  // const [list, setList] = useState(() => {
  //   socket.on('winner', (users) => {
  //     console.log(users, '@@@@@@@@@@@@@@@@@@ 새로 만든 소켓 전체');
  //     setList(users);
  //   });
  //   socket.on('winnerToMe', (users) => {
  //     console.log(users, '@@@@@@@@@@@@@@@@@@ 새로 만든 소켓 투미');
  //     setList(users);
  //   });
  // });
  // console.log(list, '소켓 값 받아옴 @@@@@@@@@@@@@@리스트 유즈스테이츠');

  //승자 목록
  // const winUsers = list.users;
  // const divideWinner = users && users[0] === 4;

  const divideWinner = users && users[0]?.role === 4;

  return (
    <React.Fragment>
      <Header />
      <Wrap src={WinEffect}>
        <CEOComent src={divideWinner ? spyWin : citizenWin} />
        <H1 height="auto"> {divideWinner ? '스파이' : '사원들'}의 승리!</H1>
        <WinWrap>
          {users &&
            users.map((p, idx) => {
              return (
                <Winner
                  key={idx}
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
                  <NickName> {p.nickname}</NickName>
                </Winner>
              );
            })}
        </WinWrap>
      </Wrap>

      <Footer />

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
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url('${(props) => props.src}');
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
