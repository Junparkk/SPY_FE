import React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { CgCloseO } from 'react-icons/cg';

import { actionCreators as roomActions } from '../redux/modules/room';
const PasswordModal = (props) => {
  const { _handleModal, children, ...rest } = props;
  const dispatch = useDispatch();
  const nickName = localStorage.getItem('userid');
  const [pwd, setPwd] = React.useState('');
  const roomId = useSelector((state) => state.room.roomState.roomId);
  console.log(roomId);
  const onChangePwd = (e) => {
    setPwd(e.target.value);
    console.log(pwd);
  };
  return createPortal(
    <>
      <PrivateModalContainer>
        <PrivateModalDim />
        <PrivateModal>
          <CgCloseO
            style={{ cursor: 'pointer', float:'right', marginTop:"25px", color: "#eee" }}
            alt="닫기"
            size={25}
            className="privateModal_top_close"
            onClick={() => {
              dispatch(roomActions.privateState(false));
              window.location.replace('/lobby');
            }}
            
          />
          <div
            style={{
              marginTop: '65px',
              textAlign: 'center',
              fontFamily: 'yg-jalnan',
              color: '#FFF',
            }}
          >
            비밀번호를 입력하세요
          </div>
          <PrivateModalMid>
            <input
              style={{
                margin: '30px 0px 0px 110px',
                border: 'none',
                height: '35px',
                borderRadius: '20px',
                width: '220px',
              }}
              onChange={onChangePwd}
              value={pwd}
              type="password"
              placeholder="4자 이상의 비밀번호"
            />
          </PrivateModalMid>
          <PrivateModalBot>
            <p
              style={{
                color: '#fff',
                fontFamily: 'yg-jalnan',
                borderRadius: '45px',
                backgroundColor: '#6164ce',
                boxShadow: "0px 3px 3px #666666",
                cursor: 'pointer'
              }}
              className="privateModal_bot_btn"
              onClick={() => {
                if (pwd.length < 4) {
                  window.alert('4글자 이상의 비밀번호를 작성해주세요.');
                } else {
                  dispatch(
                    roomActions.roomPwCheckAPI(nickName, roomId, parseInt(pwd))
                  );
                }
              }}
            >
              완료
            </p>
          </PrivateModalBot>
        </PrivateModal>
      </PrivateModalContainer>
    </>,
    document.getElementById('PasswordModal')
  );
};

const PrivateModalContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  height: 100vh;
  width: 100vw;
`;
const PrivateModalDim = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #000;
  opacity: 54%;
`;
const PrivateModal = styled.div`
  width: 28.54vw;
  height: 32.27vh;
  border: 5px solid #6164ce;
  background: #9296fd;
  border-radius: 70px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0 2.29vw;
  box-sizing: border-box;
`;
const PrivateModalTop = styled.div`
  width: 100%;
  height: 7.68vh;
  position: relative;
  .privateModal_top_title {
    font-size: 1.84vh;
    font-weight: 600;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }
  .privateModal_top_close {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    height: 2.46vh;
    width: 1.25vw;
  }
`;
const PrivateModalMid = styled.div`
  width: 100%;
  .privateModal_mid_password {
    margin: 3.69vh 0 0.82vh 0.73vw;
    font-size: 1.43vh;
  }
`;
const PrivateModalBot = styled.div`
  width: 21%;
  margin: auto;
  padding-top: 3.69vh;
  .privateModal_bot_btn {
    width: 100%;
    height: 4.53vh;
    background: #889cf2;
    border-radius: 11px;
    color: #fff;
    font-size: 1.84vh;
    font-weight: 600;
    text-align: center;
    line-height: 4.53vh;
  }
`;

export default PasswordModal;
