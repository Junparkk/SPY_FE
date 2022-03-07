import React from 'react';
import styled from 'styled-components';
const InviteAlarm = (props) => {
  const { children } = props;
  return (
    <>
      <Container>
        <Wrap width={'70%'}>
          <Text>{children}님이 초대 하였습니다 들어갈꺼얌?</Text>
          <Wrap>
            <Btn>수락</Btn>
            <Btn>거절</Btn>
          </Wrap>
        </Wrap>
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 3rem;
  background-color: brown;
`;

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => props.width};
  height: 100%;
  background-color: blueviolet;
`;

const Text = styled.p`
  color: white;
`;

const Btn = styled.button`
  color: white;
  width: 3rem;
  height: 2rem;
  border: 1px solid red;
  background-color: pink;
  border-radius: 30px;
  margin-left: 5px;
`;

export default InviteAlarm;
