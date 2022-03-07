import React from 'react';
import styled from 'styled-components';
import Grid from '../elements/Grid';
// import socketio from 'socket.io-client';

//리액트 아이콘
import { GiPartyPopper } from 'react-icons/gi';
import { BsFillDoorClosedFill } from 'react-icons/bs';

import Winner from '../components/Winner';

// 게임 결과 창 

const Result = () => {
 
  return (
    <React.Fragment>
      <Wrap>
        <H1 height="auto"> ~~ 의 승리!</H1>
        <Grid height="auto" is_flex>
          <Image1>
            <GiPartyPopper style={{ fontSize: '200px' }} />
          </Image1>
          <Image2>
            <GiPartyPopper style={{ fontSize: '200px' }} />
          </Image2>
        </Grid>
      
        {/* 승자 화면  Winner은 컴포넌트임*/}
        <Win>
         
          <Winner/>
          <Winner/>
          <Winner/>
          <Winner/>
          

          {/* 위너를 컴포넌트로 빼버리자 */}
          {/* </Room> */}
        </Win>

        {/* 축하멘트/ 퇴장버튼들 */}
        <Grid is_flex height="500px" center>
          <div>회장님 축사</div>
          <Grid height="auto">
            <button>
              <BsFillDoorClosedFill style={{ fontSize: '180px' }} />
            </button>
            <button>
              <BsFillDoorClosedFill style={{ fontSize: '180px' }} />
            </button>
            <button>
              <BsFillDoorClosedFill style={{ fontSize: '180px' }} />
            </button>
          </Grid>
        </Grid>
      </Wrap>
    </React.Fragment>
  );
};

const Wrap = styled.div`
  width: 100%;
  height: 1117px;
`;

const H1 = styled.p`
  width: 50vw;
  margin: auto;
  font-size: 48px;
  text-align: center;
  padding: 30px;
`;

const Win = styled.div`
  height: 300px;
  width: 100%;
  margin: auto;
  display: flex;
  justify-content: center;
  inline-size: auto;
`;

// const Winner = styled.div`
//   width: 270px;
//   height: 270px;
//   border: 1px solid black;
//   border-radius: 50%;
//   margin: 10px;
//   /* overflow: hidden; */
//   /* object-fit: cover; // 실패 */
// `;

const Image1 = styled.div`
  /* align: left; */
`;

const Image2 = styled.div`
  /* align: right; */
`;

export default Result;
