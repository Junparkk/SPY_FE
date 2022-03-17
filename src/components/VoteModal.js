import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { actionCreators as voteActions } from '../redux/modules/vote';

const VoteModal = (props) => {
  const { isMe, roomId, _handleModal, children, ...rest } = props;
  const dispatch = useDispatch();

  const user_list = useSelector((state) => state.vote.userList);
  const round = useSelector((state) => state.room.round);
  const userId = localStorage.getItem('userid');

  const [voteBtnClicked, setVoteBtnClicked] = useState(null);
  const [submit, setSubmit] = useState(false);
  const [chosenId, setChosenId] = useState(0);
  const [chosenRoomId, setChosenRoomId] = useState(0);

  const ref = useRef();

  console.log('투표모달안에 몇명?', user_list);

  const clicked = (idx) => {
    setVoteBtnClicked(idx);
    console.log(idx);
    const chosen = user_list[idx];
    setChosenId(chosen.userId);
    setChosenRoomId(chosen.roomId);
  };

  const submitClicked = () => {
    if (voteBtnClicked !== null) {
      setSubmit(true);
      //디스패치로 넘겨주기 넣기
      dispatch(
        voteActions.sendDayTimeVoteAPI(chosenRoomId, userId, round, chosenId)
      );
    } else {
      window.alert('스파이로 의심되는 사람을 선택해주세요 :)');
    }
  };

  const aiAutoVoting = () => {
    console.log(user_list);

    console.log(round);
    for (let i = 0; i < user_list.length; i++) {
      const chooseRandomPlayer = Math.floor(Math.random() * user_list.length);
      console.log(user_list[i]);
      if (user_list[i].isAi === 'Y') {
        console.log(i);
        dispatch(
          voteActions.sendDayTimeVoteAPI(
            user_list[i].roomId,
            user_list[i].userId,
            round,
            user_list[chooseRandomPlayer].userId
          )
        );
      }
    }
  };

  useEffect(() => {
    aiAutoVoting();
  }, [round]);

  console.log(submit);
  return createPortal(
    <Container>
      <Background onClick={_handleModal} />
      <ModalBlock {...rest}>
        <Contents size="4rem">투표</Contents>
        <Contents margin="1rem" size="2rem">
          가장 스파이로 의심되는 사람에게 투표하세요.
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
                        pointerEvents={submit ? 'none' : ''}
                        ref={ref}
                        key={p.id}
                        opacity={idx === voteBtnClicked ? '30%' : '100%'}
                        onClick={() => clicked(idx)}
                      >
                        <Contents>{p.nickname}</Contents>
                      </JobCheckImg>
                    );
                  })}
              </VotePlayerWrap>
            );
          } else if (user_list.length <= 8) {
            <VotePlayerWrap>
              {user_list &&
                user_list.map((p, idx) => {
                  return (
                    <JobCheckImg
                      pointerEvents={submit ? 'none' : ''}
                      ref={ref}
                      key={p.id}
                      opacity={idx === voteBtnClicked ? '30%' : '100%'}
                      onClick={() => clicked()}
                    >
                      <Contents>{p.nickname}</Contents>
                    </JobCheckImg>
                  );
                })}
            </VotePlayerWrap>;
          } else if (user_list.length <= 10) {
            <VotePlayerWrap>
              {user_list &&
                user_list.map((p, idx) => {
                  return (
                    <JobCheckImg
                      pointerEvents={submit ? 'none' : ''}
                      ref={ref}
                      key={p.id}
                      opacity={idx === voteBtnClicked ? '30%' : '100%'}
                      onClick={() => clicked(idx)}
                    >
                      <Contents>{p.nickname}</Contents>
                    </JobCheckImg>
                  );
                })}
            </VotePlayerWrap>;
          }
        })()}
        {/* 소켓으로 현재 뭐 눌렀는지 통신 & 누르면 비활성화 시키기*/}
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
  top: 10%;
  border-radius: 30px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffe179;
  width: 80%;
  height: 60%;
  @media (max-width: 1120px) {
  }
  @media (max-width: 50rem) {
    width: 80%;
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

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  margin: ${(props) => props.margin};
  font-size: ${(props) => props.size};
`;

const JobCheckImg = styled.div`
  display: flex;
  justify-content: center;
  width: 164px;
  height: 164px;
  border-radius: 50%;
  background-color: blueviolet;
  margin: auto;
  opacity: ${(props) => props.opacity};
  @media screen and (min-width: 551px) and (max-width: 1065px) {
    width: 100px;
    height: 100px;
  }
  @media screen and (min-width: 0px) and (max-width: 551px) {
    width: 100px;
    height: 100px;
  }
`;

const VotePlayerWrap = styled.div`
  width: 100%;
  height: 60%;
  display: grid;
  gap: 30px 200px;
  grid-template-columns: repeat(3, 10rem);
  grid-template-rows: repeat(2, 1fr);
  justify-content: center;
  align-items: center;

  @media screen and (min-width: 1607px) {
    grid-template-columns: repeat(3, 10rem);
  }
  @media screen and (min-width: 1065px) and (max-width: 1607px) {
    grid-template-columns: repeat(3, 10rem);
  }
  @media screen and (min-width: 551px) and (max-width: 1065px) {
    gap: 20px 10px;
  }
  @media screen and (min-width: 0px) and (max-width: 551px) {
    gap: 0px;
  }
`;

const SendBtn = styled.button`
  width: 5rem;
  height: 2rem;
  border: none;
  border-radius: 1rem;
  background-color: white;
`;

export default VoteModal;
