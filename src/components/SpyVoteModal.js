import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { actionCreators as voteActions } from '../redux/modules/vote';

// 이미지
import SpyBG from '../images/SpyBG.png';
import spyNothing from '../images/spyNothing.png';
import BasicProfile from '../images/BasicProfile.png';
import BasicProfile_Death from '../images/BasicProfile_Death.png';
import Ai from '../images/Ai.png';

// 스파이 모달
const SpyVoteModal = (props) => {
  const { isMe, roomId, _handleModal, children, ...rest } = props;
  const dispatch = useDispatch();
  const round = useSelector((state) => state.room.round);
  const user_list = useSelector((state) => state.vote.userList);
  const [voteBtnClicked, setVoteBtnClicked] = useState(null);
  const [submit, setSubmit] = useState(false);
  const [chosenId, setChosenId] = useState(0);
  const [chosenRoomId, setChosenRoomId] = useState(0);
  const Alive = user_list.filter((user) => user.isEliminated === 'N');
  const ref = useRef();

  //빈 값 넘겨줄 때
  const spyNullVote = useSelector((state) => state.vote.isSpyNull);

  //스파이 목록 중 낮은 ID값 한테 투표권 주기
  const spy_list = user_list.filter((user) => user.role === 4);
  const voteSpy = spy_list.sort((a, b) => b - a);
  const spyId = localStorage.getItem('userid');

  console.log(spy_list);
  console.log(voteSpy);
  console.log(spyId);

  // 투표 사람 클릭
  const clicked = (idx) => {
    if (setVoteBtnClicked === null) {
      spyNullVote(true);
    } else {
      setVoteBtnClicked(idx);
      const chosen = user_list[idx];
      setChosenId(chosen.userId);
      setChosenRoomId(chosen.roomId);
      console.log(chosen, '초이슨 스파이');
      console.log(chosenId, '초이슨ID 스파이');
      console.log(chosenRoomId, '초이슨RoomID 스파이');
    }
  };
  console.log(submit, '@@@@@@@@@@@@@@@@@@@@@@@@@제출');
  // 투표 값 서버로 전달
  const submitClicked = () => {
    if (voteBtnClicked !== null) {
      dispatch(voteActions.spyActDB(chosenRoomId, chosenId));
      dispatch(voteActions.spyNullVote(false));
      setSubmit(true);
      console.log(chosenId, '선택한 ID 스파이');
    } else {
      window.alert('해고 시킬 직원을 선택해주세요. :)');
    }
  };

  return createPortal(
    <Container>
      <Background onClick={_handleModal} />
      {/* 높은애는 대기화면 나타내기(미완) */}
      {voteSpy[0] && voteSpy[0].user.id === parseInt(spyId) ? (
        <ModalBlock {...rest} src={SpyBG}>
          <Title>스파이 투표</Title>
          <Contents>해고 시킬 직원을 선택해주세요.</Contents>

          {/* 롤을 부여받은대로 보여줘야함 */}
          {(() => {
            if (user_list.length <= 6) {
              return (
                <SixVotePlayerWrap>
                  {user_list &&
                    user_list.map((p, idx) => {
                      return (
                        <Wrapper>
                          <JobCheckImg
                            disabled={submit}
                            src={
                              p.isEliminated.includes('N')
                                ? BasicProfile
                                : BasicProfile_Death
                            }
                            pointer={p.isEliminated.includes('Y') || submit}
                            ref={ref}
                            key={p.id}
                            opacity={idx === voteBtnClicked ? '30%' : '100%'}
                            onClick={() => clicked(idx)}
                          ></JobCheckImg>
                          <Nickname>{p.nickname}</Nickname>
                        </Wrapper>
                      );
                    })}
                </SixVotePlayerWrap>
              );
            } else if (user_list.length <= 8) {
              return (
                <EightVotePlayerWrap>
                  {user_list &&
                    user_list.map((p, idx) => {
                      return (
                        <Wrapper>
                          <JobCheckImg
                            disabled={submit}
                            src={
                              p.isEliminated.includes('N')
                                ? BasicProfile
                                : BasicProfile_Death
                            }
                            pointer={p.isEliminated.includes('Y') || submit}
                            ref={ref}
                            key={p.id}
                            opacity={idx === voteBtnClicked ? '30%' : '100%'}
                            onClick={() => clicked(idx)}
                          ></JobCheckImg>
                          <Nickname>{p.nickname}</Nickname>
                        </Wrapper>
                      );
                    })}
                </EightVotePlayerWrap>
              );
            } else if (user_list.length <= 10) {
              return (
                <TenVotePlayerWrap>
                  {user_list &&
                    user_list.map((p, idx) => {
                      return (
                        <Wrapper>
                          <JobCheckImg
                            disabled={submit}
                            src={
                              p.isEliminated.includes('N')
                                ? BasicProfile
                                : BasicProfile_Death
                            }
                            pointer={p.isEliminated.includes('Y') || submit}
                            ref={ref}
                            key={p.id}
                            opacity={idx === voteBtnClicked ? '30%' : '100%'}
                            onClick={() => clicked(idx)}
                          ></JobCheckImg>
                          <Nickname>{p.nickname}</Nickname>
                        </Wrapper>
                      );
                    })}
                </TenVotePlayerWrap>
              );
            }
          })()}

          {/* 소켓으로 현재 뭐 눌렀는지 통신 & 누르면 비활성화 시키기*/}
          <SendBtn disabled={submit} onClick={submitClicked}>
            선택 완료
          </SendBtn>
        </ModalBlock>
      ) : null}
    </Container>,
    document.getElementById('SpyVoteModal')
  );
};

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Background = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
  animation: modal-bg-show 1s;
  @keyframes modal-bg-show {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalBlock = styled.div`
  position: absolute;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  margin-top: 10rem;
  align-items: center;
  padding: 3rem;
  background: url('${(props) => props.src}') no-repeat center/cover;
  width: 60rem;
  height: 40rem;
  max-width: 100rem;
  animation: modal-show 1s;
  @keyframes modal-show {
    from {
      opacity: 0;
      margin-top: -50px;
    }
    to {
      opacity: 1;
      margin-top: 10rem;
    }
  }
`;
const SixVotePlayerWrap = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  gap: 30px 30px;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  justify-content: center;
  align-items: center;
`;
const EightVotePlayerWrap = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  gap: 30px 30px;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  justify-content: center;
  align-items: center;
`;
const TenVotePlayerWrap = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  gap: 30px 30px;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(2, 1fr);
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  color: white;
  font-family: 'yg-jalnan';
  margin: 1rem;
  font-size: 4rem;

  @media screen and (max-width: 1040px) {
    font-size: 4rem;
  }
`;

const Contents = styled.div`
  color: white;
  font-family: 'yg-jalnan';
  margin: 1rem;
  font-size: 2rem;

  @media screen and (max-width: 1040px) {
    font-size: 1.25rem;
  }
`;

const Nickname = styled.div`
  color: white;
  font-family: 'yg-jalnan';
  width: auto;
  font-size: 1rem;
  margin-top: 1rem;
  text-align: center;
  @media screen and (max-width: 1040px) {
    font-size: 0.75rem;
  }
`;

const JobCheckImg = styled.div`
  display: flex;
  justify-content: center;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  pointer-events: ${(props) => (+props.pointer ? 'none' : null)};
  background: url('${(props) => props.src}') no-repeat center/contain;
  margin: auto;
  cursor: pointer;
  opacity: ${(props) => props.opacity};
  @media screen and (max-width: 1040px) {
    width: 120px;
    height: 120px;
  }
`;

const SendBtn = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 1.5rem;
  background-color: #9296fd;
  margin-top: 2px;
  font-size: 1rem;
  font-family: 'yg-jalnan';
  color: #fff;
  cursor: pointer;
  :disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

export default SpyVoteModal;
