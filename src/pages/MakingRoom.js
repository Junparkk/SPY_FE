import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { actionCreators as roomActions } from '../redux/modules/room';

// 컴포넌트

//리액트 아이콘
import { AiFillLock, AiFillUnlock } from 'react-icons/ai';
import { BsFillDoorClosedFill } from 'react-icons/bs';

const Markingroom = () => {
  const dispatch = useDispatch();
  const hostName = localStorage.getItem('nickname');
  const userId = localStorage.getItem('userid');
  const [createRoom, setCreateRoom] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomPwd, setRoomPwd] = useState(null);
  console.log(userId);
  //인원디폴트 6(명)
  // const [maxPlayer, setMaxPlayer] = useState(6);
  const countAnt = useRef();
  // 방 문짝 선택 디폴트(0) 맨앞에꺼
  const [count, setCount] = useState(6);

  const [roomLock, setRoomLock] = useState(false);

  const RoomCreate = () => {
    if (roomName === '') {
      window.alert('방 제목을 입력해주세요.');
      return;
    }
    dispatch(roomActions.createRoomDB(roomName, count, roomPwd, userId));
    window.alert("방 생성 완료")
  };

  return (
    <React.Fragment>
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
              placeholder="비밀번호"
            />
          ) : null}
          <RoomBtn onClick={RoomCreate}>완료</RoomBtn>
        </LeftArea>

        <RightArea>
          <RoomSet>
            <SetTitle>인원</SetTitle>
            <p style={{ padding: '10px' }}>인원을 조정해 보세요!</p>

            <AntDiv>
              {Array.from({ length: 10 }, (Ants, index) => {
                return (
                  <Ant
                    key={index}
                    onClick={() => {
                      if (index + 1 < 6) {
                        window.alert(
                          '게임 최소 인원은 6명입니다. 다시 설정해주세요.'
                        );
                        return;
                      }
                      setCount(index + 1);
                    }}
                    style={{
                      background: count < index + 1 ? '#918280' : 'yellow',
                    }}
                  />
                );
              })}
            </AntDiv>

            <SetTitle>문 모양</SetTitle>
            <p style={{ padding: '10px' }}>
              문의 모양과 좋아하는 색을 골라 선택하세요
            </p>

            <br />
            <div>문 사진</div>
            <br />
            <div>문 사진</div>
            <br />
            <div>문 사진</div>
            <br />
            <div>문 사진</div>
            <br />
          </RoomSet>
        </RightArea>
      </Wrap>
    </React.Fragment>
  );
};

const Wrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  background-color: #ffe179;
`;

const LeftArea = styled.div`
  width: 100%;
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
  border-radius: 10%;
  background-color: rgba(146, 150, 253, 0.2);
  padding: 20px;
  margin-top: 30px;
`;

const SetTitle = styled.p`
  font-size: 26px;
  line-height: 26px;
  font-weight: bold;
`;

const AntDiv = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 400px;
  margin: auto;
`;

const Ant = styled.div`
  width: 56px;
  height: 56px;
  margin: 9.5px;
  border-radius: 50%;
  background-image: url('../spy.png');
  background-size: cover;
  border: 1px solid black;
  cursor: pointer;
`;

// mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm

export default Markingroom;
