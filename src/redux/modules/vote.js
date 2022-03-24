import { createAction, handleActions } from 'redux-actions';
import { produce } from 'immer';

// import axios from 'axios';
import { apis } from '../../shared/apis';
import io from 'socket.io-client';

// Toast alert
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io.connect('https://mafia.milagros.shop');

// post
const SET_USERS = 'SET_USERS';
// const SEND_VOTE = 'SEND_VOTE';
const ROLE_GIVE = 'ROLE_GIVE';
const VOTE_CHECK = 'VOTE_CHECK';
const LAWYER_NULL_VOTE = 'LAYER_NULL_VOTE';
const SPY_NULL_VOTE = 'SPY_NULL_VOTE';
const IS_VOTE = 'IS_VOTE';

const setUsers = createAction(SET_USERS, (users_list) => ({ users_list }));
// const answerUsers = createAction(SEND_VOTE, (userId) => ({ userId }));
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
  isLawyerNull: true,
  isSpyNull: true,
  _isVote: false,
};

//middleware

//전체 유저 조회
const getUserDB = (roomId) => {
  return async function (dispatch, useState, { history }) {
    await apis.player(roomId).then(function (res) {
      console.log(res.data.users);
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
        setTimeout(() => {
          socket.emit('getStatus', roomId);
        }, 500);
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
        setTimeout(() => {
          socket.emit('getStatus', roomId);
        }, 500);
        console.log('이건 apis 안------------------------');
        console.log(res.data.result);
      })
      .catch((err) => console.log(err));
  };
};

//변호사 투표
const lawyerActDB = (roomId, userId) => {
  return async function (dispatch, useState, { history }) {
    console.log(roomId, userId, '변호사');
    await apis
      .lawyerAct(roomId, userId)
      .then(function (res) {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.data.msg);
        toast.error(err.data.msg, {
          draggable: true,
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
          pauseOnFocusLoss: false,
          pauseOnHover: false,
        });
      });
  };
};

//탐정 투표
const detectiveActDB = (roomId, userId) => {
  return async function (dispatch, useState, { history }) {
    console.log(userId, '탐정 리듀서');
    await apis
      .detectiveAct(roomId, userId)
      .then(function (res) {
        console.log(res.data);
        window.alert(res.data.msg);
        // dispatch(answerUsers(res.data.userId));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

//스파이 투표
const spyActDB = (roomId, userId) => {
  return async function (dispatch, useState, { history }) {
    console.log(userId, '스파이 리듀서');
    await apis
      .spyAct(roomId, userId)
      .then(function (res) {
        console.log(res.data);
        window.alert(res.data.msg);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.data.msg, {
          draggable: true,
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
          pauseOnFocusLoss: false,
          pauseOnHover: false,
        });
      });
  };
};

//룰 부여
const divisionRole = (roomId) => {
  return async function (dispatch, useState, { history }) {
    await apis;
    console
      .log('vote.js의 룸 아이디', roomId)
      .role(roomId)
      .then((res) => {
        console.log('api 요청 후 DB 삽입됨', res, Date().toString());
        dispatch(giveUsers(res.data.users));
        socket.emit('getStatus', roomId);

        //롤 보여주는 모달 호출해줘야함!!!!!
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

// 아무 입력 없으면 자동으로 무효표 처리
const invalidVote = (roomId, roundNo, userId) => {
  return async function (dispatch, useState, { history }) {
    await apis
      .sendInvalidVote(roomId, roundNo, userId)
      .then(function (res) {
        setTimeout(() => {
          socket.emit('getStatus', roomId);
        }, 500);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

// 유저가 투표했는지 확인( 0 or 1이상 )
const isVoteDB = (roomId) => {
  return async function (dispatch, useState, { history }) {
    await apis
      .isVote(roomId)
      .then((res) => {
        dispatch(_isVote(res.data));
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
// 투표결과 확인
const voteResult = (roomId) => {
  return async function (dispatch, useState, { history }) {
    await apis
      .gameResult(roomId)
      .then((res) => {
        if (res.data.result === 0) {
          console.log(res);
          setTimeout(() => {
            socket.emit('getStatus', roomId);
          }, 500);
        } else if (res.data.result === 1) {
          history.push('/result');
        } else if (res.data.result === 2) {
          history.push('/result');
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
    // [SEND_VOTE]: (state, action) =>
    //   produce(state, (draft) => {
    //     draft.userId = action.payload.userId;
    //     console.log(draft.userId);
    //     console.log(action.payload);
    //   }),
    [ROLE_GIVE]: (state, action) =>
      produce(state, (draft) => {
        draft.users = action.payload.users;
        console.log(draft.users);
        console.log(action.payload);
      }),
    [LAWYER_NULL_VOTE]: (state, action) =>
      produce(state, (draft) => {
        draft.isLawyerNull = !action.payload.vote;
      }),
    [SPY_NULL_VOTE]: (state, action) =>
      produce(state, (draft) => {
        draft.isSpyNull = !action.payload.vote;
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
