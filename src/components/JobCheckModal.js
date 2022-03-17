import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { actionCreators as voteActions } from '../redux/modules/vote';

const JobCheckModal = ({ roomId }, props) => {
  const { _handleModal, children, ...rest } = props;
  console.log(props);
  const dispatch = useDispatch();
  // const [roomId, setRoomId] = useState()
  // const [_roomId, setRoomId] = useState({ roomId });
  // const room_id = _roomId.roomId;
  const userId = localStorage.getItem('userid');

  // console.log(room_id, '룸 아이디!!!');
  console.log(userId, '아이디!!!');

  // 게임 시작 하고 바로 적용 될수 있도록 로직짜기
  // useEffect(() => {
  //   dispatch(voteActions.divisionRole(room_id));
  // }, []);

  const user_list = useSelector((state) => state.vote.userList);
  // console.log(user_list[0].id);

  const findMe = user_list.filter((user) => user.userId === parseInt(userId));
  console.log(findMe);
  const myRole = findMe[0]?.role;

  console.log(myRole, '내역할은 이거다');

  const roles = [
    {
      id: 1,
      role: '평사원',
      desc: '각박한 회사에서 최선을 다해 살아남으세요',
      image: '',
    },
    {
      id: 2,
      role: '변호사',
      desc: '정의로운 통찰력으로 사원들의 무죄를 증명하세요',
      image: '',
    },
    {
      id: 3,
      role: '탐정',
      desc: '남다른 추리력으로 사원들의 정체를  꿰뚫어보세요',
      image: '',
    },
    {
      id: 4,
      role: '산업 스파이',
      desc: '정체를 들키지 않고 지원들의 퇴직서를 받아내세요',
      image: '',
    },
  ];

  console.log(roles[3]);
  return createPortal(
    <Container>
      {(() => {
        if (myRole && myRole === 1) {
          return (
            <>
              <Background />
              <ModalBlock>
                <JobCheckImg>{roles[0].image}</JobCheckImg>
                <Contents size="80px">쉿!</Contents>
                <Contents size="40px">당신은 {roles[0].role}</Contents>
                <Contents size="30px">{roles[0].desc}</Contents>
              </ModalBlock>
            </>
          );
        } else if (myRole && myRole === 2) {
          return (
            <>
              <Background />
              <ModalBlock>
                <JobCheckImg>{roles[1].image}</JobCheckImg>
                <Contents size="80px">쉿!</Contents>
                <Contents size="40px">당신은 {roles[1].role}</Contents>
                <Contents size="30px">{roles[1].desc}</Contents>
              </ModalBlock>
            </>
          );
        } else if (myRole && myRole === 3) {
          return (
            <>
              <Background />
              <ModalBlock>
                <JobCheckImg>{roles[2].image}</JobCheckImg>
                <Contents size="80px">쉿!</Contents>
                <Contents size="40px">당신은 {roles[2].role}</Contents>
                <Contents size="30px">{roles[2].desc}</Contents>
              </ModalBlock>
            </>
          );
        } else if (myRole && myRole === 4) {
          return (
            <>
              <Background />
              <ModalBlock>
                <JobCheckImg>{roles[3].image}</JobCheckImg>
                <Contents size="80px">쉿!</Contents>
                <Contents size="40px">당신은 {roles[3].role}</Contents>
                <Contents size="30px">{roles[3].desc}</Contents>
              </ModalBlock>
            </>
          );
        }
      })()}

      {/* {(() => {
            if(myRole && myRole === 1) {
              // 뷰
            } else if (myRole && myRole === 2) {
              //view
            } else if (myRole && myRole === 3) {
              //view
            } else if (myRole && myRole === 4) {
              //view
            }
          })}
         */}
    </Container>,
    document.getElementById('JobCheckModal')
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
  /* backdrop-filter: blur(5px); */
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
  top: 15rem;
  border-radius: 30px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: black;
  width: 60rem;
  @media (max-width: 1120px) {
    width: 50rem;
  }
  @media (max-width: 50rem) {
    width: 80%;
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

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  font-size: ${(props) => props.size};
`;

const JobCheckImg = styled.div`
  width: 20rem;
  height: 20rem;
  border-radius: 50%;
  background-color: blueviolet;
`;

export default JobCheckModal;
