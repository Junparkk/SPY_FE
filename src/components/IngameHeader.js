import React from 'react';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { history } from '../redux/configureStore';
import { useSelector } from 'react-redux';

import { RiQuestionnaireLine } from 'react-icons/ri';
import HeaderTitleLogo from '../images/HeaderTitleLogo.png';
import Ai from '../images/Ai.png';

//효과음
import click from '../sound/Click Sound.mp3';

import RuleModal from './RuleModal';

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const roomUserList = useSelector((state) => state.vote.userList);
  const is_Ai = roomUserList.map((user) => user.isAi === 'Y');
  const Ai_Num = is_Ai.filter((user) => user === true).length;

  console.log(Ai_Num);

  //클릭 효과음
  const sound = new Audio(click);

  const openModal = () => {
    setShowModal(true);
    sound.play();
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
        <HeaderTitle src={HeaderTitleLogo} />
        <Aicon src={Ai} /> <AiText>남은 봇 X {Ai_Num}</AiText>
        <div>
          <RiQuestionnaireLine
            onClick={openModal}
            style={{
              position: 'fixed',
              right: '20px',
              fontSize: '36px',
              cursor: 'pointer',
              padding: '20px',
              color: '#dddddd',
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
`;
const Aicon = styled.div`
  width: 200px;
  margin: 10px 10px 10px 50px;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url('${(props) => props.src}');
`;

const AiText = styled.span`
  font-size: 30px;
  font-family: 'yg-jalnan';
  color: #ffe179;
  margin: 25px 0px 0px -120px;
`;

const Wrap = styled.div`
  display: flex;
  width: 100%;
  height: 80px;
  background-color: #6164ce;
  position: relative;
  top: 0;
  left: 0;
  z-index: 50;
`;

export default Header;
