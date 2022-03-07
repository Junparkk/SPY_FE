import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import socketio from 'socket.io-client';

// 이긴자들의 값을 데이터로 가져와서 맵으로 반환하면
// 승자들 얼굴만 결과화면에 나올수 있게 하던지
// 전체 얼굴들 중에 승리자는 따로 표시하든지 해보자

const Winner = () => {
  const socket = socketio();
  // const myface = document.getElementById('myface');
  // const muteBtn = document.getElementById('mute');
  // const cameraBtn = document.getElementById('camera');
  // const camerasSelect = document.getElementById('cameras');

  const myface = useRef();
  const muteBtn = useRef();
  const cameraBtn = useRef();
  const cameraSelect = useRef();

  let myStream;
  let muted = false;
  let cameraOff = false;

  //카메라 값 가져오기
  async function getCameras() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((device) => device.kind === 'videoinput');
      const currentCamera = myStream.getVideoTracks()[0];
      cameras.forEach((camera) => {
        const option = document.createElement('option');
        option.value = camera.deviceId;
        option.innerText = camera.label;
        if (currentCamera.label === camera.label) {
          option.selected = true;
        }
        cameraSelect.current.appendChild(option);
      });
      console.log(myStream);
      console.log(cameras);
    } catch (e) {
      console.log(e);
    }
  }

  //클릭 함수 (설정 끄기 켜기)
  function handleMuteClick() {
    myStream
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    console.log(myStream.getAudioTracks());
    if (muted) {
      muteBtn.current.innerText = '음소거';
      muted = false;
    } else {
      muteBtn.current.innerText = '음소거 취소';
      muted = true;
    }
  }
  function handleCameraClick() {
    myStream
      .getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    if (cameraOff) {
      cameraBtn.current.innerText = '카메라 끄기';
      cameraOff = false;
    } else {
      cameraBtn.current.innerText = '카메라 켜기';
      cameraOff = true;
    }
  }

  //미디어 가져오기
  async function getMedia(deviceId) {
    const initialConstrains = {
      audio: true,
      video: { facingMode: 'user' },
    };

    const cameraConstrains = {
      audio: true,
      video: { deviceId: { exact: deviceId } },
    };

    try {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      myStream = await navigator.mediaDevices.getUserMedia(
        deviceId ? cameraConstrains : initialConstrains
      );
      myface.current.srcObject = myStream;
      if (!deviceId) {
        await getCameras();
      }
    } catch (e) {
      console.log(e);
    }
  }
  getMedia();

  async function handleCameraChange() {
    await getMedia(cameraSelect.current.value);
  }

  return (
    <WinnerComp>
      <video
        // id="myface"
        ref={myface}
        playsInline
        autoPlay
        muted
        width="270px"
        height="270px"
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
    </WinnerComp>
  );
};

const WinnerComp = styled.div`
  width: 270px;
  height: 270px;
  border: 1px solid black;
  border-radius: 50%;
  margin: 10px;
  /* overflow: hidden; */
  /* object-fit: cover; // 실패 */
`;

export default Winner;
