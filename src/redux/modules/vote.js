import { createAction, handleActions } from 'redux-actions';
import { immerable, produce } from 'immer';

import axios from 'axios';
import { apis } from '../../shared/apis';

// post
const SET_USERS = 'SET_USERS';

const setUsers = createAction(SET_USERS, (users_list) => ({ users_list }));

const initialState = {
  userList: [],
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

export default handleActions(
  {
    [SET_USERS]: (state, action) =>
      produce(state, (draft) => {
        draft.userList = action.payload.users_list;
      }),
  },
  initialState
);

const actionCreators = {
  getUserDB,
};

export { actionCreators };
