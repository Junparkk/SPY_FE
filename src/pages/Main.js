import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import blueDoor from '../images/blueDoor.png';

import JobCheckModal from '../components/JobCheckModal';
import VoteModal from '../components/VoteModal';
import RoomCard from '../components/RoomCard';
import InviteAlarm from '../components/InviteAlarm';
import PasswordModal from '../components/PasswordModal';

import { actionCreators as roomActions } from '../redux/modules/room';

import { apis } from '../shared/apis';

const Main = (props) => {
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
    <>
      {/* 패스워드 모달 */}
      {_private ? <PasswordModal /> : null}

      {/* 대기실 화면 */}
      <Wrap>
        <Container>
          {room_list &&
            room_list.map((p, idx) => {
              if (p.roomPwd === null) {
                return (
                  <Cards
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
      </Wrap>

      <EnterRoomBtn onClick={() => history.push('/makingroom')}>
        방 만들기
      </EnterRoomBtn>
    </>
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
  /* width: 100vw; */
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
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  :hover {
    cursor: pointer;
  }
`;

export default Main;
