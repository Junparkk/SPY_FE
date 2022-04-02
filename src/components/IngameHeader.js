import React from 'react';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { RiQuestionnaireLine } from 'react-icons/ri';
//이미지
import HeaderTitleLogo from '../images/HeaderTitleLogo.png';
import Ai from '../images/Ai.png';
import yellowNormal from '../images/YellowOutLineNormal.png';

//효과음
import click from '../sound/Click Sound.mp3';

import RuleModal from './RuleModal';

const IngameHeader = (props) => {
  const readyCnt = props.readyCnt;
  const isStart = props.status;

  const [showModal, setShowModal] = useState(false);
  const roomUserList = useSelector((state) => state.vote.userList);
  const round = useSelector((state) => state.room.round);
  const is_Ai = roomUserList.map(
    (user) => user.isAi === 'Y' && user.isEliminated.includes('N')
  );
  const Ai_Num = is_Ai.filter((user) => user === true).length;

  //클릭 효과음
  const sound = new Audio(click);

  const openModal = () => {
    setShowModal(true);
    sound.play();
  };

  return (
    <React.Fragment>
      <Wrap>
        <HeaderTitle src={HeaderTitleLogo} />
        <Aicon src={Ai} /> <AiText>남은 봇 X {Ai_Num}</AiText>
        {isStart === '' ? (
          readyCnt === undefined ? (
            <>
              <BasicIcon src={yellowNormal} />
              <AiText>레디 X 1 </AiText>
            </>
          ) : (
            <>
              <BasicIcon src={yellowNormal} />
              <AiText>레디 X {readyCnt}</AiText>
            </>
          )
        ) : (
          <RoundText>현재 라운드 : {round} </RoundText>
        )}
        <RiQuestionnaireLine
          onClick={openModal}
          style={{
            position: 'absolute',
            right: '20px',
            fontSize: '36px',
            cursor: 'pointer',
            padding: '20px',
            color: '#dddddd',
          }}
        />
        <RuleModal showModal={showModal} setShowModal={setShowModal} />
      </Wrap>
    </React.Fragment>
  );
};
const RoundText = styled.span`
  font-size: 30px;
  font-family: 'yg-jalnan';
  color: #ffe179;
  margin: 25px 0px 0px 50px;
  @media screen and (max-width: 956px) {
    font-size: 20px;
    margin: 30px 0px 0px 20px;
  }
  @media screen and (max-width: 663px) {
    font-size: 14px;
    margin: 33px 0px 0px 15px;
  }
`;

const HeaderTitle = styled.div`
  width: 200px;
  margin: 10px 10px 10px 50px;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url('${(props) => props.src}');
  @media screen and (max-width: 956px) {
    width: 120px;
    margin: 20px 10px 10px 20px;
  }
  @media screen and (max-width: 506px) {
    display: none;
  }
`;
const Aicon = styled.div`
  width: 200px;
  margin: 10px 10px 10px 50px;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url('${(props) => props.src}');
  @media screen and (max-width: 956px) {
    margin: 20px 10px 20px 10px;
  }
  @media screen and (max-width: 663px) {
    margin: 20px 10px 20px 20px;
  }
`;
const BasicIcon = styled.div`
  width: 200px;
  margin: 10px 10px 10px 50px;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url('${(props) => props.src}');
  @media screen and (max-width: 956px) {
    margin: 20px 10px 20px 10px;
  }
  @media screen and (max-width: 663px) {
    margin: 20px 10px 20px 10px;
  }
`;
const AiText = styled.span`
  font-size: 30px;
  font-family: 'yg-jalnan';
  color: #ffe179;
  margin: 25px 0px 0px -120px;
  @media screen and (max-width: 956px) {
    font-size: 20px;
    margin: 30px 0px 0px -160px;
  }
  @media screen and (max-width: 663px) {
    font-size: 14px;
    margin: 33px 0px 0px -160px;
  }
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

export default IngameHeader;
