import React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import Ai from '../images/Ai.png';

const Fired = () => {

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
