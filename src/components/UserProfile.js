import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import BasicProfile from '../images/BasicProfile.png';
import MapiaProfile from '../images/Mapia.png';

const UserProfile = (props) => {
  const roomUserList = useSelector((state) => state.vote.userList);
  const Rule = roomUserList.role;

  return (
    <Wrap>
      {Rule ? (
        <Basic src={Rule === 'mapia' ? MapiaProfile : BasicProfile} />
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

export default UserProfile;
