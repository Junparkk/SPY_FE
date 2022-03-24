import React from 'react';
import styled from 'styled-components';
import voteSpy from '../../images/voteSpy.png';
import { createPortal } from 'react-dom';

const VoteSpy = () => {
  return createPortal(
    <Container>
      <Background />
      <VoteModal src={voteSpy}></VoteModal>
    </Container>,
    document.getElementById('VoteSpy')
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

const VoteModal = styled.div`
  position: absolute;
  top: 15rem;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url('${(props) => props.src}');

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

export default VoteSpy;
