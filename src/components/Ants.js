// import React, { useState } from 'react';
// import styled from 'styled-components';
// import Spy from "../spy.png"
// // 방만들때 개미 나오게 하는 컴포넌트
// const Ants = () => {
//   const [count, setCount] = useState(6);
//   return (
//     <AntDiv>
//       {Array.from({ length: 10 }, (Ants, index) => {
//         return (
//           <Ant
//             key={index}
//             value={1}
//             onClick={() => {
//               setCount(index + 1);
//             }}
//             style={{
//               background: count < index + 1 ? '#918280' : 'yellow',
//             }}
//           />
//         );
//       })}
      
//     </AntDiv>
//   );
// };

// const AntDiv = styled.div`
//  display: flex;
//  flex-flow : row wrap;
//  width: 400px;
//  margin: auto;
// `;

// const Ant = styled.div`
//   width: 56px;
//   height: 56px;
//   margin: 9.5px;
//   border-radius: 50%;
//   background-image: url("../spy.png");
//   background-size: cover;
//   border: 1px solid black;
//   cursor: pointer;
// `;

// export default Ants;
