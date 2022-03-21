import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { actionCreators as roomActions } from '../redux/modules/room';
import { history } from '../redux/configureStore';

//이미지
import Logo from '../images/Logo.png';
import Null from '../images/Null.png';
import blueDoor from '../images/blueDoor.png';
import pinkDoor from '../images/pinkDoor.png';
import whiteDoor from '../images/whiteDoor.png';

// 컴포넌트
import Header from '../components/Header';

//리액트 아이콘
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { RiArrowGoBackFill, RiQuestionMark } from 'react-icons/ri';

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
      <div
        style={{
          position: 'fixed',
          width: '100%',
          zIndex: '50',
          boxShadow: '0px 5px 5px gray',
        }}
      >
        <Header />
      </div>
      <Wrap>
        <LeftArea bg="yellow" height="700">
          <Door><RiQuestionMark size={150} style={{padding:"33% 10% 10% 10%", color:"#FFE179"}}/></Door>
          <Title>새로운 방을 생성해보세요!</Title>

          <RoomTitle
            onChange={(e) => {
              setRoomName(e.target.value);
            }}
            typd="text"
            maxLength={10}
            placeholder="방 이름"
          />

          <div>
            <PwdBn onClick={() => setRoomLock(true)}>
              <FaLock style={{ fontSize: '30' }} />
            </PwdBn>
            <PwdBn onClick={() => setRoomLock(false)}>
              <FaLockOpen style={{ fontSize: '30' }} />
            </PwdBn>
          </div>
          {roomLock ? (
            <RoomPW
              onChange={(e) => {
                setRoomPwd(e.target.value);
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
              <p
                style={{ padding: '13px', color: '#eeeeee', fontWeight: '600' }}
              >
                클릭 해 인원을 조정해 보세요!
              </p>
              <p
                style={{ padding: '13px', color: '#eeeeee', fontWeight: '600' }}
              >
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
      <BackBt>
        <RiArrowGoBackFill
          onClick={() => {
            history.push('/lobby');
          }}
        />
      </BackBt>
    </React.Fragment>
  );
};

const Wrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  background-color: #ffe179;
  @media screen and (max-width: 986px) {
    display: block;
  }
`;

const Door = styled.div`
  width: 193px;
  height: 269px;
  background-color: #7b7edb;
  border-radius: 10px;
  box-shadow: 5px 5px 5px gray;
`;

const LeftArea = styled.div`
  width: 70%;
  height: 100vh;
  margin-left: 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 986px) {
    margin: auto;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-family: 'yg-jalnan';
  color: #6164ce;
  margin: 50px 0px 40px 10px;
`;

const RoomTitle = styled.input`
  width: 375px;
  height: 50px;
  border: 1px solid #aaaaaaaa;
  border-radius: 45px;
  margin: 10px;
  font-size: 24px;
  padding: 0px 10px;
`;

const RoomPW = styled.input`
  width: 220px;
  height: 30px;
  border: 1px solid #eeeeeeee;
  font-size: 16px;
  border-radius: 19px;
  margin: 10px;
  padding: 0px 10px;
`;

const PwdBn = styled.button`
  border: none;
  background-color: #9296fd;
  color: #ffe179;
  width: 62px;
  height: 62px;
  border-radius: 50%;
  margin: 10px;
  cursor: pointer;
`;

const RoomBtn = styled.button`
  width: 146px;
  border: none;
  height: 50px;
  background-color: #9296fd;
  font-family: 'yg-jalnan';
  font-size: 20px;
  color: #eeeeee;
  border-radius: 45px;
  margin-top: 20px;
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
  @media screen and (max-width: 986px) {
    background-color: #ffe179;
    margin-top: -10%;
  }
`;

const RoomSet = styled.div`
  width: 66%;
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
  width: inherit;
  height: auto;
  margin: 50px auto;
  @media screen and (max-width: 1173px) {
    margin: 20px auto;
  }
`;

const SetTitle = styled.p`
  font-size: 26px;
  line-height: 26px;
  font-family: 'yg-jalnan';
  color: #eeeeee;
  font-weight: bold;
  margin-bottom: 16px;
`;

const AntDiv = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  margin: 49px auto 40px auto;
  justify-content: center;
  align-items: center;
  clear: both;
  @media screen and (max-width: 1173px) {
    margin: auto;
  }
`;

const Ant = styled.img`
  width: 80px;
  height: 80px;
  margin: 10px;
  border-radius: 50%;
  cursor: pointer;
`;

const DoorDiv = styled.div`
  border-radius: 100px solid black;
  width: 70%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  clear: both;
  @media screen and (max-width: 986px) {
    margin: 10% auto
  }
`;

const DoorImg = styled.img`
  width: 30%;
  height: 145.69px;
  padding: 0px 20px 0px 20px;
`;

const BackBt = styled.div`
  position: fixed;
  border-radius: 50%;
  background-color: #9296fd;
  cursor: pointer;
  color: #ffe179;
  padding: 10px;
  top: 850px;
  right: 50px;
  z-index: 5;
  font-size: 50px;
  @media screen and (max-width: 986px) {
    top: 100px;
    right: 30px;
    font-size: 30px;
  }
`;

export default Markingroom;
