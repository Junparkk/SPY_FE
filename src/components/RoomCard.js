import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import blueDoor from '../images/blueDoor.png';
import pinkDoor from '../images/pinkDoor.png';
import whiteDoor from '../images/whiteDoor.png';
import SecretWhiteDoor from '../images/SecretWhiteDoor.png';
import SecretPinkDoor from '../images/SecretPinkDoor.png';
import SecretBlueDoor from '../images/SecretBlueDoor.png';
import IngGameBlueDoor from '../images/IngGameBlueDoor.png';
import IngGamePinkDoor from '../images/IngGamePinkDoor.png';
import IngGameWhiteDoor from '../images/IngGameWhiteDoor.png';

//props로 비밀번호 받아서 삼항연산자 출력

const RoomCard = (props) => {
  const secret = props.roomPwd;
  const isPlay = props.onPlay;
  const testImg = React.useRef(null);
  const openDoor = () => {
    testImg.current.style.transform = 'rotateY(-90deg)';
  };

  //6인 이하 방
  if (props.maxPlayer <= 6) {
    return (
      <>
        {secret ? (
          <Cards onClick={() => openDoor()}>
            {isPlay === 'Y' ? (
              <InsideDoor>
                <IngGameBlueDoorImgArea ref={testImg}></IngGameBlueDoorImgArea>
              </InsideDoor>
            ) : (
              <InsideDoor>
                <SecretBlueDoorImgArea ref={testImg}></SecretBlueDoorImgArea>
              </InsideDoor>
            )}
            <TextArea>
              <BlueTitle>{props.roomName}</BlueTitle>
              <Player>
                {props.currPlayer} / {props.maxPlayer}
              </Player>
            </TextArea>
          </Cards>
        ) : (
          <Cards onClick={() => openDoor()}>
            {isPlay === 'Y' ? (
              <InsideDoor>
                <IngGameBlueDoorImgArea ref={testImg}></IngGameBlueDoorImgArea>
              </InsideDoor>
            ) : (
              <InsideDoor>
                <BlueDoorImgArea ref={testImg}></BlueDoorImgArea>
              </InsideDoor>
            )}
            <TextArea>
              <BlueTitle>{props.roomName}</BlueTitle>
              <Player>
                {props.currPlayer} / {props.maxPlayer}
              </Player>
            </TextArea>
          </Cards>
        )}
      </>
    );
  }
  //8인 이하 방
  else if (props.maxPlayer <= 8) {
    return (
      <>
        {secret ? (
          <Cards onClick={() => openDoor()}>
            {isPlay === 'Y' ? (
              <InsideDoor>
                <IngGamePinkDoorImgArea ref={testImg}></IngGamePinkDoorImgArea>
              </InsideDoor>
            ) : (
              <InsideDoor>
                <SecretPinkDoorImgArea ref={testImg}></SecretPinkDoorImgArea>
              </InsideDoor>
            )}
            <TextArea>
              <PinkTitle>{props.roomName}</PinkTitle>
              <Player>
                {props.currPlayer} / {props.maxPlayer}
              </Player>
            </TextArea>
          </Cards>
        ) : (
          <Cards onClick={() => openDoor()}>
            {isPlay === 'Y' ? (
              <InsideDoor>
                <IngGamePinkDoorImgArea ref={testImg}></IngGamePinkDoorImgArea>
              </InsideDoor>
            ) : (
              <InsideDoor>
                <PinkDoorImgArea ref={testImg}></PinkDoorImgArea>
              </InsideDoor>
            )}
            <TextArea>
              <PinkTitle>{props.roomName}</PinkTitle>
              <Player>
                {props.currPlayer} / {props.maxPlayer}
              </Player>
            </TextArea>
          </Cards>
        )}
      </>
    );
  }
  //그 외 방
  else {
    return (
      <>
        {secret ? (
          <Cards onClick={() => openDoor()}>
            {isPlay === 'Y' ? (
              <InsideDoor>
                <IngGameWhiteDoorImgArea
                  ref={testImg}
                ></IngGameWhiteDoorImgArea>
              </InsideDoor>
            ) : (
              <InsideDoor>
                <SecretWhiteDoorImgArea ref={testImg}></SecretWhiteDoorImgArea>
              </InsideDoor>
            )}

            <TextArea>
              <WhiteTitle>{props.roomName}</WhiteTitle>
              <Player>
                {props.currPlayer} / {props.maxPlayer}
              </Player>
            </TextArea>
          </Cards>
        ) : (
          <Cards onClick={() => openDoor()}>
            {isPlay === 'Y' ? (
              <InsideDoor>
                <IngGameWhiteDoorImgArea
                  ref={testImg}
                ></IngGameWhiteDoorImgArea>
              </InsideDoor>
            ) : (
              <InsideDoor>
                <WhiteDoorImgArea ref={testImg}></WhiteDoorImgArea>
              </InsideDoor>
            )}
            <TextArea>
              <WhiteTitle>{props.roomName}</WhiteTitle>
              <Player>
                {props.currPlayer} / {props.maxPlayer}
              </Player>
            </TextArea>
          </Cards>
        )}
      </>
    );
  }
};

const Cards = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 300px;
`;

const InsideDoor = styled.div`
  position: relative;
  width: 146px;
  height: 212px;
  background-color: none;
  transform-style: preserve-3d;
  transform: perspective(1500px);
`;

const WhiteDoorImgArea = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 10px 5px;
  background: url('${whiteDoor}') no-repeat 0 0 / 100% 100%;
  transform-style: preserve-3d;
  transform-origin: left;
  transition: all 1.5s;
  ::after {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 50%;
    left: 15px;
    background-color: white;
    border-radius: 50%;
  }
  /* :hover {
    transform: rotateY(-90deg);
  } */
`;
const SecretWhiteDoorImgArea = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 10px 5px;
  background: url('${SecretWhiteDoor}') no-repeat 0 0 / 100% 100%;
  transform-style: preserve-3d;
  transform-origin: left;
  transition: all 1.5s;
  ::after {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 50%;
    left: 15px;
    background-color: white;
    border-radius: 50%;
  }
  /* :hover {
    transform: rotateY(-90deg);
  } */
`;

const IngGameWhiteDoorImgArea = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 10px 5px;
  background: url('${IngGameWhiteDoor}') no-repeat 0 0 / 100% 100%;
  transform-style: preserve-3d;
  transform-origin: left;
  transition: all 1.5s;
  ::after {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 50%;
    left: 15px;
    background-color: white;
    border-radius: 50%;
  }
  /* :hover {
    transform: rotateY(-90deg);
  } */
`;

const BlueDoorImgArea = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 10px 5px;
  background: url('${blueDoor}') no-repeat 0 0 / 100% 100%;
  transform-style: preserve-3d;
  transform-origin: left;
  transition: all 1.5s;
  ::after {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 50%;
    left: 15px;
    background-color: white;
    border-radius: 50%;
  }
  /* :hover {
    transform: rotateY(-90deg);
  } */
`;

const SecretBlueDoorImgArea = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 10px 5px;
  background: url('${SecretBlueDoor}') no-repeat 0 0 / 100% 100%;
  transform-style: preserve-3d;
  transform-origin: left;
  transition: all 1.5s;
  ::after {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 50%;
    left: 15px;
    background-color: white;
    border-radius: 50%;
  }
  /* :hover {
    transform: rotateY(-90deg);
  } */
`;

const IngGameBlueDoorImgArea = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 10px 5px;
  background: url('${IngGameBlueDoor}') no-repeat 0 0 / 100% 100%;
  transform-style: preserve-3d;
  transform-origin: left;
  transition: all 1.5s;
  ::after {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 50%;
    left: 15px;
    background-color: white;
    border-radius: 50%;
  }
  /* :hover {
    transform: rotateY(-90deg);
  } */
`;

const PinkDoorImgArea = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 10px 5px;
  background: url('${pinkDoor}') no-repeat 0 0 / 100% 100%;
  transform-style: preserve-3d;
  transform-origin: left;
  transition: all 1.5s;
  ::after {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 50%;
    left: 15px;
    background-color: white;
    border-radius: 50%;
  }
  /* :hover {
    transform: rotateY(-90deg);
  } */
`;

const SecretPinkDoorImgArea = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 10px 5px;
  background: url('${SecretPinkDoor}') no-repeat 0 0 / 100% 100%;
  transform-style: preserve-3d;
  transform-origin: left;
  transition: all 1.5s;
  ::after {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 50%;
    left: 15px;
    background-color: white;
    border-radius: 50%;
  }
  /* :hover {
    transform: rotateY(-90deg);
  } */
`;

const IngGamePinkDoorImgArea = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 10px 5px;
  background: url('${IngGamePinkDoor}') no-repeat 0 0 / 100% 100%;
  transform-style: preserve-3d;
  transform-origin: left;
  transition: all 1.5s;
  ::after {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 50%;
    left: 15px;
    background-color: white;
    border-radius: 50%;
  }
  /* :hover {
    transform: rotateY(-90deg);
  } */
`;

const TextArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 0.5;
`;

const BlueTitle = styled.p`
  margin-top: 15px;
  font-family: 'yg-jalnan';
  color: #4d50ac;
`;
const PinkTitle = styled.p`
  margin-top: 15px;
  font-family: 'yg-jalnan';
  color: #fd7971;
`;
const WhiteTitle = styled.p`
  margin-top: 15px;
  font-family: 'yg-jalnan';
  color: #686868;
`;

const Player = styled.p`
  margin-top: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #666666;
`;
export default RoomCard;
