import { createAction, handleActions } from 'redux-actions';
import { immerable, produce } from 'immer';

import axios from 'axios';
import { apis } from '../../shared/apis';

// post
const SET_ROOM = 'SET_ROOM';
// const ADD_POST = 'ADD_POST';
// const EDIT_POST = 'EDIT_POST';
const ENTER_USER = 'ENTER_USER';

const setRoom = createAction(SET_ROOM, (room_list) => ({ room_list }));
const enterUser = createAction(ENTER_USER, (enter_room) => ({ enter_room }));
// const addPost = createAction(ADD_POST, (post) => ({ post }));
// const editPost = createAction(EDIT_POST, (post_id, post) => ({
//   post_id,
//   post,
// }));

const initialState = {
  list: [],
  post: [],
  comments: [],
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
      console.log('불러와져랏', res);
    });
  };
};

const enterRoomDB = (nickname, roomId) => {
  return function (dispatch, getState, { history }) {
    axios
      .put(`http://mafia.milagros.shop/api/enter/${roomId}/user/${nickname}`, {
        nickname: nickname,
        roomId: roomId,
        roomPwd: null,
      })
      .then((response) => {
        if (response.data.user.msg || false) {
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
  },
  initialState
);

const actionCreators = {
  getRoomAPI,
  enterRoomDB,
};

export { actionCreators };
