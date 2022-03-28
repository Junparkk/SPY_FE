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

import io from 'socket.io-client';
import { actionCreators as voteActions } from './redux/modules/vote';

const UserVideoComponent = ({
  streamManager,
  session,
  subscribers,
  speaking,
}) => {
  const dispatch = useDispatch();
  const socket = io.connect('https://mafia.milagros.shop');
  const [subspeaking, setSubspeaking] = React.useState(false);
  const roomUserList = useSelector((state) => state.vote.userList);
  const is_Live = roomUserList.map((role) => role.isEliminated === 'N');
  const Role = roomUserList.map((role) => role.role);

  console.log(is_Live);
  console.log(roomUserList);

  const Change = () => {
    setSubspeaking(!subspeaking);
  };
  const getNicknameTag = () => {
    return JSON.parse(streamManager.stream.connection.data).clientData;
  };

  const mySession = session;

  React.useEffect(() => {
    setSubspeaking(speaking);
    console.log('변환했다');
    console.log(subspeaking);
  }, [speaking]);

  // const mySession = session;

  // mySession.on('streamCreated', (event) => {
  //   var subscriber = mySession.subscribe(event.stream, undefined);

  //   subscriber.on('publisherStartSpeaking', (event) => {
  //     setSubspeaking(!subspeaking);
  //     console.log("섭스크라이버 시작2222")
  //     console.log(subspeaking)
  //   });
  //   subscriber.on('publisherStartSpeaking', (event) => {
  //     setSubspeaking(!subspeaking);
  //     console.log("섭스크라이버 종료2222222")
  //     console.log(subspeaking)

  //     // this.Change();
  //   });
  // });
  /////////////////////준파크추가///////////////////////

  const user = roomUserList.filter(
    (users) => users.nickname === getNicknameTag()
  );
  const findHost = roomUserList.filter((users) => users.isHost === 'Y');
  const isReady = user[0] && user[0].isReady;
  const isStart = user[0] && user[0].role;
  const host = findHost[0] && findHost[0].nickname === getNicknameTag();
  const readyCheck = useSelector((state) => state.room.readyCheck);
  useEffect(() => {
    dispatch(voteActions.getUserDB(roomUserList[0].roomId));
    console.log('실행됨?', roomUserList[0].roomId);
  }, [readyCheck]);

  socket.on('ready', (users) => {
    console.log(users, 'userVideo');
  });

  //////////////////////////////////////////////////
  return (
    <>
      {streamManager !== undefined ? (
        <div>
          {is_Live ? (
            <div>
              <VideoBox className={subspeaking ? 'speaking' : ''}>
                <div className="streamcomponent">
                  <OpenViduVideoComponent streamManager={streamManager} />
                </div>
                <SubUserProfile />
                <Button onClick={Change}>ㅇㅇㅇㅇ</Button>
              </VideoBox>
              <Text>
                <span>
                  {getNicknameTag()}
                  {isReady === 'Y' && isStart === null ? (
                    host ? (
                      <ReadyCheck>방장</ReadyCheck>
                    ) : (
                      <ReadyCheck>준비완료</ReadyCheck>
                    )
                  ) : null}
                </span>
              </Text>
            </div>
          ) : (
            <div>
              <VideoBox className={subspeaking ? 'speaking' : ''}>
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
                <SubUserProfile is_Live={is_Live} />
                <Button onClick={Change}>ㅇㅇㅇㅇ</Button>
              </VideoBox>
              <DeathText>
                <span>{getNicknameTag()}</span>
              </DeathText>
            </div>
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

const ReadyCheck = styled.div`
  left: 30%;
  width: 100%;
  height: 100%;
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
