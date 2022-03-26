import React, { Component } from 'react';
import OpenViduVideoComponent from './OvVideo';
import './UserVideo.css';
import UserProfile from './components/UserProfile';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import User from './redux/modules/user';

const UserVideoComponent = ({
  streamManager,
  speaking,
  session,
  publisher,
}) => {
  const [subspeaking, setSubspeaking] = React.useState(false);
  const roomUserList = useSelector((state) => state.vote.userList);
  console.log(roomUserList);

  const getNicknameTag = () => {
    return JSON.parse(streamManager.stream.connection.data).clientData;
  };

  return (
    <>
      {streamManager !== undefined ? (
        <VideoBox className={speaking ? 'speaking' : ''}>
          <div className="streamcomponent">
            <OpenViduVideoComponent streamManager={streamManager} />
            <Text>{getNicknameTag()}</Text>
          </div>
          <UserProfile />
        </VideoBox>
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
  margin: 0px 0px 0px 20px;
  font-family: 'yg-jalnan';
  @media screen and (max-width: 1251px) {
    margin: -55px 0px 0px 0px;
  }
`;

const UserLogo = styled.div`
  position: absolute;
  top: 330px;
  left: 200px;
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
