import React from 'react';
import styled from 'styled-components';
import notFound from '../images/notFound.png';
import { useHistory } from 'react-router-dom';

const NotFound = () => {
  const history = useHistory();
  return (
    <Wrap>
      <BackroundImg src={notFound}>
        <Context>
          <H1>404 </H1>
          <H2>NOT FOUND</H2>
          <P>죄송합니다. 해당 페이지를 찾을 수 없습니다.</P>
          <BackBtn
            onClick={() => {
              history.replace('/lobby');
            }}
          >
            홈으로 가기
          </BackBtn>
        </Context>
      </BackroundImg>
    </Wrap>
  );
};
const Wrap = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  margin: auto;
  @media screen and (max-width: 763px) {
    display: inline-block;
  }
`;

const BackroundImg = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url('${(props) => props.src}');
`;
const Context = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  top: 10rem;
`;

const H1 = styled.h1`
  font-size: 7.5rem;
  font-weight: 900;
  font-family: 'yg-jalnan';
  margin: 1.5rem auto 0 auto;
  padding: 0.5rem;
  color: #494cb2;
`;

const H2 = styled.h2`
  font-size: 4.5rem;
  font-weight: 900;
  font-family: 'yg-jalnan';
  margin: 1rem auto 0 auto;
  padding: 0.5rem;
  color: #494cb2;
`;

const P = styled.p`
  font-size: 1.5rem;
  font-weight: 900;
  margin: auto;
  padding: 0.5rem;
  color: #494cb2;
`;

const BackBtn = styled.button`
  display: block;
  margin: 3rem auto 0 auto;
  width: 5rem;
  border: none;
  border-radius: 38px;
  background-color: #9296fd;
  color: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  height: 3rem;
  cursor: pointer;
`;
export default NotFound;
