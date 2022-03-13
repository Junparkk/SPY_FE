import React from 'react';
import styled from 'styled-components';
import { useState, useEffect } from 'react';

import { GrGamepad } from 'react-icons/gr';
import RuleModal from './RuleModal';

const Header = () => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };
  // function Sound() {
  //   const [volume, setVolume] = useState(1);
  //   const [muted, setMuted] = useState(false);

  //   return (
  //     <>
  //       <div style={{ display: 'flex' }}>
  //         <div onClick={() => setMuted((m) => !m)}>
  //           {volume === 0 || muted ? (
  //             <GiSpeakerOff size={36} />
  //           ) : (
  //             <GiSpeaker size={36} />
  //           )}
  //         </div>
  //         <div style={{ margin: 'auto' }}>
  //           <input
  //             type="range"
  //             min={0}
  //             max={1}
  //             step={0.02}
  //             value={volume}
  //             onChange={(event) => {
  //               setVolume(event.target.valueAsNumber);
  //             }}
  //           />
  //         </div>
  //       </div>
  //       <button>게임 룰(아이콘)</button>
  //     </>
  //   );
  // }


  return (
    <React.Fragment>
      <Wrap>
        <GrGamepad
          onClick={openModal}
          style={{
            fontSize: '36px',
            cursor: 'pointer',
            padding: '16px',
            position: 'relative',
          }}
        />
      <RuleModal showModal={showModal} setShowModal={setShowModal}/> 
      </Wrap>
    </React.Fragment>
  );
};

const Wrap = styled.div`
  display: flex;
  width: 100%;
  height: 80px;
  justify-content: space-between;
  background-color: #ffe179;
  position: relative;
  top: 0;
  left: 0;
`;

export default Header;
