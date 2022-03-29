import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { actionCreators as voteActions } from '../redux/modules/vote';

// 이미지
import VoteBG from '../images/VoteBG.png';
import BasicProfile from '../images/BasicProfile.png';
import BasicProfile_Death from '../images/BasicProfile_Death.png';
import Ai from '../images/Ai.png';

// 변호사 모달
const LawyerVoteModal = (props) => {
  const { isMe, roomId, _handleModal, showing, children, ...rest } = props;
  console.log(props);
  const dispatch = useDispatch();
  const round = useSelector((state) => state.room.round);
  console.log(round);
  const user_list = useSelector((state) => state.vote.userList);
  const Alive = user_list.filter((user) => user.isEliminated.includes('N'));

  const [voteBtnClicked, setVoteBtnClicked] = useState(null);
  const [submit, setSubmit] = useState(false);
  const [chosenId, setChosenId] = useState(0);
  const [chosenRoomId, setChosenRoomId] = useState(0);
  const [antDisable, setAntDisable] = useState(false);

  const ref = useRef();

  const clicked = (idx) => {
    setVoteBtnClicked(idx);
    console.log(idx);
    const chosen = user_list[idx];
    setChosenId(chosen.user.id);
    setChosenRoomId(chosen.roomId);
    console.log(chosen);
    console.log(chosen.user.id, '유저 아이디');
    console.log(chosen.roomId, '룸 아이디');
    console.log(chosen.user, '제발');
    if (chosen.isEliminated.includes('Y')) {
      setAntDisable(true);
      console.log(
        chosen,
        '누구 골랐고 얘는 죽었을까?? ::',
        chosen.isEliminated,
        '초이슨생명 여부'
      );
    }
  };

  const submitClicked = () => {
    if (voteBtnClicked !== null) {
      dispatch(voteActions.lawyerActDB(chosenRoomId, chosenId));
      dispatch(voteActions.lawyerNullVote(false));
      setSubmit(true);
    } else {
      window.alert('해고 당할거 같은 직원을 선택해주세요 :)');
    }
    console.log(chosenId);
    console.log(chosenRoomId);
  };

  console.log(submit);
  return createPortal(
    <Container>
      <Background onClick={_handleModal} />
      <ModalBlock {...rest} src={VoteBG}>
        <Title>변호사 투표</Title>
        <Contents>
          해고 당할 거 같은 직원에게 투표하세요.
          <br />
          <br />단 투표를 안하게 되면 무효표 처리 되어 랜덤 선택 됩니다.
        </Contents>

        {/* 롤을 부여받은대로 보여줘야함 */}
        {(() => {
          if (user_list.length <= 6) {
            return (
              <VotePlayerWrap>
                {user_list &&
                  user_list.map((p, idx) => {
                    return (
                      <JobCheckImg
                        disabled={antDisable}
                        src={
                          p.isEliminated.includes('N')
                            ? BasicProfile
                            : BasicProfile_Death
                        }
                        pointerEvents={submit ? 'none' : ''}
                        ref={ref}
                        key={p.id}
                        opacity={idx === voteBtnClicked ? '30%' : '100%'}
                        onClick={() => clicked(idx)}
                      >
                        {/* 닉네임과 선택해준 사람들의 이미지 */}
                        <Vote>
                          <Nickname>{p.nickname}</Nickname>

                          <ChoiceBox>{/* <Choice src={Ai} /> */}</ChoiceBox>
                        </Vote>
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
                        disabled={antDisable}
                        src={
                          p.isEliminated.includes('N')
                            ? BasicProfile
                            : BasicProfile_Death
                        }
                        pointerEvents={submit ? 'none' : ''}
                        ref={ref}
                        key={p.id}
                        opacity={idx === voteBtnClicked ? '30%' : '100%'}
                        onClick={() => clicked(idx)}
                      >
                        {/* 닉네임과 선택해준 사람들의 이미지 */}
                        <Vote>
                          <Nickname>{p.nickname}</Nickname>

                          <ChoiceBox>{/* <Choice src={Ai} /> */}</ChoiceBox>
                        </Vote>
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
                        disabled={antDisable}
                        src={
                          p.isEliminated.includes('N')
                            ? BasicProfile
                            : BasicProfile_Death
                        }
                        pointerEvents={submit ? 'none' : ''}
                        ref={ref}
                        key={p.id}
                        opacity={idx === voteBtnClicked ? '30%' : '100%'}
                        onClick={() => clicked(idx)}
                      >
                        {/* 닉네임과 선택해준 사람들의 이미지 */}
                        <Vote>
                          <Nickname>{p.nickname}</Nickname>

                          <ChoiceBox>{/* <Choice src={Ai} /> */}</ChoiceBox>
                        </Vote>
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
    document.getElementById('LawyerVoteModal')
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
  :disabled {
    cursor: default;
    opacity: 0.5;
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
    cursor: default;
    opacity: 0.5;
  }
`;

export default LawyerVoteModal;
