import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { actionCreators as userActions } from '../redux/modules/user';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import Logo from '../images/Mapia.png';
import Title from '../images/Title.png';
import Building from '../images/Building.png';
import '../shared/App.css';
import click from '../sound/Click Sound.mp3';
import { useSelector } from 'react-redux';

function LoginTitle() {
  //랜덤 닉네임

  //카메라 마이크 권한 획득
  async function getMedia() {
    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
    } catch (err) {}
  }

  const randomUser = useSelector((state) => state.user.randomNick);
  const clearNick = () => {
    setNickname('');
  };
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
    getMedia();
  });

  //클릭 효과음
  const sound = new Audio(click);

  const ClickSound = () => {
    sound.play();
  };

  //닉네임 서버 전달
  const dispatch = useDispatch();

  const [nickname, setNickname] = useState('');

  const Login = () => {
    dispatch(userActions.LoginDB(nickname));
    ClickSound();
  };
  const randomNickClick = () => {
    dispatch(userActions.RandomNickDB());
    setNickname(randomUser);
    sound.play();
  };

  const randomNickDefault = () => {
    dispatch(userActions.RandomNickDB());
    setNickname(randomUser);
  };
  useEffect(() => {
    randomNickDefault();
    setNickname('');
  }, []);

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
                  width: '15%',
                  minWidth: '180px',
                  height: '50px',
                }}
                maxLength={18}
                placeholder="닉네임"
                onChange={(e) => {
                  setNickname(e.target.value);
                }}
                onClick={clearNick}
              />
              <div style={{ marginTop: '10px', fontFamily: 'yg-jalnan' }}>
                <span
                  style={{
                    marginLeft: '10px',
                    fontSize: '21px',
                    color: '#6164CE',
                  }}
                >
                  랜덤 닉네임 생성
                </span>
                <GiPerspectiveDiceSixFacesRandom
                  style={{
                    backgroundColor: '#9295FD',
                    borderRadius: '48px',
                    verticalAlign: 'middle',
                    marginLeft: '10px',
                    color: '#ffffff',
                    padding: '3px',
                    boxShadow: '5px 5px 5px gray',
                    cursor: 'pointer',
                  }}
                  size={48}
                  onClick={randomNickClick}
                />
              </div>
            </InputNick>
            <br />
            <StartBt onClick={Login}>start!</StartBt>
          </div>
        </TitleWrap>
        <div>{ScrollY > 2376 ? handleTop() : ''}</div>
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
  @media screen and (max-width: 1040px) {
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
  @media screen and (max-width: 1040px) {
    width: 70%;
  }
`;

const InputNick = styled.div`
  margin-top: 7%;
  @media screen and (max-width: 1040px) {
    margin-top: -10%;
  }
`;

const StartBt = styled.button`
  border: none;
  background-color: #9295fd;
  border-radius: 40px;
  font-size: 26px;
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
