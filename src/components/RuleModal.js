import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Slider from '../components/Slider/Slider';

//효과음
import click from '../sound/Click Sound.mp3';

const RuleModal = ({ showModal, setShowModal }) => {

  const modalRef = useRef();

  const closeBtn = (e) => {
    if (modalRef.current === e.target) showModal(false);
  };

  const keyPress = useCallback(
    (e) => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
      }
    },
    [setShowModal, showModal]
  );

  useEffect(() => {
    document.addEventListener('keydown', keyPress);
    return () => document.removeEventListener('keydown', keyPress);
  }, [keyPress]);

  return (
    <>
      {showModal ? (
        <ModalBg onClick={closeBtn} ref={modalRef}>
          <WrapModal showModal={showModal}>
            <div>
              <Slider setShowModal={setShowModal} />
            </div>
          </WrapModal>
        </ModalBg>
      ) : null}
    </>
  );
};

const WrapModal = styled.div`
  width: 65%;
  height: 80%;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: #212121;
  color: #000;
  display: flex;
  /* grid-template-columns: 1fr 1fr; */
  position: relative;
  z-index: 10;
  text-align: center;
  justify-content: center;
  align-items: center;
  @media (max-width: 600) {
    width: 50rem;
  }
`;

const ModalBg = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
`;


export default RuleModal;
