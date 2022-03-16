import { createAction, handleActions } from 'redux-actions';
import { produce } from 'immer';

// import axios from 'axios';
import { apis } from '../../shared/apis';

// post
const SET_USERS = 'SET_USERS';
// const SEND_VOTE = 'SEND_VOTE';
const ROLE_GIVE = 'ROLE_GIVE';
const VOTE_CHECK = 'VOTE_CHECK';

const setUsers = createAction(SET_USERS, (users_list) => ({ users_list }));
// const answerUsers = createAction(SEND_VOTE, (userId) => ({ userId }));
const giveUsers = createAction(ROLE_GIVE, (users) => ({ users }));

const voteCheck = createAction(VOTE_CHECK, (check_state) => ({ check_state }));

const initialState = {
  userList: [],
  dayTimeVoteModalState: {
    roomId: null,
    privateState: false,
  },
  userId: [],
  users: [],
  voteCheck: false,
};

//middleware

//전체 방 조회
const getUserDB = (roomId) => {
  return async function (dispatch, useState, { history }) {
    await apis.player(roomId).then(function (res) {
      console.log(res.data.users);
      dispatch(setUsers(res.data.users));
    });
  };
};
//낮시간 투표 선택인원 보내기
const sendDayTimeVoteAPI = (chosenRoomId, userId, round, chosenId) => {
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
const resultDayTimeVoteAPI = (roomId) => {
  return async function (dispatch, useState, { history }) {
    await apis.dayTimeVoteResult(roomId).then(function (res) {
      console.log(res.data.users);
    });
  };
};

//변호사 투표
const lawyerActDB = (roomId, userId) => {
  return async function (dispatch, useState, { history }) {
    console.log(roomId, userId, '변호사');
    await apis
      .lawyerAct(
        roomId,
        userId
        // roundNo: roundNo,
      )
      .then(function (res) {
        console.log(res.data);
        window.alert(res.data.msg);
      })
      .catch((err) => {
        console.log(err);
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
      .spyAct(
        roomId,
        userId
        // roundNo: roundNo,
      )
      .then(function (res) {
        console.log(res.data);
        window.alert(res.data.msg);
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

//룰 부여
const divisionRole = (roomId) => {
  return async function (dispatch, useState, { history }) {
    await apis
      .role(roomId)
      .then(function (res) {
        window.alert(res.data.msg);
        dispatch(giveUsers(res.data.users));
        console.log(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
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
    [VOTE_CHECK]: (state, action) =>
      produce(state, (draft) => {
        draft.voteCheck = action.payload.check_state;
      }),
  },
  initialState
);

const actionCreators = {
  getUserDB,
  voteCheck,
  sendDayTimeVoteAPI,
  resultDayTimeVoteAPI,
  lawyerActDB,
  detectiveActDB,
  spyActDB,
  divisionRole,
};

export { actionCreators };
