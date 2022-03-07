import React, { useState } from 'react';
import styled from 'styled-components';

// 방만들때 개미 나오게 하는 컴포넌트
const Ants = () => {
  const [count, setCount] = useState(6);
  return (
    <div label="인원 설정">
      최소 6명 ~ 최대 10명
      {Array.from({ length: 10 }, (Ants, index) => {
        return (
          <Ant
            key={index}
            onClick={() => {
              setCount(index + 1);
            }}
            style={{
              backgroundColor: count < index + 1 ? '#918280' : 'yellow',
            }}
          />
        );
      })}
      <button>완료</button>
    </div>
  );
};

const Ant = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: yellow;
  border: 1px solid black;
  cursor: pointer;
  display: flex;
`;

export default Ants;
