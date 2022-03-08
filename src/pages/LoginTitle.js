import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { actionCreators as userActions } from '../redux/modules/user';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';

function LoginTitle() {
  //스크롤 업 애니매이션
  const [ScrollY, setScrollY] = useState(0);

  const handleFollow = () => {
    setScrollY(window.scrollY);
  };

  const handleTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const watch = () => {
      window.addEventListener('scroll', handleFollow);
    };
    watch();
    return () => window.removeEventListener('scroll', handleFollow);
  });

  useEffect(() => {
    document.documentElement.scroll(0, 3000);
  }, []);

  useEffect(() => {
    console.log('Scroll is', ScrollY);
  }, [ScrollY]);

  //닉네임 서버 전달
  const dispatch = useDispatch();

  const [nickname, setNickname] = useState('');

  const Login = () => {
    dispatch(userActions.LoginDB(nickname));
  };

  return (
    <>
      <Wrap>
        <TitleWrap>
          <Logo src="" />
          <span
            style={{ color: '#333333', fontSize: '5rem', fontWeight: '500' }}
          >
            Inderstrial
            <br />
            S.P.Y
          </span>
          <div style={{ margin: '50px', fontWeight: 'bold' }}>
            닉네임 <br />
            <input
              style={{
                border: 'solid 1px black',
                borderRadius: '10px',
                width: '307px',
                height: '50px',
                margin: '16px',
              }}
              placeholder="닉네임을 입력해주세요"
              onChange={(e) => {
                setNickname(e.target.value);
              }}
            ></input>
            <GiPerspectiveDiceSixFacesRandom
              style={{ backgroundColor: '#9295FD', borderRadius: '56px' }}
              size={56}
            />
            <br />
            <StartBt onClick={Login}>start</StartBt>
          </div>
        </TitleWrap>
        <Test>
          <span style={{ fontSize: '5rem' }}>
            건물입니다건물입니다건물입니다건물입니다건물입니다건물입니다건물입니다건물입니다건물입니다
          </span>
          <div>{ScrollY > 2088 ? handleTop() : ''}</div>
        </Test>
      </Wrap>
    </>
  );
}

const Wrap = styled.div`
  width: 100%;
  height: 3000px;
  background-color: #dfd880;
  text-align: center;
`;

const TitleWrap = styled.div`
  width: 100%;
`;
const Logo = styled.div`
  margin: 0px auto;
  width: 250px;
  height: 250px;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url('${(props) => props.src}');
`;

const Test = styled.div`
  display: flex;
  position: relative;
  vertical-align: bottom;
  height: 2000px;
  background-color: #555555;
`;

const StartBt = styled.button`
  border: none;
  color: #9295fd;
  height: 65px;
  width: 171px;
`;

export default LoginTitle;
