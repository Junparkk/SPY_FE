import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';

// 이미지
import VoteBG from '../images/VoteBG.png';
import alive from '../images/BasicProfile.png';
import dead from '../images/BasicProfile_Death.png';
import Ai from '../images/Ai.png';

//낮 투표 모달
const VoteModal = (props) => {
  const socket = io.connect('https://mafia.milagros.shop');
  const { isMe, roomId, _handleModal, children, ...rest } = props;

  const user_list = useSelector((state) => state.vote.userList);
  const round = useSelector((state) => state.room.round);
  const userId = localStorage.getItem('userid');
  const [voteBtnClicked, setVoteBtnClicked] = useState(null);
  const [submit, setSubmit] = useState(false);
  const [chosenId, setChosenId] = useState(0);
  const [chosenRoomId, setChosenRoomId] = useState(0);
  const [count, setCount] = useState(0);
  const ref = useRef();

  const clicked = (idx) => {
    setVoteBtnClicked(idx);
    const chosen = user_list[idx];
    setChosenId(chosen.userId);
    setChosenRoomId(chosen.roomId);
  };
  const submitClicked = () => {
    if (voteBtnClicked !== null) {
      setSubmit(true);
      socket.emit('dayTimeVoteArr', {
        roomId,
        userId,
        candidacy: chosenId,
        roundNo: round,
      });

      socket.on('dayTimeVoteArr', (vote) => {
        setCount(vote.voteCnt);
      });
    } else {
      window.alert('스파이로 의심되는 사람을 선택해주세요 :)');
    }
  };


  return createPortal(
    <Container>
      <Background onClick={_handleModal} />
      <ModalBlock {...rest} src={VoteBG}>
        <Title>낮 투표</Title>
        <Contents>가장 스파이로 의심되는 사람에게 투표하세요.</Contents>

        {(() => {
          if (user_list.length <= 6) {
            return (
              <SixVotePlayerWrap>
                {user_list &&
                  user_list.map((p, idx) => {
                    return (
                      <Wrapper>
                        <JobCheckImg
                          src={p.isEliminated.includes('N') ? alive : dead}
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
                          src={p.isEliminated.includes('N') ? alive : dead}
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
                          src={p.isEliminated.includes('N') ? alive : dead}
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

        <SendBtn disabled={submit} onClick={() => submitClicked()}>
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

export default VoteModal;
