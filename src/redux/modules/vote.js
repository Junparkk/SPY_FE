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

const initialState = {
  userList: [],
  dayTimeVoteModalState: {
    roomId: null,
    privateState: false,
  },
  userId: [],
  users: [],
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
const resultDayTimeVoteAPI = (roomId, roundNo) => {
  return async function (dispatch, useState, { history }) {
    console.log('이건 apis 밖------------------------');
    await apis
      .dayTimeVoteResult(roomId, roundNo)
      .then(function (res) {
        console.log('이건 apis 안------------------------');
        window.alert(res.data.result);
        console.log(res);
      })
      .catch((err) => console.log(err));
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
        dispatch(giveUsers(res.data.users));
        //롤 보여주는 모달 호출해줘야함!!!!!
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

// 아무 입력 없으면 자동으로 무효표 처리
const invalidVote = (roomId, roundNo) => {
  return async function (dispatch, useState, { history }) {
    await apis
      .sendInvalidVote(roomId, roundNo)
      .then(function (res) {
        console.log(res);
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
};

export { actionCreators };
