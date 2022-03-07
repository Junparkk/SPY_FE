import React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';

import JobCheckModal from '../components/JobCheckModal';
import RoomCard from '../components/RoomCard';
import InviteAlarm from '../components/InviteAlarm';

const Main = () => {
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
  const [isInvite, setIsInvite] = useState(true);
  useEffect(() => {
    if (isInvite) {
      const notiTimer = setTimeout(() => {
        setIsInvite(false);
      }, 2000);
      return () => clearTimeout(notiTimer);
    }
  }, [isInvite]);

  return (
    <>
      {/* 초대 알림 */}
      {isInvite && <InviteAlarm children="개똥이"></InviteAlarm>}
      {/* 모달 테스트 영역 나중에 알맞은 곳으로 이동 예정 */}

      {isShowing && <JobCheckModal children="마퓌아"></JobCheckModal>}

      {/* 대기실 화면 */}
      <Container>
        <RoomCard></RoomCard>
        <RoomCard></RoomCard>
        <RoomCard></RoomCard>
        <RoomCard></RoomCard>
        <RoomCard></RoomCard>
        <RoomCard></RoomCard>
        <RoomCard></RoomCard>
      </Container>
      <MakeRoomBtn>빠른 시작</MakeRoomBtn>
      <EnterRoomBtn>방 만들기</EnterRoomBtn>
    </>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
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
