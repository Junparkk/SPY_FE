import React from 'react';
import styled from 'styled-components';
import { history } from '../redux/configureStore';

const Login = () => {
  return (
    <React.Fragment>
      <Wrap>
      <LoginBox>
        <ImageBox>
          <Logo src="https://o.remove.bg/downloads/6a941e07-f203-4e69-97b5-aae49b83e64f/%EC%96%B4%EB%AA%BD%EC%96%B4%EC%8A%A4-removebg-preview.png" />
        </ImageBox>

          <Id placeholder="아이디를 입력해주세요"></Id>
          <br />
          <Pwd placeholder="비밀번호를 입력해주세요"></Pwd>
          <br />
          <LoginButton>로그인</LoginButton>
          <SignUpButton onClick={() => history.push('/signup')}>
            회원가입
          </SignUpButton>
          <SocialButton>
            <NaverButton src="https://blog.kakaocdn.net/dn/MQGfU/btrfiFgwIMd/O2PJqRb7LsXgxEhzQPKCEK/img.png" />
            <CacaoButton src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Kakao_logo.jpg?20171226171735" />
          </SocialButton>
        </LoginBox>
      </Wrap>
    </React.Fragment>
  );
};

const Wrap = styled.div`
    display: flex;
  height: 100vh;
  align-items: center;
  vertical-align: middle;
  background-color: #000000;
`;

const ImageBox = styled.div`
  width: 100%;
`;

const Logo = styled.div`
  width: 300px;
  height: 300px;
  margin: auto;
  background-image: url('${(props) => props.src}');
  background-repeat: no-repeat;
  background-size: contain;
`;

const LoginBox = styled.div`
  text-align: center;
  width: 100%;
`;
const Id = styled.input`
  width: 200px;
  padding: 8px;
  margin: 8px;
  border-radius: 7px;
`;
const Pwd = styled.input`
  width: 200px;
  margin: 8px;
  padding: 8px;
  border-radius: 7px;
`;
const LoginButton = styled.button`
  margin: 8px;
  padding: 8px;
  border-radius: 7px;
`;
const SignUpButton = styled.button`
  margin: 8px;
  padding: 8px;
  border-radius: 7px;
`;

const SocialButton = styled.div`
  display: flex;
  justify-content: center;
`;

const NaverButton = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 7px;
  background-image: url('${(props) => props.src}');
  background-repeat: no-repeat;
  background-size: contain;
  cursor: pointer;
  margin: 8px;
`;
const CacaoButton = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 7px;
  background-image: url('${(props) => props.src}');
  background-repeat: no-repeat;
  background-size: contain;
  padding: 3px;
  cursor: pointer;
  margin: 8px;
`;

export default Login;
