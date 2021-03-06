import { createAction, handleActions } from 'redux-actions';
import { immerable, produce } from 'immer';

import axios from 'axios';
import { apis } from '../../shared/apis';
import io from 'socket.io-client';

const socket = io.connect('https://mafia.milagros.shop');

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
const READY_CHECK = 'READY_CHECK';
const WINNER_LIST = 'WINNER_LIST';

const addRoom = createAction(ADD_ROOM, (room) => ({ room }));
const setRoom = createAction(SET_ROOM, (room_list) => ({ room_list }));
const enterUser = createAction(ENTER_USER, (enter_room) => ({ enter_room }));
const leaveUser = createAction(LEAVE_USER, (leave_room) => ({ leave_room }));
const roundNoInfo = createAction(ROUND_NUM, (round_num) => ({ round_num }));

const privateRoom = createAction(PRIVATE_ROOM, (roomId, privateState) => ({
  roomId,
  privateState,
}));
const privateState = createAction(PRIVATE_STATE, (privateState) => ({
  privateState,
}));

const startCheck = createAction(START_CHECK, (check) => ({ check }));
const readyCheck = createAction(READY_CHECK, (check) => ({ check }));
const winnerList = createAction(WINNER_LIST, (winner) => ({ winner }));

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
  startCheck: false,
  readyCheck: false,
  winner: [],
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

//방들어가기
const enterRoomDB = (userId, roomId, roomPwd) => {
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
        socket.emit('currUsers', { roomId });
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
        console.log(error);
        window.alert(error);
      });
  };
};
// 방 들어갈 때 패스워드 확인하기
const roomPwCheckAPI = (userId, roomId, pwd) => {
  return async function (dispatch, useState, { history }) {
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
        console.log(error);
      });
  };
};
//방 시작하기
const doStartAPI = (roomId, userId, changeMaxLength) => {
  return function (dispatch, useState, { history }) {
    apis
      //시작 전 조건확인
      .checkStart(roomId, userId)
      .then((res) => {
        console.log(res, '==============₩=======');
        // max = cur 바로 실행
        if (res.data.msg === '시작!') {
          apis
            .start(roomId)
            .then(
              () => dispatch(startCheck(true)),
              socket.emit('getStatus', { roomId: roomId, status: 'roleGive' })
            )
            .catch((err) => console.log(err));
        } else {
          //api가 추가되어 빈 인원 수 대체
          apis
            .makeAiPlayer(roomId)
            .then(() => {
              apis
                .start(roomId)
                .then(
                  (res) => dispatch(startCheck(true)),
                  socket.emit('getStatus', {
                    roomId: roomId,
                    status: 'roleGive',
                  })
                )
                .catch(() => {});
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((error) => {
        console.log(error);
        window.confirm(error.response.data.msg);
      });
  };
};

//게임시작확인 미완
const startCheckAPI = (roomId) => {
  return async function (dispatch, useState, { history }) {
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

//게임 최종결과 페이지에서 결과 불러오기
const finalResult = (roomId) => {
  return async function (dispatch, useState, { history }) {
    await apis
      .finalResult(roomId)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

//최종 승리자 API
const WinnerDB = (roomId, userId) => {
  return async function (dispatch, useState, { history }) {
    await apis
      .winnerList(roomId, userId)
      .then((res) => {
        console.log(res.data.users);
        dispatch(winnerList(res.data.users));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

//방데이터 삭제 API
const deleteDB = (roomId) => {
  return async function (dispatch, useState, { history }) {
    await apis
      .deleteRoom(roomId)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
export default handleActions(
  {
    [SET_ROOM]: (state, action) =>
      produce(state, (draft) => {
        draft.list = action.payload.room_list;
      }),

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
        draft.round = action.payload.round_num;
      }),
    [GAME_START]: (state, action) =>
      produce(state, (draft) => {
        draft.gameStart = action.payload.start;
      }),
    [START_CHECK]: (state, action) =>
      produce(state, (draft) => {
        draft.startCheck = action.payload.check;
      }),
    [READY_CHECK]: (state, action) =>
      produce(state, (draft) => {
        draft.readyCheck = action.payload.check;
      }),
    [WINNER_LIST]: (state, action) =>
      produce(state, (draft) => {
        draft.winner = action.payload.winner;
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
  startCheckAPI,
  roundNoInfo,
  finalResult,
  readyCheck,
  WinnerDB,
  deleteDB,
};

export { actionCreators };