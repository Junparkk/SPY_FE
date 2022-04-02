import React from 'react';
import styled from 'styled-components';
import mobileImg from '../images/mobile.png';
const Mobile = () => {
  return (
    <Background>
      <MobileImg src={mobileImg}></MobileImg>
    </Background>
  );
};
const Background = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #ffe179;
`;
const MobileImg = styled.div`
  width: 400px;
  height: 100vh;
  margin: auto;
  background: url('${(props) => props.src}') no-repeat center/cover;
`;
export default Mobile;
