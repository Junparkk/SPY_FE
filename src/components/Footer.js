import React from 'react';
import styled from 'styled-components';
import { useState, useEffect } from 'react';

const Footer = () => {
  return (
    <Wrap>
      <Introduce>
        <Name>
          <span style={{ fontSize: '1.2rem',}}>제작</span>
          <br />
          <br />
          <span>정한나(BE)</span>
          <br />
          <span>박효준(FE)</span>
          <br />
          <span>오세웅(BE)</span>
          <br />
          <span>신병우(FE)</span>
          <br />
          <span>최창웅(BE)</span>
          <br />
          <span>김양수(FE)</span>
          <br />
          <span>김상희(Design)</span>
          <br />
          <span>최지원(Design)</span>
          <br />
        </Name>
        <Url>
          <span>
            <a style={{color: "#dedede"}} href="https://github.com/kiwihannah">
              https://github.com/kiwihannah
            </a>
          </span>
          <br />
          <span>
            <a style={{color: "#dedede"}} href="https://github.com/Junparkk">
              https://github.com/Junparkk
            </a>
          </span>
          <br />
          <span>
            <a style={{color: "#dedede"}} href="https://github.com/osw0124">https://github.com/osw0124</a>
          </span>
          <br />
          <span>
            <a style={{color: "#dedede"}} href="https://github.com/ShinByoungWoo">
              https://github.com/ShinByoungWoo
            </a>
          </span>
          <br />
          <span>
            <a style={{color: "#dedede"}} href="https://github.com/daonez">https://github.com/daonez</a>
          </span>
          <br />
          <span>
            <a style={{color: "#dedede"}} href="https://github.com/Ryangsu">https://github.com/Ryangsu</a>
          </span>
          <br />
          <span></span>
          <br />
          <span></span>
          <br />
        </Url>
      </Introduce>
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 100%;
  height: 280px;
  justify-content: space-between;
  background-color: #6164cedd;
  position: relative;
  bottom: 0;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 0px 15px 3px;
`;

const Introduce = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  font-family: 'yg-jalnan';
  font-size: 0.7rem;
  letter-spacing: 1px;
  line-height: 23px;
  color: #dedede;
`;
const Name = styled.div`
  margin: 20px 0px 0px 15%;
  min-width: 150px;
`;

const Url = styled.div`
  margin: 68px 0px 0px -10%;
  @media screen and (max-width: 667px) { margin: 68px 0px 0px 100px;
  }
`;

export default Footer;
