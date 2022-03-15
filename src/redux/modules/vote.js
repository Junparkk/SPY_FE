import { createAction, handleActions } from 'redux-actions';
import { immerable, produce } from 'immer';

import axios from 'axios';
import { apis } from '../../shared/apis';

// post
const SET_USERS = 'SET_USERS';
const SEND_VOTE = 'SEND_VOTE';

const setUsers = createAction(SET_USERS, (users_list) => ({ users_list }));
const voteUsers = createAction(SEND_VOTE, (userId, roomId) => ({
  userId,
  roomId,
}));

const initialState = {
  userList: [],
  dayTimeVoteModalState: {
    roomId: null,
    privateState: false,
  },
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

//병우추가 변호사가 누굴 찍었는지
const lawyerActDB = (roomId, roundNo, userId ) => {
  return async function (dispatch, useState, { history }) {
    await apis.lawyerAct( roomId,{
      roundNo: roundNo, 
      userId: userId
    }).then(function (res) {
      console.log(res.data.users);
    //   // window.alert(res.data);
    //   // dispatch(voteUsers(res.data.users));
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
    //     draft.userList = action.payload.users_list;
    //   }),
  },
  initialState
);

const actionCreators = {
  getUserDB,
  sendDayTimeVoteAPI,
  resultDayTimeVoteAPI,
  lawyerActDB,
};

export { actionCreators };
