import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import blueDoor from '../images/blueDoor.png';
import Header from '../components/Header';
import Advertisement from '../images/Advertisement.png';

//효과음
import click from '../sound/Click Sound.mp3';
import OpenDoor from '../sound/Door Open.mp3';

import JobCheckModal from '../components/JobCheckModal';
import VoteModal from '../components/VoteModal';
import RoomCard from '../components/RoomCard';
import PasswordModal from '../components/PasswordModal';

import { actionCreators as roomActions } from '../redux/modules/room';

import { apis } from '../shared/apis';
import Footer from '../components/Footer';

const Main = (props) => {
  //방버튼 스크롤 이벤트
  const [ScrollY, setScrollY] = useState(0);

  const handleFollow = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    const watch = () => {
      window.addEventListener('scroll', handleFollow);
    };
    watch();
    return () => window.removeEventListener('scroll', handleFollow);
  });

  //효과음
  const sound = new Audio(click);
  const DoorOpen = new Audio(OpenDoor);

  const MakingRoom = () => {
    sound.play();
    history.push('/makingroom');
  };

  const Servey = () => {
    sound.play();
    window.location.href = 'https://forms.gle/Ejgiz8yHU56zrBZNA';
  };

  //모든 브라우저 스크롤 맥스값
  const maxScroll = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight
  );
  const dispatch = useDispatch();
  const islogin = localStorage.getItem('nickname');
  const userId = localStorage.getItem('userid');
  const { history } = props;
  const room_list = useSelector((state) => state.room.list);
  const room_length = room_list.map((room) => room).length;

  const _private = useSelector((state) => state.room.roomState.privateState);

    console.log(ScrollY)
    console.log(maxScroll)
  //방 리스트 불러오기
  useEffect(() => {
    dispatch(roomActions.getRoomAPI());
  }, []);

  return (
    <React.Fragment>
      {/* 패스워드 모달 */}
      {_private ? <PasswordModal /> : null}
      {/* 대기실 화면 */}
      <Wrap className={room_length < 9 ? 'change' : ''}>
        <div
          style={{
            position: 'fixed',
            width: '100%',
            zIndex: '50',
            boxShadow: '0px 5px 5px gray',
          }}
        >
          <Header />
        </div>
        <Adv src={Advertisement} onClick={Servey} />
        <Container>
          {room_list &&
            room_list.map((p, idx) => {
              if (p.roomPwd === null) {
                return (
                  <Cards
                    key={idx}
                    onClick={() => {
                      DoorOpen.play();
                      console.log('비번 없는 방 입장');
                      const moveTimer = setTimeout(() => {
                        dispatch(roomActions.enterRoomDB(userId, p.id));
                      }, 1000);
                      return () => clearTimeout(moveTimer);
                    }}
                  >
                    <RoomCard key={p.id} {...p}></RoomCard>
                  </Cards>
                );
              } else {
                return (
                  <Cards
                    onClick={() => {
                      DoorOpen.play();
                      dispatch(roomActions.privateRoom(p.id, true));
                      console.log('나는 널이 아니오');
                      console.log('비번달기용', p.roomPwd);
                    }}
                  >
                    <RoomCard key={p.id} {...p}></RoomCard>
                  </Cards>
                );
              }
            })}
        </Container>
        <EnterRoomBtn className={maxScroll - ScrollY < 1250 ? 'change' : '' } onClick={MakingRoom}>
          <span
            style={{
              fontFamily: 'yg-jalnan',
              color: '#ffe179',
            }}
          >
            방<br />만<br />들<br />기
          </span>
        </EnterRoomBtn>
      </Wrap>
      <FooterBox>
        <Footer />
      </FooterBox>
    </React.Fragment>
  );
};

const Cards = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 300px;
`;
const Wrap = styled.div`
  height: auto;
  min-height: 100%;
  background-color: #ffe179;
  overflow: auto;
  padding-bottom: 100px;
  &.change {
    /* height: 1200px;
    min-height: 1200px; */
  }
`;

const Adv = styled.div`
  margin: 100px auto 50px auto;
  width: 808px;
  height: 100px;
  cursor: pointer;
  box-shadow: 5px 5px 5px gray;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url('${(props) => props.src}');
  @media screen and (max-width: 960px) {
    width: 566.2px;
    height: 70px;
  }
  @media screen and (max-width: 663px) {
    width: 485px;
    height: 60px;
  }
`;

const Container = styled.div`
  display: grid;
  /* background-color: #ffe179; */
  /* height: 100%; */
  padding-top: 0px;
  grid-template-columns: repeat(5, 150px);
  grid-template-rows: repeat(auto-fit, 300px);
  gap: 0px 100px;
  justify-content: center;

  @media screen and (min-width: 1607px) {
    grid-template-columns: repeat(5, 150px);
  }
  @media screen and (min-width: 960px) and (max-width: 1607px) {
    grid-template-columns: repeat(4, 150px);
  }
  @media screen and (min-width: 551px) and (max-width: 960px) {
    grid-template-columns: repeat(3, 150px);
  }
  @media screen and (min-width: 0px) and (max-width: 551px) {
    grid-template-columns: repeat(2, 100px);
    gap: 50px 100px;
  }
`;

const EnterRoomBtn = styled.button`
  position: fixed;
  &.change{
    position: absolute;
    bottom: -260px;
  }
  bottom: 20px;
  right: 100px;
  width: 4rem;
  height: 8rem;
  border: none;
  border-radius: 16px;
  background: url('${blueDoor}') no-repeat 0 0 / 100% 100%;
  color: white;
  font-weight: bold;
  font-size: 18px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  :hover {
    cursor: pointer;
  }
  z-index: 50;
  @media (max-width: 763px) {
    width: 3rem;
    height: 6rem;
    right: 30px;
    font-size: 14px;
  }
`;

const FooterBox = styled.div`
  width: 100%;
  position: relative;
`;

export default Main;
