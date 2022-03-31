import React, { Component, useEffect } from 'react';
import OpenViduVideoComponent from './OvVideo';
import './UserVideo.css';
import SubUserProfile from './components/SubUserProfile';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import User from './redux/modules/user';

import BasicProfileDeath from './images/BasicProfile_Death.png';
import MapiaProfileDeath from './images/SpyProfile_Death.png';
import ByunProfileDeath from './images/ByunProfile_Death.png';
import TamProfileDeath from './images/TamProfile_Death.png';

import { actionCreators as voteActions } from './redux/modules/vote';

const UserVideoComponent = ({
  streamManager,
  speaking,
  id,
  speakingId,
  session,
}) => {
  const [subspeaking, setSubspeaking] = React.useState(false);
  const roomUserList = useSelector((state) => state.vote.userList);
  const Role = roomUserList.map((role) => role.role);
  const userInfo = useSelector((state) => state.user.userinfo);
  const is_Live = userInfo.isEliminated;

  const UserSpeaking = speakingId;
  const Id = id;
  // console.log(Id);
  // console.log(UserSpeaking);

  const Change = () => {
    setSubspeaking(!subspeaking);
  };
  const getNicknameTag = () => {
    return JSON.parse(streamManager.stream.connection.data).clientData;
  };

  // React.useEffect(() => {
  //   setSubspeaking(speaking)
  //   console.log('변환했다');
  //   console.log(subspeaking);
  // }, [speaking]);

  // const mySession = session;

  // mySession.on('streamCreated', (event) => {
  //   var subscriber = mySession.subscribe(event.stream, undefined);

  //   subscriber.on('publisherStartSpeaking', (event) => {
  //     setSubspeaking(true);
  //     console.log('섭스크라이버 시작2222');
  //     console.log(subspeaking);
  //     console.log(event.connection.connectionId)
  //   });
  //   subscriber.on('publisherStopSpeaking', (event) => {
  //     setSubspeaking(false);
  //     console.log('섭스크라이버 종료2222222');
  //     console.log(subspeaking);
  //     console.log(event.connection.connectionId)

  //   });
  // });

  return (
    <>
      {streamManager !== undefined ? (
        <div>
          {is_Live.includes('N') ? (
            <div>
              <VideoBox className={subspeaking ? 'speaking' : ''}>
                <div className="streamcomponent">
                  <OpenViduVideoComponent streamManager={streamManager} />
                </div>
                <SubUserProfile />
                <Button onClick={Change}>ㅇㅇㅇㅇ</Button>
              </VideoBox>
              <Text>
                <span>{getNicknameTag()}</span>
              </Text>
            </div>
          ) : is_Live.includes('Y') ? (
            <div>
              <VideoBox>
                <div>
                  <DeathVideo
                    src={
                      Role === 1
                        ? BasicProfileDeath
                        : Role === 2
                        ? ByunProfileDeath
                        : Role === 3
                        ? TamProfileDeath
                        : Role === 4
                        ? MapiaProfileDeath
                        : BasicProfileDeath
                    }
                  />
                </div>
                <SubUserProfile />
                <Button onClick={Change}>ㅇㅇㅇㅇ</Button>
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

const Button = styled.button`
  position: absolute;
  top: 500px;
`;

/////////class 형 ///////////////////////////
// export default class UserVideoComponent extends Component {
//   state = { subspeaking: false };

//   // componentDidnmount = () => {};

//   // componentWillUnmount = () => {};

//   // componentDidUpdate = (prevProps, prevState) => {
//   //   console.log('===========update===========');
//   //   if (this.props.speaking !== prevProps.speaking) {
//   //     console.log('변화중 ');
//   //     this.setState({
//   //       subspeaking: !this.state.subspeaking,
//   //     });
//   //   }
//   // };
//   Change() {
//     this.setState({ subspeaking: !this.state.subspeaking });
//   }

//   getNicknameTag() {
//     // Gets the nickName of the user
//     // console.log(this.props.streamManager)
//     return JSON.parse(this.props.streamManager.stream.connection.data)
//       .clientData;
//   }

//   render() {
//     const mySession = this.props.session;
//     const publisher = this.props.publisher;
//     console.log(publisher);

//     // mySession.on('publisherStartSpeaking', (event) => {
//     //   this.setState({ subspeaking: true });
//     //   // this.Change();
//     // });
//     // mySession.on('publisherStopSpeaking', (event) => {
//     //   this.setState({ subspeaking: false });
//     //   // this.Change();
//     // });

//     mySession.on('streamCreated', (event) => {
//       var subscriber = mySession.subscribe(event.stream, undefined);

//       subscriber.on('publisherStartSpeaking', (event) => {
//         this.setState({ subspeaking: true });
//         // this.Change();
//       });
//       subscriber.on('publisherStopSpeaking', (event) => {
//         this.setState({ subspeaking: false });
//         // this.Change();
//       });
//     });
//     return (
//       <>
//         {this.props.streamManager !== undefined ? (
//           <VideoBox className={this.state.subspeaking ? 'speaking' : ''}>
//             <div className="streamcomponent">
//               <OpenViduVideoComponent
//                 streamManager={this.props.streamManager}
//               />
//               <Text>{this.getNicknameTag()}</Text>
//             </div>
//             <UserLogo/>
//             {/* <Button
//               onClick={() => {
//                 this.Change();
//               }}
//             >
//               속상한 버튼
//             </Button> */}
//           </VideoBox>
//         ) : null}
//       </>
//     );
//   }
// }
