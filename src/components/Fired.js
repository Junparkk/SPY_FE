import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import tam from '../images/tam.png';
import basic from '../images/basic.png';
import byun from '../images/byun.png';
import Ai from '../images/Ai.png';
import { actionCreators as voteActions } from '../redux/modules/vote';

const Fired = ({ roomId }, props) => {
  const { _handleModal, children, ...rest } = props;
  console.log(props);
  const dispatch = useDispatch();
  // const [roomId, setRoomId] = useState()
  const [_roomId, setRoomId] = useState({ roomId });
  const room_id = _roomId.roomId;
  const userId = localStorage.getItem('userid');

  const user_list = useSelector((state) => state.vote.userList);
  // console.log(user_list[0].id);

  const findMe = user_list.filter((user) => user.userId === parseInt(userId));
  console.log(findMe);
  const myRole = findMe[0]?.role;

  console.log(myRole, '내역할은 이거다');

  return createPortal(
    <Container>
      <>
        <Background />
        <ModalBasic>
          <JobCheckImg src={Ai}></JobCheckImg>
          <Contents size="40px">...</Contents>
          <Contents size="40px">당신은 해고 당했어요..</Contents>
          <Contents size="20px">투표 하는 동안 기다려주세요</Contents>
        </ModalBasic>
      </>
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

const ModalBasic = styled.div`
  position: absolute;
  top: 15rem;
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #212121;
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

const ModalSpy = styled.div`
  position: absolute;
  top: 15rem;
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #282828;
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

const ModalByun = styled.div`
  position: absolute;
  top: 15rem;
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #6a3da4;
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

const ModalTam = styled.div`
  position: absolute;
  top: 15rem;
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #bc814f;
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
  margin-top: 20px;
  font-family: 'yg-jalnan';
  font-size: ${(props) => props.size};
`;

const JobCheckImg = styled.div`
  width: 20rem;
  height: 20rem;
  margin-bottom: 20px;
  border-radius: 50%;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url('${(props) => props.src}');
`;

export default Fired;
