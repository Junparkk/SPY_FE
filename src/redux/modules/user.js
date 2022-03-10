import { createAction, handleActions } from 'redux-actions';
import { produce } from 'immer';
import axios from 'axios';

//액션
const SET_USER = 'SET_USER';
const LOG_OUT = 'LOG_OUT';

//액션 생성
const logout = createAction(LOG_OUT, (user) => ({ user }));
const setUser = createAction(SET_USER, (user) => ({ user }));

const initialState = {
  user: null,
};

const LoginCheckDB = () => {
  return function (dispatch, getState, { history }) {
    axios
      .get('api 주소 입력', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('is_login')}`,
        },
      })
      .then((response) => {
        console.log(response);
        dispatch(
          setUser({
            is_login: response,
            user_id: response.data.user.user_id,
            user_nick: response.data.user.user_nick,
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

const LogOutDB = () => {
  return function (dispatch, getState, { history }) {
    dispatch(logout());
    history.push('/');
  };
};

const LoginDB = (nickname) => {
  return function (dispatch, getState, { history }) {
    axios
      .post('http://mafia.milagros.shop/api/user', {
        nickname: nickname,
      })
      .then((response) => {
        window.alert(`${nickname} 님 반가워요`);
        console.log(response);
        localStorage.setItem('nickname', nickname);
        localStorage.setItem('userid', response.data.user.id);
        history.push('/');
      })
      .catch((error) => {
        window.alert(error);
      });
  };
};

const dubCheckNickFB = (nick) => {
  return function (dispatch, getState, { history }) {
    axios
      .post('api 주소 입력', { user_nick: nick })
      .then((response) => {
        console.log(response);
        window.alert(response.data.msg);
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export default handleActions(
  {
    [SET_USER]: (state, action) =>
      produce(state, (draft) => {
        draft.user = action.payload.user;
        draft.is_login = true;
      }),
    [LOG_OUT]: (state, action) =>
      produce(state, (draft) => {
        localStorage.clear();
        draft.user = null;
        draft.is_login = false;
      }),
  },
  initialState
);

const actionCreators = {
  LoginDB,
  dubCheckNickFB,
  LogOutDB,
  LoginCheckDB,
};

export { actionCreators };
