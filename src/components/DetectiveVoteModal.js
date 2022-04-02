import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { actionCreators as voteActions } from '../redux/modules/vote';

// 이미지
import VoteBG from '../images/VoteBG.png';
import BasicProfile from '../images/BasicProfile.png';
import BasicProfile_Death from '../images/BasicProfile_Death.png';
import Ai from '../images/Ai.png';

// 탐정 모달
const DetectiveVoteModal = (props) => {
  const { roomId, _handleModal, children, ...rest } = props;
  const dispatch = useDispatch();
  const round = useSelector((state) => state.room.round);
  const _user_list = useSelector((state) => state.vote.userList);
  const Alive = _user_list.filter((user) => user.isEliminated === 'N');

  const [voteBtnClicked, setVoteBtnClicked] = useState(null);
  const [submit, setSubmit] = useState(false);
  const [chosenId, setChosenId] = useState(0);
  const [chosenRoomId, setChosenRoomId] = useState(0);

  const ref = useRef();
  // 본인명단은 제외하기
  const user_list = _user_list.filter((user) => user.role !== 3);
  console.log(user_list, '~~~~~~~~~~~~~~~~~본인 제외명단 리스트');
  console.log(_user_list, '~~~~~~~~~~~전체 리스트~~~~~~');
  console.log(chosenId, '선택한 ID값');
  console.log(submit);

  console.log(round, '게임 라운드');
  console.log(_user_list, '유저 리스트');
  console.log('투표모달안에 몇명?', _user_list.length, '명');

  const clicked = (idx) => {
    setVoteBtnClicked(idx);
    console.log(idx, ' 얘는 인덱스');
    const chosen = user_list[idx];
    setChosenId(chosen.user.id);
    setChosenRoomId(chosen.roomId);
    console.log(chosen, '해당유저 정보');
    console.log(chosen.user.id, '유저 아이디');
    console.log(chosen.roomId, '룸 아이디');
  };

  const submitClicked = () => {
    if (voteBtnClicked !== null) {
      dispatch(voteActions.detectiveActDB(chosenRoomId, chosenId));
      setSubmit(true);
    } else {
      window.alert('스파이로 의심되는 사람을 선택해주세요 :)');
    }
  };

  return createPortal(
    <Container>
      <Background onClick={_handleModal} />
      <ModalBlock {...rest} src={VoteBG}>
        <Title>탐정 투표</Title>
        <Contents>스파이로 의심되는 사람을 선택해주세요.</Contents>

        {/* 롤을 부여받은대로 보여줘야함 */}
        {(() => {
          if (user_list.length <= 6) {
            return (
              <VotePlayerWrap>
                {user_list &&
                  user_list.map((p, idx) => {
                    return (
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
                      >
                        <Nickname>{p.nickname}</Nickname>
                      </JobCheckImg>
                    );
                  })}
              </VotePlayerWrap>
            );
          } else if (user_list.length <= 8) {
            return (
              <VotePlayerWrap>
                {user_list &&
                  user_list.map((p, idx) => {
                    return (
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
                      >
                        <Nickname>{p.nickname}</Nickname>
                      </JobCheckImg>
                    );
                  })}
              </VotePlayerWrap>
            );
          } else if (user_list.length <= 10) {
            return (
              <VotePlayerWrap>
                {user_list &&
                  user_list.map((p, idx) => {
                    return (
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
                      >
                        <Nickname>{p.nickname}</Nickname>
                      </JobCheckImg>
                    );
                  })}
              </VotePlayerWrap>
            );
          }
        })()}

        {/* 소켓으로 현재 뭐 눌렀는지 통신 & 누르면 비활성화 시키기*/}
        <SendBtn disabled={submit} onClick={submitClicked}>
          선택 완료
        </SendBtn>
      </ModalBlock>
    </Container>,
    document.getElementById('VoteModal')
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
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  background: url('${(props) => props.src}') no-repeat center/cover;
  width: 70%;
  height: 100%;
  @media (max-width: 1120px) {
    width: 80%;
  }
  @media (max-width: 50rem) {
    width: 90%;
  }
  min-height: 35rem;
  animation: modal-show 1s;
  @keyframes modal-show {
    from {
      opacity: 0;
      margin-top: -50px;
    }
    to {
      opacity: 1;
      margin-top: 0;
    }
  }
`;

const VotePlayerWrap = styled.div`
  width: 100%;
  height: 60%;
  display: grid;
  gap: 30px 50px;
  grid-template-columns: repeat(5, 10rem);
  grid-template-rows: repeat(2, 1fr);
  justify-content: center;
  align-items: center;

  @media screen and (min-width: 1607px) {
    grid-template-columns: repeat(5, 10rem);
  }
  @media screen and (min-width: 1065px) and (max-width: 1607px) {
    grid-template-columns: repeat(4, 10rem);
    grid-template-rows: repeat(3, 1fr);
    gap: 20px 10px;
  }
  @media screen and (min-width: 551px) and (max-width: 1065px) {
    grid-template-columns: repeat(4, 7rem);
    grid-template-rows: repeat(3, 1fr);
    gap: 20px 10px;
  }
`;

const Title = styled.div`
  color: white;
  font-family: 'yg-jalnan';
  margin: 1rem;
  font-size: 4rem;
  @media screen and (min-width: 1607px) {
    font-size: 4rem;
  }
  @media screen and (min-width: 1065px) and (max-width: 1607px) {
    font-size: 4rem;
  }
  @media screen and (min-width: 551px) and (max-width: 1065px) {
    font-size: 3rem;
  }
  @media screen and (min-width: 0px) and (max-width: 551px) {
    font-size: 2rem;
  }
`;

const Contents = styled.div`
  color: white;
  font-family: 'yg-jalnan';
  margin: 1rem;
  font-size: 2rem;
  @media screen and (min-width: 1607px) {
    font-size: 2rem;
  }
  @media screen and (min-width: 1065px) and (max-width: 1607px) {
    font-size: 2rem;
  }

  @media screen and (min-width: 551px) and (max-width: 1065px) {
    font-size: 1.25rem;
  }
  @media screen and (min-width: 0px) and (max-width: 551px) {
  }
`;
//캐릭터 모음 Wrap
const Vote = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  top: 7rem;
`;

const Nickname = styled.div`
  color: white;
  font-family: 'yg-jalnan';
  margin: 0.25rem;
  font-size: 1rem;
  @media screen and (min-width: 1607px) {
    font-size: 1rem;
  }
  @media screen and (min-width: 1065px) and (max-width: 1607px) {
    font-size: 0.75rem;
  }
  @media screen and (min-width: 551px) and (max-width: 1065px) {
    font-size: 0.75rem;
  }
  @media screen and (min-width: 0px) and (max-width: 551px) {
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
  @media screen and (min-width: 1065px) and (max-width: 1607px) {
    width: 90px;
    height: 90px;
  }
  @media screen and (min-width: 551px) and (max-width: 1065px) {
    width: 100px;
    height: 100px;
  }
  @media screen and (min-width: 0px) and (max-width: 551px) {
  }
`;

// 선택받은 사람에게 나타날수 있게 한 Wrap
const ChoiceBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  width: 8rem;
  @media screen and (min-width: 551px) and (max-width: 1065px) {
    width: 6rem;
  }
`;

// 투표 선택 시 본인 캐릭터 하단에 추가 됨
const Choice = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 15px;
  height: 15px;
  position: relative;
  margin: 2px;
  border-radius: 50%;
  background: url('${(props) => props.src}') no-repeat center/contain;
  @media screen and (min-width: 551px) and (max-width: 1065px) {
    width: 10px;
    height: 10px;
  }
`;
const SendBtn = styled.button`
  width: 6rem;
  height: 3rem;
  border: none;
  border-radius: 1.5rem;
  background-color: #9296fd;
  position: absolute;
  bottom: 3rem;
  font-size: 1rem;
  font-family: 'yg-jalnan';
  color: #fff;
  cursor: pointer;
  :disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

export default DetectiveVoteModal;
