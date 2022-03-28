import { createAction, handleActions } from 'redux-actions';
import { produce } from 'immer';
import axios from 'axios';
// toast
import { toast } from 'react-toastify';

//액션
const SET_USER = 'SET_USER';
const LOG_OUT = 'LOG_OUT';
const RANDOM_NICK = 'RANDOM_NICK';

//액션 생성
const logout = createAction(LOG_OUT, (user) => ({ user }));
const randomNick = createAction(RANDOM_NICK, (user) => user);

const initialState = {
  user: null,
  randomNick: null,
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
      .post('https://mafia.milagros.shop/api/user', {
        nickname: nickname,
      })
      .then((response) => {
        toast.success(`${nickname} 님 반가워요`);
        console.log(response);
        localStorage.setItem('nickname', nickname);
        localStorage.setItem('userid', response.data.user.id);
        window.location.replace('/lobby');
      })
      .catch((error) => {
        window.alert(error);
      });
  };
};

const RandomNickDB = () => {
  return function (dispatch, getState, { history }) {
    axios
      .get('https://mafia.milagros.shop/api/randomNick', {})
      .then((res) => {
        dispatch(randomNick(res.data.nick));
      })
      .catch((error) => {
        window.alert(error);
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
    [RANDOM_NICK]: (state, action) =>
      produce(state, (draft) => {
        draft.randomNick = action.payload;
      }),
  },
  initialState
);

const actionCreators = {
  LoginDB,
  LogOutDB,
  RandomNickDB,
  randomNick,
};

export { actionCreators };
