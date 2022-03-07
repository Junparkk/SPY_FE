import React from 'react';
import styled from 'styled-components';
import Grid from '../elements/Grid';
import Button from '../elements/Button';

// 방입장 화면
// 입장전 게임 설정 등

const CreateRoom = () => {
  return (
    <React.Fragment>
      <Grid center>
        <Grid>튜토리얼 슬라이드</Grid>
        <Grid>방제목 설정</Grid>
        <Grid>인원설정</Grid>
        <Grid>낮시간 설정</Grid>
        <Grid>밤 시간 설정</Grid>
        <Grid>최후 변론시간 설정</Grid>
        <Grid>방 비밀번호 설정</Grid>
        <Button>방 만들기</Button>

      </Grid>
    </React.Fragment>
  );
};

export default CreateRoom;
