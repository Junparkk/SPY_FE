import React from 'react';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { history } from '../redux/configureStore';

import { RiQuestionnaireLine } from 'react-icons/ri';
import HeaderTitleLogo from '../images/HeaderTitleLogo.png';

import RuleModal from './RuleModal';

const Header = () => {
  const [showModal, setShowModal] = useState(false);

  const LogOut = () => {
    localStorage.removeItem('nickname');
    localStorage.removeItem('userid');
    history.push('/');
  };

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
        <HeaderTitle
          src={HeaderTitleLogo}
          onClick={LogOut}
          style={{ cursor: 'pointer' }}
        />
        <div>
          <LogOutButton onClick={LogOut}>로그아웃</LogOutButton>
          <RiQuestionnaireLine
            onClick={openModal}
            style={{
              fontSize: '36px',
              cursor: 'pointer',
              padding: '20px',
              color: '#f4f4fe',
              marginRight: '10px',
            }}
          />
        </div>
        <RuleModal showModal={showModal} setShowModal={setShowModal} />
      </Wrap>
    </React.Fragment>
  );
};

const HeaderTitle = styled.div`
  width: 200px;
  margin: 10px 10px 10px 50px;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url('${(props) => props.src}');
  @media screen and (max-width: 763px) {
    width: 100px;
   margin-top: 23px;
  }
`;

const LogOutButton = styled.button`
  position: fixed;
  top: 15px;
  right: 100px;
  border: none;
  border-radius: 24px;
  background: #eeeeee;
  color: #6164ce;
  padding: 12px;
  font-weight: bold;
  font-family: 'yg-jalnan';
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  :hover {
    cursor: pointer;
  }
`;

const Wrap = styled.div`
  display: flex;
  width: 100%;
  height: 80px;
  justify-content: space-between;
  background-color: #6164ce;
  position: relative;
  top: 0;
  left: 0;
  z-index: 50;
`;

export default Header;
