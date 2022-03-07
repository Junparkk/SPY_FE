import React from 'react';
import styled from 'styled-components';

import Text from './Text';
import Grid from './Grid';
const Input = (props) => {
  const {
    label,
    placeholder,
    _onChange,
    type,
    multiLine,
    value,
    border,
    border_radius,
    border_bottom,
    is_focus,
    is_header,
  } = props;

  // 헤더 검색창
  if (is_header) {
    return (
      <HeaderInput
        type={type}
        placeholder={placeholder}
        onChange={_onChange}
        border={border}
        border_radius={border_radius}
      ></HeaderInput>
    );
  }

  // 여러줄 입력창
  if (multiLine) {
    return (
      <Grid>
        {label && <Text margin="0px">{label}</Text>}
        <ElTextarea
          rows={10}
          value={value}
          placeholder={placeholder}
          onChange={_onChange}
          border={border}
          border_radius={border_radius}
          border_bottom={border_bottom}
        ></ElTextarea>
      </Grid>
    );
  }

  return (
    <React.Fragment>
      <Grid>
        {label && <Text margin="0px">{label}</Text>}
        <ElInput
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={_onChange}
          border={border}
          border_radius={border_radius}
          border_bottom={border_bottom}
          is_focus={is_focus}
        />
      </Grid>
    </React.Fragment>
  );
};

Input.defaultProps = {
  multiLine: false,
  label: false,
  placeholder: '텍스트를 입력해주세요.',
  type: 'text',
  border: false,
  border_radius: false,
  border_bottom: false,
  is_focus: false,
  value: '',
  _onChange: () => {},
};

const ElTextarea = styled.textarea`
  border: 1px solid #212121;
  width: 100%;
  padding: 12px 4px;
  margin: 5px 0px;
  box-sizing: border-box;
  ${(props) => (props.border ? `border:${props.border};` : '')}
  ${(props) =>
    props.border_radius ? `border-radius:${props.border_radius};` : ''}
  ${(props) =>
    props.border_bottom ? `border-bottom:${props.border_bottom};` : ''}
  ${(props) => (props.is_focus ? `&:focus{outline: none;}` : '')}
`;
const ElInput = styled.input`
  border: 1px solid #212121;
  width: 100%;
  padding: 12px 4px;
  margin: 5px 0px;
  box-sizing: border-box;
  ${(props) => (props.border ? `border:${props.border};` : '')}
  ${(props) =>
    props.border_radius ? `border-radius:${props.border_radius};` : ''}
  ${(props) =>
    props.border_bottom ? `border-bottom:${props.border_bottom};` : ''}
  ${(props) => (props.is_focus ? `&:focus{outline: none;}` : '')}
  font-family:맑은 고딕;
`;

const HeaderInput = styled.input`
  border: 1px solid #212121;
  width: 100%;
  padding: 12px 4px;
  margin: 1rem 0;
  box-sizing: border-box;
  ${(props) => (props.border ? `border:${props.border};` : '')}
  ${(props) =>
    props.border_radius ? `border-radius:${props.border_radius};` : ''}
  border: 0.3rem solid #6667ab;
  font-family: 맑은 고딕;
`;

export default Input;
