import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';

import { IoMdClose } from 'react-icons/io';

const RuleModal = ({ showModal, setShowModal }) => {
  // const [modal, setModal] = useState(true);
  const modalRef = useRef();

  const closeBtn = (e) => {
    if (modalRef.current === e.target) showModal(false);
  };

  const keyPress = useCallback(
    (e) => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
        console.log('I pressed');
      }
    },
    [setShowModal, showModal]
  );

  useEffect(() => {
    document.addEventListener('keydown', keyPress);
    return () => document.removeEventListener('keydown', keyPress);
  }, [keyPress]);

//모달속 표 데이터
  const columnData = [
    {
      maxPlayer: 6,
      employee: 3,
      lawyer: 0,
      detective: 1,
      spy: 2
    },
    {
      maxPlayer: 7,
      employee: 3,
      lawyer: 1,
      detective: 1,
      spy: 2
    },
    {
      maxPlayer: 8,
      employee: 4,
      lawyer: 1,
      detective: 1,
      spy: 2
    },
    {
      maxPlayer: 9,
      employee: 4,
      lawyer: 1,
      detective: 1,
      spy: 3
    },
    {
      maxPlayer: 10,
      employee: 5,
      lawyer: 1,
      detective: 1,
      spy: 3
    },
]
  return (
    <>
      {showModal ? (
        <ModalBg onClick={closeBtn} ref={modalRef}>
          <WrapModal showModal={showModal}>
            <ModalContent>
              <ModalTitle>총 인원에 따른 직업 수</ModalTitle>
             <p>최대 6명 - 일반직원 3명, 변호사 1명, 스파이 2명</p>
             <p>최대 7명 - 일반직원 3명, 변호사 1명, 탐정 1명, 스파이 2명</p>
             <p>최대 8명 - 일반직원 4명, 변호사 1명, 탐정 1명, 스파이 2명</p>
             <p>최대 9명 - 일반직원 4명, 변호사 1명, 탐정 1명, 스파이 2명</p>
             <p>최대 10명 - 일반직원 5명, 변호사 1명, 탐정 1명, 스파이 2명</p>


              <p>일반 시민 : 투표를 통해 스파이를 찾아 내세요!</p>
              <p>변호사 : 매 라운드 마다 스파이가 지목한 직원의 강제 퇴사를 막아냅니다.</p>
              <p>탐정: 매 라운드 마다 지목해 상대방의 직업을 파악 할 수 있습니다.</p>
              <p>스파이 : 매 라운드 마다 한명을 지목해 강제 퇴사 시킬 수 있습니다.</p>

              
            </ModalContent>
            <CloseModal onClick={() => setShowModal((prev) => !prev)}>
              <IoMdClose style={{ fontSize: '32px' }} />
            </CloseModal>
          </WrapModal>
        </ModalBg>
      ) : null}
    </>
  );
};

const WrapModal = styled.div`
  width: 800px;
  height: 500px;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: #fff;
  color: #000;
  display: flex;
  /* grid-template-columns: 1fr 1fr; */
  position: relative;
  z-index: 10;
  border-radius: 10px;
  text-align: center;
  justify-content: center;
  align-items: center;
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

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1.8;
  color: #141414;
  p {
    margin-bottom: 1rem;
  }
  /* button {
    padding: 10px 24px;
    background: #141414;
    color: #fff;
    border: none;
  } */
`;

const CloseModal = styled.button`
  cursor: pointer;
  position: absolute;
  border: none;
  background: none;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  padding: 0;
  z-index: 10;
`;

const ModalTitle = styled.h1`
  font-weight: 800;
  font-size: 32px;
  margin-bottom: 24px;
`;


export default RuleModal;
