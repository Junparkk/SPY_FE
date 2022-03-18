import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { actionCreators as userActions } from '../redux/modules/user';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import Logo from '../images/Logo.png';
import Title from '../images/Title.png';
import Building from '../images/Building.png';
import '../shared/App.css';
import { useSelector } from 'react-redux';

function LoginTitle() {
  //랜덤 닉네임
  const randomUser = useSelector((state) => state.user.randomNick);
  const clearNick = () => {
    setNickname('')
  }
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
  const randomNick = () => {
    dispatch(userActions.RandomNickDB());
    setNickname(randomUser)
  };

  return (
    <>
      <Wrap>
        <TitleWrap>
          <TitleLogo src={Logo} />
          <HeaderTitle src={Title} />
          <div style={{ fontWeight: 'bold' }}>
            <InputNick>
              <input
                value={nickname}
                style={{
                  border: 'solid 2px #888888',
                  borderRadius: '20px',
                  width: '20%',
                  minWidth: '180px',
                  height: '50px',
                }}
                placeholder="닉네임"
                onChange={(e) => {
                  setNickname(e.target.value);
                }}
                onClick = {clearNick}
              />
              <GiPerspectiveDiceSixFacesRandom
                style={{
                  backgroundColor: '#9295FD',
                  borderRadius: '56px',
                  verticalAlign: 'middle',
                  marginLeft: '10px',
                }}
                size={56}
                onClick={randomNick}
              />
            </InputNick>

            <br />
            <StartBt onClick={Login}>start!</StartBt>
          </div>
        </TitleWrap>
        <div>{ScrollY > 2375 ? handleTop() : ''}</div>
        <LoginBackground src={Building} />
      </Wrap>
    </>
  );
}

const Wrap = styled.div`
  width: 100%;
  height: 3503px;
  background-color: #ffe179;
  text-align: center;
  background-size: cover;
`;

const TitleWrap = styled.div`
  width: 100%;
  padding: 80px 0px 0px 0px;
  @media screen and (max-width: 663px) {
    padding: 40px 0px 0px 0px;
  }
`;
const TitleLogo = styled.div`
  margin: 0px auto;
  width: 207px;
  height: 207px;
  border-radius: 207px;
  box-shadow: 10px 10px 10px gray;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url('${(props) => props.src}');
`;

const HeaderTitle = styled.div`
  margin: 20px auto;
  width: 631px;
  min-width: 370px;
  height: 275px;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url('${(props) => props.src}');
  @media screen and (max-width: 663px) {
    width: 70%;
  }
`;

const InputNick = styled.div`
  margin-top: 10%;
  @media screen and (max-width: 663px) {
    margin-top: -10%;
  }
`;

const StartBt = styled.button`
  border: none;
  background-color: #9295fd;
  border-radius: 40px;
  font-size: 31px;
  color: #fff;
  height: 65px;
  width: 171px;
  box-shadow: 10px 5px 5px gray;
  font-family: 'yg-jalnan';
  cursor: pointer;
`;

const LoginBackground = styled.div`
  margin: -50px auto;
  width: 100%;
  height: 2488px;
  background-image: url('${(props) => props.src}');
  background-size: cover;
  @media screen and (max-width: 1296px) {
    display: none;
  }
`;

export default LoginTitle;
