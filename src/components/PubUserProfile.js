import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import BasicProfile from '../images/BasicProfile.png';
import MapiaProfile from '../images/Mapia.png';
import ByunProfile from '../images/ByunProfile.png';
import TamProfile from '../images/TamProfile.png';

import BasicProfileDeath from '../images/BasicProfile_Death.png';
import MapiaProfileDeath from '../images/SpyProfile_Death.png';
import ByunProfileDeath from '../images/ByunProfile_Death.png';
import TamProfileDeath from '../images/TamProfile_Death.png';

const PubUserProfile = (props) => {
  const roomUserList = useSelector((state) => state.vote.userList);
  const Role = roomUserList.map((role) => role.role);
  const is_Live = roomUserList.map((role) => role.isEliminated === 'N');

  return (
    <Wrap>
      {Role && is_Live ? (
        <Basic
          src={
            Role === 1
              ? BasicProfile
              : Role === 2
              ? ByunProfile
              : Role === 3
              ? TamProfile
              : Role === 4
              ? MapiaProfile
              : BasicProfile
          }
        />
      ) : Role || is_Live ? (
        <Basic
          src={
            Role === 1
              ? BasicProfileDeath
              : Role === 2
              ? ByunProfileDeath
              : Role === 3
              ? TamProfileDeath
              : Role === 4
              ? MapiaProfileDeath
              : ''
          }
        />
      ) : (
        ''
      )}
    </Wrap>
  );
};

const Wrap = styled.div`
  position: absolute;
  margin: -90px 0px 0px 180px;
  @media screen and (max-width: 1251px) {
    margin: -120px 0px 0px 150px;
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
  @media screen and (max-width: 1251px) {
    width: 60px;
    height: 60px;
    border-radius: 60px;
  }
`;

export default PubUserProfile;
