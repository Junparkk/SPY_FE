import React from 'react';
import styled from 'styled-components';
import Grid from '../elements/Grid';

const Setting = () => {
  return (
    <React.Fragment>
      <Grid>
          <Grid>
        <p>음량조절</p>
        <input type={Range} min="0" max="10" value="5" step="1"/>
        </Grid>

        <Grid>
            다크모드
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const RangeInput = styled.input`

`;


export default Setting;

// 설정 화면
// 다크모드, 뷸륨 조절등
