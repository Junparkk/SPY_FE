import { createAction, handleActions } from 'redux-actions';
import { produce } from 'immer';
import axios from 'axios';
import { apis } from '../../shared/apis';

// toast
import { toast } from 'react-toastify';

//액션
const GET_USER_INFO = 'GET_USER_INFO';
const LOG_OUT = 'LOG_OUT';
const RANDOM_NICK = 'RANDOM_NICK';

//액션 생성
const getuser = createAction(GET_USER_INFO, (user_info) => ({ user_info }));
const logout = createAction(LOG_OUT, (user) => ({ user }));
const randomNick = createAction(RANDOM_NICK, (user) => user);

const initialState = {
  user: null,
  userinfo: null,
  randomNick: null,
};

const GetUser = (userId, roomId) => {
  return function (dispatch, getState, { history }) {
    axios
      .get(`https://mafia.milagros.shop/api/room/${roomId}/user/${userId}/info`)
      .then((res) => {
        dispatch(getuser(res.data.user));
      })
      .catch((err) => {
        console.log(err);
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
      .post('https://mafia.milagros.shop/api/user', {
        nickname,
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
    [LOG_OUT]: (state, action) =>
      produce(state, (draft) => {
        localStorage.clear();
        draft.user = null;
        draft.is_login = false;
      }),
    [GET_USER_INFO]: (state, action) =>
      produce(state, (draft) => {
        draft.userinfo = action.payload.user_info;
      }),
    [RANDOM_NICK]: (state, action) =>
      produce(state, (draft) => {
        draft.randomNick = action.payload;
      }),
  },
  initialState
);

const actionCreators = {
  GetUser,
  LoginDB,
  LogOutDB,
  RandomNickDB,
  randomNick,
};

export { actionCreators };
