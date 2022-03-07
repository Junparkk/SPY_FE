import React, { useState } from 'react';
import styled from 'styled-components';
import Grid from '../elements/Grid';
// import Button from '../elements/Button';
// import Text from '../elements/Text';
// import input from '../elements/Text';

// 컴포넌트
import Ants from '../components/Ants';

//리액트 아이콘
import { AiFillLock, AiFillUnlock } from 'react-icons/ai';
import { BsFillDoorClosedFill } from 'react-icons/bs';

// 방입장 화면
// 입장전 게임 설정 등
// 최종 버전으로 만들기
const Markingroom = () => {

  return (
    <React.Fragment>
      <Wrap>
        <Grid bg="yellow" height="700">
          <div>
            <BsFillDoorClosedFill style={{ fontSize: '250' }} />
          </div>
          <div>
            <input typd="text" placeholder="방이름" />
            <AiFillLock />
            <AiFillUnlock />
            <input type="password" placeholder="비밀번호" />
            <button>완료</button>
          </div>
        </Grid>
        <Grid bg="blue" height="700">
          <div className="wrap_div">
            <p>인원</p>
            <p>인원을 조정해 보세요!</p>
            
            <Ants/>

            <p>문 모양</p>
            <p>문의 모양과 좋아하는 색을 골라 선택하세요</p>

            <div>문 사진</div>
          </div>
        </Grid>
      </Wrap>
    </React.Fragment>
  );
};

const Wrap = styled.div`
  width: 100%;
  height: 800px;
  display: flex;
`;

const H1 = styled.p`
  width: 50vw;
  margin: auto;
  font-size: 48px;
  text-align: center;
  padding: 30px;
`;

const TitleSet = styled.div`
  display: flex;
  flex-direction: column;
`;

const Sets = styled.div`
  width: 1500px;
  height: 506px;
  border: none;
  border-radius: 95px;
  background-color: #6f6f6f;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
`;

const Ant = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: yellow;
  border: 1px solid black;
  cursor: pointer;
`;
export default Markingroom;
