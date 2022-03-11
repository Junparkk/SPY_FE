import React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { actionCreators as voteActions } from '../redux/modules/vote';

const VoteModal = (props) => {
  const { roomId, _handleModal, children, ...rest } = props;
  console.log(props);
  const dispatch = useDispatch();

  const user_list = useSelector((state) => state.vote.userList);
  console.log(user_list);

  React.useEffect(() => {
    //라운드수를 []안에 넣어주면 새로운 라운드 시작할 때 마다 유저를 넣어주겠지?
    dispatch(voteActions.getUserDB(roomId));
  }, []);

  return createPortal(
    <Container>
      <Background onClick={_handleModal} />
      <ModalBlock {...rest}>
        <Contents size="80px">투표</Contents>
        <Contents size="40px">
          가장 스파이로 의심되는 사람에게 투표하세요.
        </Contents>
        <Contents size="30px">투표투ㅁㄴㅇㄹㅁㅇㄴㄹㅁㄴㅇㄹ표~</Contents>
        {/* 롤을 부여받은대로 보여줘야함 */}
        <VotePlayerWrap>
          {user_list &&
            user_list.map((p, idx) => {
              return <JobCheckImg></JobCheckImg>;
            })}
        </VotePlayerWrap>
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
  top: 15rem;
  border-radius: 30px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: black;
  width: 60rem;
  @media (max-width: 1120px) {
    width: 50rem;
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
  color: white;
  font-size: ${(props) => props.size};
`;

const JobCheckImg = styled.div`
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  background-color: blueviolet;
`;

const VotePlayerWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;
export default VoteModal;
