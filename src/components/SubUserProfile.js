import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import BasicProfile from '../images/BasicProfile.png';
import BasicProfileDeath from '../images/BasicProfile_Death.png';

const SubUserProfile = ({deathinfo},props) => {

  return (
    <>
      {deathinfo === true ? (
        <Wrap>
          <Basic src={BasicProfile} />
        </Wrap>
      ) : deathinfo === false ? (
        <WrapChange>
          <Basic src={BasicProfileDeath} />
        </WrapChange>
      ) : (
        ''
      )}
    </>
  );
};

const Wrap = styled.div`
  position: absolute;
  margin: -80px 0px 0px 180px;
  @media screen and (max-width: 1416px) {
    margin: -50px 0px 0px 140px;
  }
`;

const WrapChange = styled.div`
  position: absolute;
  margin: -80px 0px 0px 180px;
  @media screen and (max-width: 1416px) {
    margin: -50px 0px 0px 140px;
  }
`;

const Basic = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 80px;
  box-shadow: 5px 5px 5px gray;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url('${(props) => props.src}');
  @media screen and (max-width: 1416px) {
    width: 60px;
    height: 60px;
    border-radius: 60px;
  }
`;

export default SubUserProfile;
