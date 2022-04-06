import React, { Component, useEffect } from 'react';
import OpenViduVideoComponent from './OvVideo';
import './UserVideo.css';
import PubUserProfile from './components/PubUserProfile';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import User from './redux/modules/user';
import { actionCreators as voteActions } from './redux/modules/vote';

const UserVideoComponent = ({
  streamManager,
  pubspeaking,
  session,
  publisher,
}) => {
  const [subspeaking, setSubspeaking] = React.useState(false);
  const roomUserList = useSelector((state) => state.vote.userList);
  const userInfo = useSelector((state) => state.user.userinfo);
  const DeathInfo = userInfo.isEliminated;
  const is_Live = DeathInfo.includes('N');

  const getNicknameTag = () => {
    return JSON.parse(streamManager.stream.connection.data).clientData;
  };

  return (
    <>
      {streamManager !== undefined ? (
        <div>
          {is_Live ? (
            <VideoBox className={pubspeaking ? 'speaking' : ''}>
              <div className="streamcomponent">
                <OpenViduVideoComponent streamManager={streamManager} />
              </div>
              <PubUserProfile />
            </VideoBox>
          ) : (
            <VideoBox className={pubspeaking ? 'speaking' : ''}>
              <div className="streamcomponent">
                <OpenViduVideoComponent streamManager={streamManager} />
              </div>
              <PubUserProfile />
            </VideoBox>
          )}

          <Text>
            <span>{getNicknameTag()}</span>
          </Text>
        </div>
      ) : null}
    </>
  );
};

export default UserVideoComponent;

const VideoBox = styled.div`
  width: 250px;
  height: 250px;
  border-radius: 250px;
  margin: 30px auto 30px auto;
  overflow: hidden;
  background-color: #ffe179;
  box-shadow: 5px 5px 5px gray;
  @media screen and (max-width: 1251px) {
    width: 200px;
    height: 200px;
    border-radius: 200px;
    margin: 30px auto 0px auto;
  }
  &.speaking {
    border: 5px solid green;
  }
`;

const Text = styled.div`
  color: #6164ce;
  text-align: center;
  font-family: 'yg-jalnan';
  @media screen and (max-width: 1251px) {
    margin-top: 20px;
  }
`;


