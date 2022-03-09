import { createAction, handleActions } from 'redux-actions';
import { immerable, produce } from 'immer';

import axios from 'axios';
import { apis } from '../../shared/apis';

// post
const SET_ROOM = 'SET_ROOM';
//병우추가
const ADD_ROOM = 'ADD_ROOM';

// const ADD_POST = 'ADD_POST';
// const EDIT_POST = 'EDIT_POST';
const ENTER_USER = 'ENTER_USER';
const LIVE_USER = 'LIVE_USER';

//병우추가
const addRoom = createAction(ADD_ROOM, (room) => ({ room }));
const setRoom = createAction(SET_ROOM, (room_list) => ({ room_list }));
const enterUser = createAction(ENTER_USER, (enter_room) => ({ enter_room }));
const liveUser = createAction(LIVE_USER, (live_room) => ({ live_room }));
// const addPost = createAction(ADD_POST, (post) => ({ post }));
// const editPost = createAction(EDIT_POST, (post_id, post) => ({
//   post_id,
//   post,
// }));

const initialState = {
  list: [],
  post: [],
  comments: [],
  room: [], // 병우추가
};

const initialPost = {
  postId: 'aalasdf',
  title: '아이폰 10',
  content: '아이폰 팔아요',
  price: 1000,
  imgurl: 'http://gi.esmplus.com/dodomae/NAR/Monami/pluspen3000.jpg',
  createdAt: '2022-02-22',
  updatedAt: '2022-02-25',
  nickname: 'fasdfasdf',
  userId: 'id',
  isSold: false,
};

//middleware

//전체 방 조회
const getRoomAPI = () => {
  return async function (dispatch, useState, { history }) {
    await apis.lobby().then(function (res) {
      dispatch(setRoom(res.data.rooms));
    });
  };
};

const enterRoomDB = (nickname, roomId, roomPwd) => {
  return function (dispatch, getState, { history }) {
    axios
      .put(`http://mafia.milagros.shop/api/enter/${roomId}/user/${nickname}`, {
        nickname: nickname,
        roomId: roomId,
        roomPwd: null,
      })
      .then((response) => {
        if (response.data.user.msg || false) {
          dispatch(enterUser(response.data.user));
          history.push(`/room/${roomId}`);
        } else {
          window.alert(response.data.user.msg);
          window.location.reload();
        }
      })
      .catch((error) => {
        window.alert(error);
      });
  };
};

const liveRoomDB = (nickname, roomId) => {
  return function (dispatch, getState, { history }) {
    axios
      .put(`http://mafia.milagros.shop/api/out/${roomId}/user/${nickname}`, {
        nickname: nickname,
        roomId: roomId,
      })
      .then((response) => {
        dispatch(liveUser(response.data.user));
        console.log(response);
        history.push('/');
      })
      .catch((error) => {
        window.alert(error);
      });
  };
};
//병우 추가
const createRoomDB = (roomName, maxPlayer, roomPwd = null, userId) => {
  return function (dispatch, getState, { history }) {
    axios
      .post(`http://mafia.milagros.shop/api/room/user/${userId}`, {
        roomName,
        maxPlayer,
        roomPwd,
      })
      .then((response) => {
        console.log(response);
        // history.push();
      })
      .catch((error) => {
        window.alert(error);
      });
  };
};

export default handleActions(
  {
    [SET_ROOM]: (state, action) =>
      produce(state, (draft) => {
        draft.list = action.payload.room_list;
      }),
    // [ONE_POST]: (state, action) =>
    //   produce(state, (draft) => {
    //     draft.post = action.payload.post;
    //     draft.post.comments = action.payload.comments;
    //   }),
    // [ADD_POST]: (state, action) =>
    //   produce(state, (draft) => {
    //     draft.list.unshift(action.payload.post);
    //   }),
    // [EDIT_POST]: (state, action) =>
    //   produce(state, (draft) => {
    //     draft.list = action.payload;
    //   }),

    //병우추가
    // [ADD_ROOM]: (state, action) =>
    //   produce(state, (draft) => {
    //     draft.room = action.payload.game_room;
    //     // console.log(action, '넘어오니?');
    //     console.log(draft.list);
    //   }),
  },
  initialState
);

const actionCreators = {
  getRoomAPI,
  enterRoomDB,
  liveRoomDB,
  createRoomDB,
};

export { actionCreators };
