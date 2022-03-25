import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import blueDoor from '../images/blueDoor.png';
import Header from '../components/Header';

import JobCheckModal from '../components/JobCheckModal';
import VoteModal from '../components/VoteModal';
import RoomCard from '../components/RoomCard';
import InviteAlarm from '../components/InviteAlarm';
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

  //모든 브라우저 스크롤 맥스값
  const maxScroll = document.body.scrollHeight - window.scrollY;
  console.log(maxScroll);

  const dispatch = useDispatch();
  const islogin = localStorage.getItem('nickname');
  const userId = localStorage.getItem('userid');
  const { history } = props;
  const room_list = useSelector((state) => state.room.list);

  const _private = useSelector((state) => state.room.roomState.privateState);

  //방 리스트 불러오기
  useEffect(() => {
    dispatch(roomActions.getRoomAPI());
  }, []);

  return (
    <React.Fragment>
      {/* 패스워드 모달 */}
      {_private ? <PasswordModal /> : null}
      {/* 대기실 화면 */}
      <Wrap>
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
        <Container>
          {room_list &&
            room_list.map((p, idx) => {
              if (p.roomPwd === null) {
                return (
                  <Cards key={idx}
                    onClick={() => {
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
        <EnterRoomBtn
          //이게 왜 안되는지 모르겠네
          className={ScrollY > maxScroll - 300 ? 'change' : ''}
          onClick={() => history.push('/makingroom')}
        >
          <span
            style={{
              fontFamily: 'yg-jalnan',
              color: '#ffe179',
            }}
          >
            방<br />만<br />들<br />기
          </span>
        </EnterRoomBtn>
        <Footer />
      </Wrap>
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
  height: 100vh;
  background-color: #ffe179;
  overflow: auto;
`;
const Container = styled.div`
  display: grid;
  /* background-color: #ffe179; */
  /* height: 100%; */
  padding-top: 200px;
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
  &.change {
    position: absolute;
  }
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

export default Main;
