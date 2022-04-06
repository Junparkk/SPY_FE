import React from 'react';
import OpenViduVideoComponent from './OvVideo';
import './UserVideo.css';
import SubUserProfile from './components/SubUserProfile';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import BasicProfileDeath from './images/BasicProfile_Death.png';


import { actionCreators as voteActions } from './redux/modules/vote';

const UserVideoComponent = ({
  streamManager,
  pubspeaking,
  speakingId,
  speaking,
  session,
}) => {
  const [subspeaking, setSubspeaking] = React.useState(false);
  const userInfo = useSelector((state) => state.user.userinfo);
  const is_Live = userInfo.isEliminated;
  const UserSpeaking = speakingId;

  const Id = session.streamManagers;

  const getNicknameTag = () => {
    return JSON.parse(streamManager.stream.connection.data).clientData;
  };

  return (
    <>
      {streamManager !== undefined ? (
        <div>
          {is_Live.includes('N') ? (
            <div>
              <VideoBox
                className={
                  UserSpeaking === Id[3] && subspeaking ? 'speaking' : ''
                }
              >
                <div className="streamcomponent">
                  <OpenViduVideoComponent streamManager={streamManager} />
                </div>
              </VideoBox>
              <Text>
                <span>{getNicknameTag()}</span>
              </Text>
            </div>
          ) : is_Live.includes('Y') ? (
            <div>
              <VideoBox>
                <div>
                  <DeathVideo src={BasicProfileDeath} />
                </div>
                <SubUserProfile />
              </VideoBox>
              <DeathText>
                <span>{getNicknameTag()}</span>
              </DeathText>
            </div>
          ) : (
            ''
          )}
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
    margin: 20px;
  }
`;

const DeathText = styled.div`
  color: #6164ce;
  text-align: center;
  font-family: 'yg-jalnan';
  @media screen and (max-width: 1251px) {
    margin-top: 20px;
  }
`;

const DeathVideo = styled.div`
  width: 250px;
  height: 250px;
  border-radius: 250px;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url('${(props) => props.src}');
  @media screen and (max-width: 1251px) {
    width: 200px;
    height: 200px;
    background-size: cover;
    background-repeat: no-repeat;
    border-radius: 200px;
  }
`;

