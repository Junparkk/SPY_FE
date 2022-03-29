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
  speaking,
  session,
  publisher,
}) => {
  const dispatch = useDispatch();
  const [subspeaking, setSubspeaking] = React.useState(false);
  const roomUserList = useSelector((state) => state.vote.userList);

  const getNicknameTag = () => {
    return JSON.parse(streamManager.stream.connection.data).clientData;
  };
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
  //////////////////////////////////////////////////
  return (
    <>
      {streamManager !== undefined ? (
        <div>
          <VideoBox className={speaking ? 'speaking' : ''}>
            <div className="streamcomponent">
              <OpenViduVideoComponent streamManager={streamManager} />
            </div>
            <PubUserProfile />
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
