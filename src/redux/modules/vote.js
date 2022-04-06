import { createAction, handleActions } from 'redux-actions';
import { produce } from 'immer';

// import axios from 'axios';
import { apis } from '../../shared/apis';
import io from 'socket.io-client';

// Toast alert
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io.connect('https://mafia.milagros.shop');

// post
const SET_USERS = 'SET_USERS';
// const SEND_VOTE = 'SEND_VOTE';
const ROLE_GIVE = 'ROLE_GIVE';
const LAWYER_NULL_VOTE = 'LAYER_NULL_VOTE';
const SPY_NULL_VOTE = 'SPY_NULL_VOTE';
const IS_VOTE = 'IS_VOTE';

const setUsers = createAction(SET_USERS, (users_list) => ({ users_list }));
const giveUsers = createAction(ROLE_GIVE, (users) => ({ users }));
const lawyerNullVote = createAction(LAWYER_NULL_VOTE, (vote) => ({ vote }));
const spyNullVote = createAction(SPY_NULL_VOTE, (vote) => ({ vote }));
const _isVote = createAction(IS_VOTE, (voteCheck) => ({ voteCheck }));

const initialState = {
  userList: [],
  dayTimeVoteModalState: {
    roomId: null,
    privateState: false,
  },
  userId: [],
  users: [],
  isLawyerNull: false,
  isSpyNull: false,
  _isVote: false,
};

//middleware

//전체 유저 조회
const getUserDB = (roomId) => {
  return async function (dispatch, useState, { history }) {
    await apis.player(roomId).then(function (res) {
      
      dispatch(setUsers(res.data.users));
    });
  };
};

//낮시간 투표 선택인원 보내기
const sendDayTimeVoteAPI = (chosenRoomId, userId, round, chosenId, roomId) => {
  return async function (dispatch, useState, { history }) {
    await apis
      .dayTimeVote(chosenRoomId, userId, {
        roundNo: round,
        candidacy: chosenId,
      })
      .then(function (res) {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };
};
//낮시간 투표 결과
const resultDayTimeVoteAPI = (roomId, roundNo) => {
  return async function (dispatch, useState, { history }) {
    await apis
      .dayTimeVoteResult(roomId, roundNo)
      .then(function (res) {
        if (res.data.result === 0) {
          dispatch(getUserDB(roomId));
          socket.emit('getMsg', {
            roomId,
            msg: res.data.msg,
          });
          setTimeout(() => {
            socket.emit('getStatus', {
              roomId: roomId,
              status: 'voteNightLawyer',
            });
          }, 3000);
        } else {
          setTimeout(() => {
            socket.emit('getStatus', {
              roomId: roomId,
              status: 'winner',
            });
          }, 500);
          history.replace(`/result/${roomId}`);
        }
      })
      .catch((err) => console.log(err));
  };
};

//변호사 투표
const lawyerActDB = (roomId, userId) => {
  return async function (dispatch, useState, { history }) {
    await apis
      .lawyerAct(roomId, userId)
      .then(function (res) {
        toast.success(res.data.msg, {
          draggable: false,
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
          pauseOnFocusLoss: false,
          pauseOnHover: false,
        });
        setTimeout(() => {
          socket.emit('getStatus', {
            roomId: roomId,
            status: 'voteNightDetective',
          });
        }, 500);
      })
      .catch((err) => {
        console.log(err.data);
        setTimeout(() => {
          socket.emit('getStatus', {
            roomId: roomId,
            status: 'voteNightDetective',
          });
        }, 500);
      });
  };
};

//탐정 투표
const detectiveActDB = (roomId, userId) => {
  return async function (dispatch, useState, { history }) {
    await apis
      .detectiveAct(roomId, userId)
      .then((res) => {
        toast.success(res.data.msg, {
          draggable: false,
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
          pauseOnFocusLoss: false,
          pauseOnHover: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

//스파이 투표
const spyActDB = (roomId, userId) => {
  return async function (dispatch, useState, { history }) {
    await apis
      .spyAct(roomId, userId)
      .then(function (res) {
        setTimeout(() => {
          socket.emit('getStatus', {
            roomId: roomId,
            status: 'showResultNight',
          });
          socket.emit('getMsg', {
            roomId,
            msg: res.data.msg,
          });
        }, 500);
      })
      .catch((err) =>
        console.log(err)
      );
  };
};

//룰 부여
const divisionRole = (roomId) => {
  return async function (dispatch, useState, { history }) {
    await apis
      .role(roomId)
      .then((res) => {
        dispatch(giveUsers(res.data.users));
        socket.emit('getStatus', { roomId: roomId, status: 'showRole' });
      })
      .catch((err) => console.log(err));
  };
};

// 아무 입력 없으면 자동으로 무효표 처리
const invalidVote = (roomId, roundNo, userId) => {
  return async function (dispatch, useState, { history }) {
    await apis
      .sendInvalidVote(roomId, roundNo, userId)
      .then(function (res) {
        socket.emit('getStatus', { roomId: roomId, status: 'showResultDay' });
      })
      .catch((err) => console.log(err));
  };
};

// 유저가 투표했는지 확인( 0 or 1이상 )
const isVoteDB = (roomId) => {
  return async function (dispatch, useState, { history }) {
    await apis
      .isVote(roomId)
      .then((res) => {
        dispatch(_isVote(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
// 투표결과 확인
const voteResult = (roomId, userId) => {
  return async function (dispatch, useState, { history }) {
    await apis
      .gameResult(roomId, userId)
      .then((res) => {
        if (res.data.result === 0) {
          setTimeout(() => {
            socket.emit('getStatus', { roomId: roomId, status: 'dayTime' });
          }, 500);
        
        } else if (res.data.result === 1) {
         
          history.replace(`/result/${roomId}`);
        } else if (res.data.result === 2) {
          
          history.replace(`/result/${roomId}`);
        }
      })
      .catch((err) => console.log(err));
  };
};

export default handleActions(
  {
    [SET_USERS]: (state, action) =>
      produce(state, (draft) => {
        draft.userList = action.payload.users_list;
      }),
    [ROLE_GIVE]: (state, action) =>
      produce(state, (draft) => {
        draft.users = action.payload.users;
       
      }),
    [LAWYER_NULL_VOTE]: (state, action) =>
      produce(state, (draft) => {
        draft.isLawyerNull = action.payload.vote;
      }),
    [SPY_NULL_VOTE]: (state, action) =>
      produce(state, (draft) => {
        draft.isSpyNull = action.payload.vote;
      }),
    [IS_VOTE]: (state, action) =>
      produce(state, (draft) => {
        draft._isVote = action.payload.voteCheck;
      }),
  },
  initialState
);

const actionCreators = {
  getUserDB,
  setUsers,
  sendDayTimeVoteAPI,
  resultDayTimeVoteAPI,
  lawyerActDB,
  detectiveActDB,
  spyActDB,
  divisionRole,
  invalidVote,
  lawyerNullVote,
  spyNullVote,
  isVoteDB,
  voteResult,
};

export { actionCreators };
