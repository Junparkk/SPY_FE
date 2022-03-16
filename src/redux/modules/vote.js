import { createAction, handleActions } from 'redux-actions';
import { immerable, produce } from 'immer';

import axios from 'axios';
import { apis } from '../../shared/apis';

// post
const SET_USERS = 'SET_USERS';
const VOTE_CHECK = 'VOTE_CHECK';

const setUsers = createAction(SET_USERS, (users_list) => ({ users_list }));

const voteCheck = createAction(VOTE_CHECK, (check_state) => ({ check_state }));

const initialState = {
  userList: [],
  dayTimeVoteModalState: {
    roomId: null,
    privateState: false,
  },
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

export default handleActions(
  {
    [SET_USERS]: (state, action) =>
      produce(state, (draft) => {
        draft.userList = action.payload.users_list;
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
};

export { actionCreators };
