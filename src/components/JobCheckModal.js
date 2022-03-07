import React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

const JobCheckModal = (props) => {
  const { _handleModal, children, ...rest } = props;
  return createPortal(
    <Container>
      <Background onClick={_handleModal} />
      <ModalBlock {...rest}>
        <JobCheckImg></JobCheckImg>
        <Contents size="80px">쉿!</Contents>
        <Contents size="40px">당신은 {children}</Contents>
        <Contents size="30px">
          정체를 들키지 않고 직원들의 사직서를 받아내세요
        </Contents>
      </ModalBlock>
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
