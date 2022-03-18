import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { actionCreators as roomActions } from '../redux/modules/room';

//이미지
import Logo from '../images/Logo.png';
import Null from '../images/Null.png';
import blueDoor from '../images/blueDoor.png';
import pinkDoor from '../images/pinkDoor.png';
import whiteDoor from '../images/whiteDoor.png';

// 컴포넌트
import Header from '../components/Header';

//리액트 아이콘
import { AiFillLock, AiFillUnlock } from 'react-icons/ai';
import { BsFillDoorClosedFill } from 'react-icons/bs';

const Markingroom = () => {
  const dispatch = useDispatch();
  const hostName = localStorage.getItem('nickname');
  const userId = localStorage.getItem('userid');
  // const [createRoom, setCreateRoom] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomPwd, setRoomPwd] = useState(null);
  console.log(userId);
  //인원디폴트 6(명)
  // const [maxPlayer, setMaxPlayer] = useState(6);
  // 방 문짝 선택 디폴트(0) 맨앞에꺼

  //Ants 카운트
  const [count, setCount] = useState(6);
  console.log(count);
  const [roomLock, setRoomLock] = useState(false);

  //비밀번호 숫자만 입력하게 알럿띄우기(정규표현식)
  // ¯\_( ͡° ͜ʖ ͡°)_/¯ 
  const RoomCreate = () => {
    if (roomName === '') {
      window.alert('방 제목을 입력해주세요.');
      return;
    }
    dispatch(roomActions.createRoomDB(roomName, count, roomPwd, userId));
    window.alert('방 생성 완료');
  };

  return (
    <React.Fragment>
      <Header />
      <Wrap>
        <LeftArea bg="yellow" height="700">
          <BsFillDoorClosedFill style={{ fontSize: '250' }} />

          <Title>새로운 방을 생성해보세요!</Title>

          <RoomTitle
            onChange={(e) => {
              setRoomName(e.target.value);
              console.log(e.target.value);
            }}
            typd="text"
            placeholder="방 이름"
          />

          <div>
            <PwdBn onClick={() => setRoomLock(true)}>
              <AiFillLock style={{ fontSize: '30' }} />
            </PwdBn>
            <PwdBn onClick={() => setRoomLock(false)}>
              <AiFillUnlock style={{ fontSize: '30' }} />
            </PwdBn>
          </div>
          {roomLock ? (
            <RoomPW
              onChange={(e) => {
                setRoomPwd(e.target.value);
                console.log(e.target.value);
              }}
              type="password"
              placeholder="비밀번호(숫자)"
            />
          ) : null}
          <RoomBtn onClick={RoomCreate}>완료</RoomBtn>
        </LeftArea>

        <RightArea>
          <RoomSet>
            <TopText>
              <SetTitle>인원</SetTitle>
              <p style={{ padding: '13px' }}>클릭 해 인원을 조정해 보세요!</p>
              <p style={{ padding: '13px' }}>
                인원수에 따라 방의 모양이 자동으로 설정됩니다.
              </p>
            </TopText>

            <AntDiv>
              {Array.from({ length: 8 }, (Ants, index) => {
                return (
                  <Ant
                    key={index}
                    onClick={() => {
                      // if (index + 1 < 6) {
                      //   window.alert(
                      //     '게임 최소 인원은 6명입니다. 다시 설정해주세요.'
                      //   );
                      //   return;
                      // }
                      setCount(index + 1);
                    }}
                    src={count < index + 1 ? Null : Logo}
                  />
                );
              })}
            </AntDiv>

            <DoorDiv>
              <DoorImg src={whiteDoor} alt="door" />
              <DoorImg src={pinkDoor} alt="door1" />
              <DoorImg src={blueDoor} alt="door2" />
            </DoorDiv>
          </RoomSet>
        </RightArea>
      </Wrap>
    </React.Fragment>
  );
};

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #ffe179;
`;

// const MidWrap = styled.div`
//   width: 1104px;
//   height: 707px;
//   margin: 201px auto 116px auto;
// `;

const LeftArea = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 28px;
  margin: 20px 0px 0px 10px;
`;

const RoomTitle = styled.input`
  width: 375px;
  height: 50px;
  border-radius: 45px;
  margin: 10px;
  font-size: 24px;
  padding: 0px 10px;
`;

const RoomPW = styled.input`
  width: 220px;
  height: 30px;
  font-size: 16px;
  border-radius: 19px;
  margin: 10px;
  padding: 0px 10px;
`;

const PwdBn = styled.button`
  width: 62px;
  height: 62px;
  border-radius: 50%;
  margin: 10px;
  cursor: pointer;
`;

const RoomBtn = styled.button`
  width: 146px;
  height: 50px;
  border-radius: 45px;
  cursor: pointer;
`;

//오른쪽 부분
const RightArea = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const RoomSet = styled.div`
  width: 654px;
  height: 707px;
  border-radius: 95px;
  border: 5px solid #787edb;
  background-color: #9296fd;
  /* padding: 20px; */
  margin-top: 30px;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
`;

const TopText = styled.div`
  width: 500px;
  height: auto;
  margin: 50px auto;
`;

const SetTitle = styled.p`
  font-size: 26px;
  line-height: 26px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const AntDiv = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 300px;
  margin: 49px auto 85px auto;
  justify-content: center;
  align-items: center;
  clear: both;
`;

const Ant = styled.img`
  width: 56px;
  height: 56px;
  margin: 9.5px;
  border-radius: 50%;
  cursor: pointer;
`;

const DoorDiv = styled.div`
  border-radius: 100px solid black;
  width: 500px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  clear: both;
`;

const DoorImg = styled.img`
  width: 100.33px;
  height: 145.69px;
  margin: 0px 30.5px 0px 30.5px;
`;
export default Markingroom;
