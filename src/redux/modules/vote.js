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
        // const status = res.data.result === 0 ? 'voteNightLawyer' : 'winner';
        // const msg = res.data.msg;
        // console.log(`@@@ 받은 결과 값 ${res.data}`);

        // setTimeout(() => {
        //   socket.emit('getMsg', { roomId, msg });
        //   socket.emit('getStatus', { roomId, status });
        // }, 1500);
        if (res.data.result === 0) {
          console.log('낮투표 결과 확인 @@@@@@@@@@@@@@@', res.data.msg);
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
          console.log(
            '@@@@ resultDayTimeVoteAPI 요청 응답이 0일 경우 emit 상태(voteNightLawyer) 받음',
            res
          );
        } else {
          console.log(
            '@@@@ resultDayTimeVoteAPI 요청 응답이 1, 2일 경우 바로 결과 화면',
            res
          );
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
    console.log(roomId, userId, '변호사');
    await apis
      .lawyerAct(roomId, userId)
      .then(function (res) {
        toast.success('---변호사 답변---' + res.data.msg, {
          draggable: false,
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
          pauseOnFocusLoss: false,
          pauseOnHover: false,
        });
        console.log('@@@@ lawyerActDB 요청 답변 받음');
        console.log(res.data);
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
    console.log(userId, '탐정 리듀서');
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
    console.log(userId, '스파이 리듀서');
    await apis
      .spyAct(roomId, userId)
      .then(function (res) {
        console.log('@@@@ spyActDB api 요청 후 답변 받음');
        console.log(res.data.msg);
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
        console.log('스파이 캐치로 빠질경우 emit 상태 업데이트', err)
      );
  };
};

//룰 부여
const divisionRole = (roomId) => {
  return async function (dispatch, useState, { history }) {
    await apis
      .role(roomId)
      .then((res) => {
        console.log('@@@@ divisionRole 요청 후 답변 받음');
        console.log('api 요청 후 DB 삽입됨', res, Date().toString());
        dispatch(giveUsers(res.data.users));
        socket.emit('getStatus', { roomId: roomId, status: 'showRole' });
      })
      .catch((err) => console.log('@@@@ divisionRole catch문으로 빠짐)', err));
  };
};

// 아무 입력 없으면 자동으로 무효표 처리
const invalidVote = (roomId, roundNo, userId) => {
  return async function (dispatch, useState, { history }) {
    await apis
      .sendInvalidVote(roomId, roundNo, userId)
      .then(function (res) {
        socket.emit('getStatus', { roomId: roomId, status: 'showResultDay' });
        console.log('@@@@ invalidVote api 요청 받음', res);
      })
      .catch((err) => console.log('@@@@ invalidVote catch문으로 빠짐)', err));
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
const voteResult = (roomId, userId) => {
  return async function (dispatch, useState, { history }) {
    await apis
      .gameResult(roomId, userId)
      .then((res) => {
        console.log('@@@@ voteResult api 요청 받음', res.data.result);
        if (res.data.result === 0) {
          setTimeout(() => {
            socket.emit('getStatus', { roomId: roomId, status: 'dayTime' });
          }, 500);
          console.log(res);
          console.log('@@@@ voteResult api 요청 값 0일때');

          console.log('@@@@ voteResult api 요청 값 0일때 emit(dayTime) 함');
        } else if (res.data.result === 1) {
          console.log('@@@@ voteResult api 요청 값 1일때 결과페이지');
          history.replace(`/result/${roomId}`);
        } else if (res.data.result === 2) {
          console.log('@@@@ voteResult api 요청 값 2일때 결과페이지');
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
        draft.isLawyerNull = action.payload.vote;
        console.log(action.payload.vote, '@@@@@@ 변호사 핸들러');
      }),
    [SPY_NULL_VOTE]: (state, action) =>
      produce(state, (draft) => {
        draft.isSpyNull = action.payload.vote;
        console.log(action.payload.vote);
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
