import { createAction, handleActions } from 'redux-actions';
import { immerable, produce } from 'immer';

import axios from 'axios';
import { apis } from '../../shared/apis';

// post
const SET_ROOM = 'SET_ROOM';

const PRIVATE_ROOM = 'PRIVATE_ROOM';
const PRIVATE_STATE = 'PRIVATE_STATE';
//병우추가
const ADD_ROOM = 'ADD_ROOM';

// const ADD_POST = 'ADD_POST';
// const EDIT_POST = 'EDIT_POST';
const ENTER_USER = 'ENTER_USER';
const LEAVE_USER = 'LEAVE_USER';

//병우추가
const addRoom = createAction(ADD_ROOM, (room) => ({ room }));
const setRoom = createAction(SET_ROOM, (room_list) => ({ room_list }));
const enterUser = createAction(ENTER_USER, (enter_room) => ({ enter_room }));
const leaveUser = createAction(LEAVE_USER, (leave_room) => ({ leave_room }));
// const addPost = createAction(ADD_POST, (post) => ({ post }));
// const editPost = createAction(EDIT_POST, (post_id, post) => ({
//   post_id,
//   post,
// }));
const privateRoom = createAction(PRIVATE_ROOM, (roomId, privateState) => ({
  roomId,
  privateState,
}));
const privateState = createAction(PRIVATE_STATE, (privateState) => ({
  privateState,
}));

const initialState = {
  list: [],
  post: [],
  comments: [],
  room: [], // 병우추가
  roomState: {
    roomId: null,
    privateState: false,
  },
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

const enterRoomDB = (userId, roomId, roomPwd) => {
  return async function (dispatch, getState, { history }) {
    await axios
      .put(`http://mafia.milagros.shop/api/enter/${roomId}/user/${userId}`, {
        roomPwd: null,
      })
      .then((res) => {
        if (res.data.user.msg === undefined) {
          // dispatch(enterUser(res.data.user));
          history.replace(`/room/${roomId}`);
        } else {
          window.alert(res.data.user.msg);
          window.location.reload();
        }
      })
      .catch((error) => {
        window.alert(error);
      });
  };
};

const leaveRoomDB = (nickname, roomId) => {
  return function (dispatch, getState, { history }) {
    axios
      .put(`http://mafia.milagros.shop/api/out/${roomId}/user/${nickname}`, {
        nickname: nickname,
        roomId: roomId,
      })
      .then((response) => {
        dispatch(leaveUser(response.data.user));
<<<<<<< HEAD
=======
        // dispatch(liveUser(response.data.user));
>>>>>>> 596945056b90a9325ceee4021902c43d87452b9d
        console.log(response);
        window.location.replace('/');
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
        const roomId = response.data.room;
        history.push(`/room/${roomId}`);
      })
      .catch((error) => {
        window.alert(error);
      });
  };
};
const roomPwCheckAPI = (userId, roomId, pwd) => {
  console.log(userId);
  console.log(parseInt(pwd));
  console.log(roomId);
  return async function (dispatch, useState, { history }) {
    console.log(pwd);
    await axios
      .put(`http://mafia.milagros.shop/api/enter/${roomId}/user/${userId}`, {
        roomPwd: pwd,
      })
      .then((res) => {
        console.log(res);
        if (res.data.user.msg === undefined) {
          dispatch(enterUser(res.data.user));
          history.replace(`/room/${roomId}`);
        } else {
          window.alert(res.data.user.msg);
          window.location.reload();
        }
        // console.log(res.data.user);
        // dispatch(enterUser(res.data.user));
        // history.push(`/room/${roomId}`);
      })
      .catch((err) => {
        window.alert('비밀번호를 다시 확인해주세요');
        console.log(err);
      });
  };
};


export default handleActions(
  {
    [SET_ROOM]: (state, action) =>
      produce(state, (draft) => {
        draft.list = action.payload.room_list;
        console.log(draft.list);
        console.log(action.payload);
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
    [PRIVATE_ROOM]: (state, action) =>
      produce(state, (draft) => {
        draft.roomState.roomId = action.payload.roomId;
        draft.roomState.privateState = action.payload.privateState;
      }),
    [PRIVATE_STATE]: (state, action) =>
      produce(state, (draft) => {
        draft.roomState.privateState = action.payload.privateState;
      }),
  },
  initialState
);

const actionCreators = {
  getRoomAPI,
  enterRoomDB,
  leaveRoomDB,
  createRoomDB,
  privateRoom,
  privateState,
  roomPwCheckAPI,
};

export { actionCreators };
