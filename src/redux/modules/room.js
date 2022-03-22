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
const ROUND_NUM = 'ROUND_NUM';
const GAME_START = 'GAME_START';
const START_CHECK = 'START_CHECK';

const addRoom = createAction(ADD_ROOM, (room) => ({ room }));
const setRoom = createAction(SET_ROOM, (room_list) => ({ room_list }));
const enterUser = createAction(ENTER_USER, (enter_room) => ({ enter_room }));
const leaveUser = createAction(LEAVE_USER, (leave_room) => ({ leave_room }));
const roundNoInfo = createAction(ROUND_NUM, (round_num) => ({ round_num }));
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
const gameStart = createAction(GAME_START, (start) => ({ start }));

const startCheck = createAction(START_CHECK, (Check) => ({ Check }));

const initialState = {
  list: [],
  post: [],
  comments: [],
  room: [],
  roomState: {
    roomId: null,
    privateState: false,
  },
  round: 0,
  gameStart: false,
  // startCheck: Y or N,
};

//middleware

//전체 방 조회
const getRoomAPI = () => {
  return async function (dispatch, useState, { history }) {
    await apis.lobby().then(function (res) {
      console.log(res);
      dispatch(setRoom(res.data.rooms));
    });
  };
};
//방들어가기
const enterRoomDB = (userId, roomId, roomPwd) => {
  console.log(roomId);
  return async function (dispatch, getState, { history }) {
    await axios
      .put(`https://mafia.milagros.shop/api/enter/${roomId}/user/${userId}`, {
        roomPwd: null,
      })
      .then((res) => {
        console.log(res);
        history.replace(`/room/${roomId}`);
      })
      .catch((error) => {
        window.alert(error.response.data.msg);
        console.log(error.response.data.msg);
        window.location.reload();
      });
  };
};
//방 나가기
const leaveRoomDB = (nickname, roomId) => {
  return function (dispatch, getState, { history }) {
    axios
      .patch(`https://mafia.milagros.shop/api/out/${roomId}/user/${nickname}`, {
        nickname: nickname,
        roomId: roomId,
      })
      .then((response) => {
        dispatch(leaveUser(response.data.user));
        console.log(response);
        window.location.replace('/lobby');
      })
      .catch((error) => {
        window.alert(error);
        console.log(error.response.data.msg);
      });
  };
};
//병우 추가
const createRoomDB = (roomName, maxPlayer, roomPwd = null, userId) => {
  return function (dispatch, getState, { history }) {
    axios
      .post(`https://mafia.milagros.shop/api/room/user/${userId}`, {
        roomName,
        maxPlayer,
        roomPwd,
      })
      .then((response) => {
        console.log(response);
        const roomId = response.data.room.id;
        history.push(`/room/${roomId}`);
      })
      .catch((error) => {
        console.log(error.response.data.msg);
        window.alert(error.msg);
      });
  };
};
// 방 들어갈 때 패스워드 확인하기
const roomPwCheckAPI = (userId, roomId, pwd) => {
  console.log(userId);
  console.log(parseInt(pwd));
  console.log(roomId);
  return async function (dispatch, useState, { history }) {
    console.log(pwd);
    await axios
      .put(`https://mafia.milagros.shop/api/enter/${roomId}/user/${userId}`, {
        roomPwd: pwd,
      })
      .then((res) => {
        console.log(res);
        history.replace(`/room/${roomId}`);
      })
      .catch((error) => {
        window.alert(error.response.data.msg);
      });
  };
};
// 유저 방에서 레디하기
const doReadyAPI = (roomId, userId) => {
  return async function (dispatch, useState, { history }) {
    await apis
      .ready(roomId, userId)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error.response.data.msg);
      });
  };
};
// 유저 방 레디 취소하기
const cancelReadyAPI = (roomId, userId) => {
  return async function (dispatch, useState, { history }) {
    await apis
      .cancelReady(roomId, userId)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error.response.data.msg);
      });
  };
};
//방 시작하기
const doStartAPI = (roomId, userId, changeMaxLength) => {
  return async function (dispatch, useState, { history }) {
    await apis
      .checkStart(roomId, userId)
      .then((res) => {
        console.log(res);
        // 정상 실행
        if (res.data.msg === '시작!') {
          apis
            .start(roomId)
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
          dispatch(gameStart(true));
        } else {
          const firstCheck = window.confirm(res.data.msg);
          if (firstCheck) {
            //AI로 실행
            apis
              .makeAiPlayer(roomId)
              .then((res) => {
                apis
                  .start(roomId)
                  .then((res) => dispatch(gameStart(true)))
                  .catch((err) => console.log(err));
              })
              .catch((err) => console.log(err));
          } else {
            //AI로 실행 거절
            const secondCheck = window.confirm(
              '바로 시작 가능 인원으로 시작 하시겠습니까?'
            );
            if (secondCheck) {
              //인원수 줄여서 시작
              if (changeMaxLength < 6) {
                window.alert('최소 플레이 가능 인원은 6명입니다.');
              } else {
                apis
                  .changeMaxPlayer(roomId, { maxPlayer: changeMaxLength })
                  .then((res) =>
                    apis
                      .start(roomId)
                      .then((res) => console.log(res))
                      .catch((err) => console.log(err))
                  )
                  .catch((err) => console.log(err));
              }
            } else {
              //대기실로 돌아가기
              window.alert('대기실로 돌아갑니다.');
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
        window.confirm(error.response.data.msg);
      });
  };
};

//방 라운드 정보
const roundNoAIP = (roomId) => {
  return async function (dispatch, useState, { history }) {
    console.log(roomId);
    await apis
      .getGameRoundNo(roomId)
      .then((res) => {
        dispatch(roundNoInfo(res.data.roundNo));
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

//게임시작확인 미완
const startCheckAPI = (roomId) => {
  return async function (dispatch, useState, { history }) {
    console.log(roomId);
    await apis
      .startCheck(roomId)
      .then((res) => {
        dispatch(roundNoInfo(res.data.roundNo));
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
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
    [ROUND_NUM]: (state, action) =>
      produce(state, (draft) => {
        console.log(action.payload.round_num);
        draft.round = action.payload.round_num;
      }),
    [GAME_START]: (state, action) =>
      produce(state, (draft) => {
        draft.gameStart = action.payload.start;
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
  doReadyAPI,
  doStartAPI,
  cancelReadyAPI,
  roundNoAIP,
  gameStart,
  startCheckAPI,
};

export { actionCreators };
