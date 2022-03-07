import React from 'react';
import styled from 'styled-components';

const Text = (props) => {
  const {
    bold,
    color,
    size,
    margin,
    is_end,
    is_contents,
    children,
    is_hidden,
    is_deco,
  } = props;

  const styles = {
    bold: bold,
    color: color,
    size: size,
    margin: margin,
    is_end: is_end,
    is_contents: is_contents,
    is_hidden: is_hidden,
    is_deco: is_deco,
  };
  return (
    <P {...styles} hidden={is_hidden}>
      {children}
    </P>
  );
};

Text.defaultProps = {
  children: null,
  bold: false,
  color: '#222831',
  size: '1vw',
  margin: false,
  is_end: false,
  is_contents: false,
  is_hidden: false,
  is_deco: false,
};

const P = styled.p`
  color: ${(props) => props.color};
  font-size: ${(props) => props.size};
  font-weight: ${(props) => (props.bold ? '600' : '400')};
  ${(props) => (props.margin ? `margin: ${props.margin};` : 'margin: 0;')}
  ${(props) => (props.is_end ? `text-align: end;` : '')}
  ${(props) =>
    props.is_contents ? 'word-break: break-all; white-space: nowrap;' : ''}
  ${(props) =>
    props.is_deco
      ? '&:hover{text-decoration: underline;   cursor: pointer; color:blue}'
      : ``}

  /* overflow: hidden; */
  /* text-overflow: ellipsis; */
  word-break: break-all;
  white-space: nowrap;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  /* white-space: ;

  text-overflow: clip;
  word-wrap: break-word; */
`;
export default Text;
