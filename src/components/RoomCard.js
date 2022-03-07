import React from 'react';
import styled from 'styled-components';

const RoomCard = (props) => {
  console.log('hi', props);
  const testImg = React.useRef(null);
  const openDoor = () => {
    console.log(testImg.current.style.transform);
    testImg.current.style.transform = 'rotateY(-90deg)';
  };

  return (
    <>
      <Cards onClick={() => openDoor()}>
        <InsideDoor>
          <DoorImgArea ref={testImg}></DoorImgArea>
        </InsideDoor>
        <TextArea>
          <Title>{props.roomName}</Title>
          <Player>
            {props.currPlayer} / {props.maxPlayer}
          </Player>
        </TextArea>
      </Cards>
    </>
  );
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
  width: 100%;
  height: 100%;
  background-color: black;
  transform-style: preserve-3d;
  transform: perspective(1500px);
`;

const DoorImgArea = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: url('https://previews.123rf.com/images/jemastock/jemastock1704/jemastock170410934/76579488-ilustración-de-vector-de-contorno-de-puerta-entrada-cercana-de-madera.jpg')
    no-repeat 0 0 / 100% 100%;
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

const Title = styled.p``;

const Player = styled.p``;
export default RoomCard;
