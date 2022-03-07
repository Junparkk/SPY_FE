import styled from 'styled-components';
import React from 'react';

const Image = (props) => {
  const { shape, src, size, is_main } = props;
  //스타일만 모아주기
  const styles = {
    src: src,
    size: size,
    is_main: is_main,
  };
  //만약 모양이 원이면 서클을 적용해 주세용
  if (shape === 'logo') {
    return <Logo {...styles}></Logo>;
  }
  if (shape === 'rectangle') {
    return (
      <AspectOuter size={size} is_main={is_main}>
        <AspectInner {...styles}></AspectInner>
      </AspectOuter>
    );
  }
  return <React.Fragment></React.Fragment>;
};

Image.defaultProps = {
  shape: 'rectangle',
  src: 'https://w7.pngwing.com/pngs/767/518/png-transparent-color-vantablack-light-graphy-white-paper-blue-white-text-thumbnail.png',
  size: '36',
  is_main: false,
};
const AspectOuter = styled.div`
  width: 100%;
  --size: ${(props) => props.size}vw;

  /* width: var(--size); */
  ${(props) => (props.is_main ? 'width:100%;' : 'width: var(--size);')}
  height: var(--size);
`;

const AspectInner = styled.div`
  position: relative;
  padding-top: 75%;
  overflow: hidden;
  background-image: url('${(props) => props.src}');
  background-size: cover;
  background-position: center;
  object-fit: fill;
  width: 100%;
  --size: ${(props) => props.size}vw;
  ${(props) => (props.is_main ? 'width:100%;' : 'width: var(--size);')}
  height: var(--size);
`;

//원의 형태 잡아주기
const Logo = styled.div`
  height: 50px;
  background-image: url('${(props) => props.src}');
  background-size: contain; // 이미지 잘리기 방지
  background-repeat: no-repeat; // 이미지 반복 방지
  margin: 4px;
  background-position: center;
`;

export default Image;
