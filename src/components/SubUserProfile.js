import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import BasicProfile from '../images/BasicProfile.png';
import BasicProfileDeath from '../images/BasicProfile_Death.png';
import MapiaProfile from '../images/Mapia.png';
import { actionCreators as userActions } from '../redux/modules/user';
import { useDispatch } from 'react-redux';

const SubUserProfile = (props) => {
  const userInfo = useSelector((state) => state.user.userinfo);
  const Role = userInfo.role;
  const is_Live = userInfo.isEliminated;
  
  console.log(is_Live);
  console.log(userInfo)
  return (
    <>
      {Role && is_Live === 'N' ? (
        <Wrap>
          <Basic src={BasicProfile} />
        </Wrap>
      ) : Role && is_Live === 'Y' ? (
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
  margin: -90px 0px 0px 180px;
  @media screen and (max-width: 1251px) {
    margin: -120px 0px 0px 150px;
  }
`;

const WrapChange = styled.div`
  position: absolute;
  margin: -75px 0px 0px 180px;
  @media screen and (max-width: 1251px) {
    margin: -55px 0px 0px 150px;
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

export default SubUserProfile;
