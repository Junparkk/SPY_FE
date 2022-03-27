import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import vote, { actionCreators as voteActions } from '../redux/modules/vote';
import io from 'socket.io-client';

// 이미지
import VoteBG from '../images/VoteBG.png';
import alive from '../images/alive.png';
import dead from '../images/dead.png';
import Ai from '../images/Ai.png';

//낮 투표 모달
const VoteModal = (props) => {
  const socket = io.connect('https://mafia.milagros.shop');
  const { isMe, roomId, _handleModal, children, ...rest } = props;
  const dispatch = useDispatch();

  const user_list = useSelector((state) => state.vote.userList);
  const round = useSelector((state) => state.room.round);
  const userId = localStorage.getItem('userid');
  const [voteBtnClicked, setVoteBtnClicked] = useState(null);
  const [submit, setSubmit] = useState(false);
  const [chosenId, setChosenId] = useState(0);
  const [chosenRoomId, setChosenRoomId] = useState(0);
  const [disable, setDisable] = useState(false);
  const [voteId, setVoteId] = useState('');

  const ref = useRef();

  // //산사람 죽은사람 확인 후 캐릭터로 표시(X표시 됨) N-산사람 Y-죽은사람
  const Alive = user_list.filter((user) => user.isEliminated === 'N');
  console.log(Alive, '주것니 사랏니!');
  console.log(Alive[0].isEliminated === "N")
  
  // // 죽은사람 확인 후 모달 띄우지 않기
  // const deadPerson = user_list.filter((user) => user.isEliminated === 'Y');
  // console.log(deadPerson, '죽은 사람들 리스트');

  
  const clicked = (idx) => {
    setVoteBtnClicked(idx);
    const chosen = user_list[idx];
    setChosenId(chosen.userId);
    setChosenRoomId(chosen.roomId);
  };

  const submitClicked = () => {
    if (voteBtnClicked !== null) {
      setSubmit(true);
      setDisable(true);
      //디스패치로 넘겨주기 넣기
      // dispatch(
      //   voteActions.sendDayTimeVoteAPI(
      //     chosenRoomId,
      //     userId,
      //     round,
      //     chosenId,
      //     roomId
      //   )
      // );

      socket.on('dayTimeVoteArr', (vote) => {
        console.log(vote, '투표퉆투푵픁푵$$$$$$$');
      });

      console.log('vote용 소켓 data --->', roomId, userId, chosenId, round);
      socket.emit('dayTimeVoteArr', {
        roomId,
        userId,
        candidacy: chosenId,
        roundNo: round,
      });
      console.log(roomId, userId, '$$$$$$$$f룸아디유져아디');
      console.log(chosenId, '투표', round, '라운드');
      console.log(round, '<<<<<<<< 투표 클릭할 때 round');
    } else {
      window.alert('스파이로 의심되는 사람을 선택해주세요 :)');
    }
  };
  console.log(submit, '선택 완료 눌렀는가');
  return createPortal(
    <Container>
      <Background onClick={_handleModal} />
      <ModalBlock {...rest} src={VoteBG}>
        <Title>투표</Title>
        <Contents>가장 스파이로 의심되는 사람에게 투표하세요.</Contents>
        {/* 롤을 부여받은대로 보여줘야함 */}
        {(() => {
          if (user_list.length <= 6 && Alive ) {
            return (
              <VotePlayerWrap>
                {user_list &&
                  user_list.map((p, idx) => {
                    return (
                      <JobCheckImg
                        src={p.isEliminated === 'N' ? alive : dead}
                        pointerEvents={submit ? 'none' : ''}
                        ref={ref}
                        key={p.id}
                        opacity={idx === voteBtnClicked ? '30%' : '100%'}
                        onClick={() => clicked(idx)}
                      >
                        {/* 닉네임과 선택해준 사람들의 이미지 */}
                        <Vote>
                          <Nickname>{p.nickname}</Nickname>

                          {Array.from(
                            { length: vote.voteCnt },
                            (voter, index) => {
                              return (
                                <ChoiceBox>
                                  <Choice key={index} src={Ai} >...{voter}</Choice>
                                </ChoiceBox>
                              );
                            }
                          )}
                        </Vote>
                      </JobCheckImg>
                    );
                  })}
              </VotePlayerWrap>
            );
          } else if (user_list.length <= 8 && Alive) {
            return (
              <VotePlayerWrap>
                {user_list &&
                  user_list.map((p, idx) => {
                    return (
                      <JobCheckImg
                        src={p.isEliminated === 'N' ? alive : dead}
                        pointerEvents={submit ? 'none' : ''}
                        ref={ref}
                        key={p.id}
                        opacity={idx === voteBtnClicked ? '30%' : '100%'}
                        onClick={() => clicked(idx)}
                      >
                        <Vote>
                          <Nickname>{p.nickname}</Nickname>
                          {Array.from(
                            { length: vote.voteCnt },
                            (voter, index) => {
                              return (
                                <ChoiceBox>
                                  <Choice key={index} src={Ai} />
                                </ChoiceBox>
                              );
                            }
                          )}
                        </Vote>
                      </JobCheckImg>
                    );
                  })}
              </VotePlayerWrap>
            );
          } else if (user_list.length <= 10 && Alive) {
            return (
              <VotePlayerWrap>
                {user_list &&
                  user_list.map((p, idx) => {
                    return (
                      <JobCheckImg
                        src={p.isEliminated === 'N' ? alive : dead}
                        pointerEvents={submit ? 'none' : ''}
                        ref={ref}
                        key={p.id}
                        opacity={idx === voteBtnClicked ? '30%' : '100%'}
                        onClick={() => clicked(idx)}
                      >
                        <Vote>
                          <Nickname>{p.nickname}</Nickname>

                          {Array.from(
                            { length: vote.voteCnt },
                            (voter, index) => {
                              return (
                                <ChoiceBox>
                                  <Choice key={index} src={Ai} />
                                </ChoiceBox>
                              );
                            }
                          )}
                        </Vote>
                      </JobCheckImg>
                    );
                  })}
              </VotePlayerWrap>
            );
          }
        })()}

        {/* ///////////////////// */}

        {/* <VotePlayerWrap>
          {user_list &&
            user_list.map((p, idx) => {
              return (
                <JobCheckImg
                  src={Alive ? alive : dead}
                  pointerEvents={submit ? 'none' : ''}
                  ref={ref}
                  key={p.id}
                  opacity={idx === voteBtnClicked ? '30%' : '100%'}
                  onClick={() => clicked(idx)}
                >
                  <Vote>
                    <Nickname>ㅎㅇㅎㅇ</Nickname>

                    <ChoiceBox>
                      <Choice src={Ai} />
                      <Choice src={Ai} />
                    </ChoiceBox>
                  </Vote>
                </JobCheckImg>
              );
            })}
        </VotePlayerWrap> */}

        {/* 소켓으로 현재 뭐 눌렀는지 통신 & 누르면 비활성화 시키기*/}
        <SendBtn disabled={disable} onClick={() => submitClicked()}>
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
  &:hover {
    opacity: 0.5;
  }
`;

export default VoteModal;
