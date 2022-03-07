import React from 'react';
import styled from 'styled-components';
import Grid from '../elements/Grid';
// import socketio from 'socket.io-client';

//리액트 아이콘
import { GiPartyPopper } from 'react-icons/gi';
import { BsFillDoorClosedFill } from 'react-icons/bs';

import Winner from '../components/Winner';

const Result = () => {
  // const socket = socketio();
  // // const myface = document.getElementById('myface');
  // const myface = useRef();
  // // const muteBtn = document.getElementById('mute');
  // // const cameraBtn = document.getElementById('camera');
  // const muteBtn = useRef();
  // const cameraBtn = useRef();
  // // const camerasSelect = document.getElementById('cameras');
  // const cameraSelect = useRef();
  // const welcome = useRef();
  // const call = useRef();
  // const form = useRef();
  // const [inputVal, setInputVal] = useState('');

  // let myStream;
  // let muted = false;
  // let cameraOff = false;

  // //카메라 값 가져오기
  // async function getCameras() {
  //   try {
  //     const devices = await navigator.mediaDevices.enumerateDevices();
  //     const cameras = devices.filter((device) => device.kind === 'videoinput');
  //     const currentCamera = myStream.getVideoTracks()[0];
  //     cameras.forEach((camera) => {
  //       const option = document.createElement('option');
  //       option.value = camera.deviceId;
  //       option.innerText = camera.label;
  //       if (currentCamera.label === camera.label) {
  //         option.selected = true;
  //       }
  //       cameraSelect.current.appendChild(option);
  //     });
  //     console.log(myStream);
  //     console.log(cameras);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  // //클릭 함수 (설정 끄기 켜기)
  // function handleMuteClick() {
  //   myStream
  //     .getAudioTracks()
  //     .forEach((track) => (track.enabled = !track.enabled));
  //   console.log(myStream.getAudioTracks());
  //   if (muted) {
  //     muteBtn.current.innerText = '음소거';
  //     muted = false;
  //   } else {
  //     muteBtn.current.innerText = '음소거 취소';
  //     muted = true;
  //   }
  // }
  // function handleCameraClick() {
  //   myStream
  //     .getVideoTracks()
  //     .forEach((track) => (track.enabled = !track.enabled));
  //   if (cameraOff) {
  //     cameraBtn.current.innerText = '카메라 끄기';
  //     cameraOff = false;
  //   } else {
  //     cameraBtn.current.innerText = '카메라 켜기';
  //     cameraOff = true;
  //   }
  // }

  // //미디어 가져오기
  // async function getMedia(deviceId) {
  //   const initialConstrains = {
  //     audio: true,
  //     video: { facingMode: 'user' },
  //   };

  //   const cameraConstrains = {
  //     audio: true,
  //     video: { deviceId: { exact: deviceId } },
  //   };

  //   try {
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //     myStream = await navigator.mediaDevices.getUserMedia(
  //       deviceId ? cameraConstrains : initialConstrains
  //     );
  //     // console.log(myStream);
  //     myface.current.srcObject = myStream;
  //     if (!deviceId) {
  //       await getCameras();
  //     }
  //   } catch (e) {
  //     // console.log(e);
  //   }
  // }
  // getMedia();

  // async function handleCameraChange() {
  //   await getMedia(cameraSelect.current.value);
  // }

  

  // // useEffect(() => {
  // //   window.scrollTo({ bottom: 0, left: 0, behavior: "smooth" });
  // // })



  return (
    <React.Fragment>
      <Wrap>
        <H1 height="auto"> ~~ 의 승리!</H1>
        <Grid height="auto" is_flex>
          <Image1>
            <GiPartyPopper style={{ fontSize: '200px' }} />
          </Image1>
          <Image2>
            <GiPartyPopper style={{ fontSize: '200px' }} />
          </Image2>
        </Grid>
      
        {/* 승자 화면 */}
        <Win>
          {/* <Room ref={call}> */}
          {/* <Winner >
            <video
              // id="myface"
              ref={myface}
              playsInline
              autoPlay
              muted
              width="270"
              height="270"
            />
            <button onClick={handleMuteClick} ref={muteBtn}>
              음소거
            </button>
            <button onClick={handleCameraClick} ref={cameraBtn}>
              카메라 끄기
            </button>
            <select ref={cameraSelect} onClick={handleCameraChange}>
              <option value={'device'}>카메라</option>
            </select>
          </Winner>

          
          <Winner></Winner>
          <Winner></Winner> */}
          <Winner/>
          <Winner/>
          <Winner/>
          <Winner/>
          

          {/* 위너를 컴포넌트로 빼버리자 */}
          {/* </Room> */}
        </Win>

        {/* 축하멘트/ 퇴장버튼들 */}
        <Grid is_flex height="500px" center>
          <div>회장님 축사</div>
          <Grid height="auto">
            <button>
              <BsFillDoorClosedFill style={{ fontSize: '180px' }} />
            </button>
            <button>
              <BsFillDoorClosedFill style={{ fontSize: '180px' }} />
            </button>
            <button>
              <BsFillDoorClosedFill style={{ fontSize: '180px' }} />
            </button>
          </Grid>
        </Grid>
      </Wrap>
    </React.Fragment>
  );
};

const Wrap = styled.div`
  width: 100%;
  height: 1117px;
`;

const H1 = styled.p`
  width: 50vw;
  margin: auto;
  font-size: 48px;
  text-align: center;
  padding: 30px;
`;

const Win = styled.div`
  height: 300px;
  width: 100%;
  margin: auto;
  display: flex;
  justify-content: center;
  inline-size: auto;
`;

// const Winner = styled.div`
//   width: 270px;
//   height: 270px;
//   border: 1px solid black;
//   border-radius: 50%;
//   margin: 10px;
//   /* overflow: hidden; */
//   /* object-fit: cover; // 실패 */
// `;

const Image1 = styled.div`
  /* align: left; */
`;

const Image2 = styled.div`
  /* align: right; */
`;

export default Result;
