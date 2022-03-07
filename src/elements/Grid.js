import React from 'react';
import styled from 'styled-components';

const Grid = (props) => {
  const {
    is_flex,
    width,
    padding,
    margin,
    bg,
    children,
    center,
    _onClick,
    is_header,
    border,
    border_bottom,
    is_wrap,
    only_flex,
    is_parents,
    is_child,
    is_grid,
    min_width,
    height,
    is_fixed,
    opacity,
    cursor,
  } = props;

  const styles = {
    is_grid: is_grid,
    is_flex: is_flex,
    width: width,
    margin: margin,
    padding: padding,
    bg: bg,
    center: center,
    is_header: is_header,
    border: border,
    border_bottom: border_bottom,
    is_wrap: is_wrap,
    only_flex: only_flex,
    is_parents: is_parents,
    is_child: is_child,
    min_width: min_width,
    height: height,
    is_fixed: is_fixed,
    opacity: opacity,
    cursor: cursor,
  };

  if (is_header) {
    return <HeaderBox>{children}</HeaderBox>;
  }

  return (
    <GridBox {...styles} onClick={_onClick}>
      {children}
    </GridBox>
  );
};

Grid.defaultProps = {
  children: null,
  is_flex: false,
  width: '100%',
  padding: false,
  margin: false,
  bg: false,
  center: false,
  is_header: false,
  _onClick: () => {},
  border: null,
  border_bottom: false,
  is_wrap: false,
  only_flex: false,
  is_parents: false,
  is_child: false,
  is_grid: false,
  min_width: false,
  height: '100%',
  is_fixed: null,
  opacity: 1,
  cursor: null,
};

const GridBox = styled.div`
  overflow: hidden;
  width: ${(props) => props.width};
  height: 100%;
  //넓이에 보더 굵기 같은 것도 포함할래? yes
  box-sizing: border-box;
  ${(props) => (props.width ? `width:${props.width};` : '')}
  ${(props) => (props.padding ? `padding:${props.padding};` : '')}
  ${(props) => (props.margin ? `margin:${props.margin};` : '')}
  ${(props) => (props.bg ? `background-color:${props.bg};` : '')}
  ${(props) =>
    props.is_flex
      ? `display:flex; align-items: center; justify-content:space-between;`
      : ''}
  ${(props) => (props.center ? `text-align: center;` : '')}
  ${(props) => (props.border ? `border: 1px solid rgb(200, 200, 200);` : '')}
  ${(props) =>
    props.border_bottom ? `border-bottom: 1px solid rgb(200, 200, 200);` : ''}
  ${(props) => (props.is_wrap ? `flex-wrap:wrap;` : '')}
  ${(props) =>
    props.only_flex ? `display:flex; align-items: center; gap:2vw;` : ''}
  ${(props) => (props.is_parents ? 'position: relative;' : '')}
   ${(props) =>
    props.is_grid
      ? `display:grid; grid-template-columns: repeat(3,1fr); place-items: center; gap:2vw;
      @media (max-width: 595px) {
        grid-template-columns: repeat(2, 1fr)
      };`
      : ''}
  ${(props) => (props.min_width ? `min-width:${props.min_width};` : '')}
  ${(props) => (props.height ? `height:${props.height};` : '')}
  ${(props) =>
    props.is_fixed
      ? 'position: fixed;bottom: 60px;right: 60px;text-align: center;'
      : ''}
  ${(props) => (props.opacity ? `opacity:${props.opacity};` : '')}
  ${(props) => (props.cursor ? 'cursor:pointer;' : '')}
`;

const HeaderBox = styled.div`
  width: ${(props) => props.width};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  /* gap: 1.5rem; */
`;

export default Grid;
