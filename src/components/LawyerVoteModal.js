import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { actionCreators as voteActions } from '../redux/modules/vote';

// 변호사 모달
const LawyerVoteModal = (props) => {
  const { isMe, roomId, _handleModal, showing, children, ...rest } = props;
  console.log(props);
  const dispatch = useDispatch();
  const round = useSelector((state) => state.room.round);
  console.log(round);
  const user_list = useSelector((state) => state.vote.userList);

  const [voteBtnClicked, setVoteBtnClicked] = useState(null);
  const [submit, setSubmit] = useState(false);
  const [chosenId, setChosenId] = useState(0);
  const [chosenRoomId, setChosenRoomId] = useState(0);
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
      <ModalBlock {...rest}>
        <Contents size="4rem">투표</Contents>
        <Contents margin="1rem" size="2rem">
          해고 당할 거 같은 직원에게 투표하세요.
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
                        onClick={() => clicked()}
                      >
                        <Contents>{p.nickname}</Contents>
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
  pointer-events: ${(props) => props.pointerEvents};
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

export default LawyerVoteModal;
