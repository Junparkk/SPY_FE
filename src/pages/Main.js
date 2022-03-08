import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import JobCheckModal from '../components/JobCheckModal';
import VoteModal from '../components/VoteModal';
import RoomCard from '../components/RoomCard';
import InviteAlarm from '../components/InviteAlarm';

import { actionCreators as roomActions } from '../redux/modules/room';

import { apis } from '../shared/apis';

const Main = (props) => {
  const dispatch = useDispatch();
  const { history } = props;
  const room_list = useSelector((state) => state.room.list);

  //게임 시작 후 역할 모달로 보여주기 (추후에 게임 시작값이 들어오면 true로 바꿔주는 코드로 작성하기)
  const [isShowing, setIsShowing] = useState(true);
  useEffect(() => {
    if (isShowing) {
      const notiTimer = setTimeout(() => {
        setIsShowing(false);
      }, 1000);
      return () => clearTimeout(notiTimer);
    }
  }, [isShowing]);
  //초대 알림 오면 상태 변화
  // const [isInvite, setIsInvite] = useState(true);
  // useEffect(() => {
  //   if (isInvite) {
  //     const notiTimer = setTimeout(() => {
  //       setIsInvite(false);
  //     }, 2000);
  //     return () => clearTimeout(notiTimer);
  //   }
  // }, [isInvite]);

  //방 리스트 불러오기
  useEffect(() => {
    dispatch(roomActions.getRoomAPI());
  }, []);

  return (
    <>
      {/* 초대 알림 */}
      {/* {isInvite && <InviteAlarm children="개똥이"></InviteAlarm>} */}
      {/* 직업모달 테스트 영역 나중에 알맞은 곳으로 이동 예정 */}
      {/* {isShowing && <JobCheckModal children="마퓌아"></JobCheckModal>} */}
      {/* 투표모달 테스트 */}
      {isShowing && <VoteModal children="마퓌아"></VoteModal>}
      {/* 대기실 화면 */}
      <Container>
        {room_list &&
          room_list.map((p, idx) => {
            return (
              <Cards
                onClick={() => {
                  const moveTimer = setTimeout(() => {
                    history.push(`/room/${p.id}`);
                  }, 1000);
                  return () => clearTimeout(moveTimer);
                }}
              >
                <RoomCard key={p.id} {...p}></RoomCard>
              </Cards>
            );
          })}
      </Container>
      <MakeRoomBtn>빠른 시작</MakeRoomBtn>
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

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  @media screen and (min-width: 1607px) {
    grid-template-columns: repeat(5, 1fr);
  }
  @media screen and (min-width: 960px) and (max-width: 1607px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media screen and (min-width: 551px) and (max-width: 960px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media screen and (min-width: 0px) and (max-width: 551px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const MakeRoomBtn = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;

  border: none;
  border-radius: 16px;
  background: royalblue;
  color: white;
  padding: 12px;
  font-weight: bold;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  :hover {
    cursor: pointer;
  }
`;

const EnterRoomBtn = styled.button`
  position: fixed;
  bottom: 20px;
  right: 100px;

  border: none;
  border-radius: 16px;
  background: royalblue;
  color: white;
  padding: 12px;
  font-weight: bold;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  :hover {
    cursor: pointer;
  }
`;

export default Main;
