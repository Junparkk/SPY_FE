import axios from 'axios';

const api = axios.create({
  baseURL: 'http://mafia.milagros.shop/api',
  headers: {
    'content-type': 'application/json;charset=UTF-8',
    accept: 'application/json,',
  },
});

export const apis = {
  // room
  lobby: () => api.get('/lobby'),
  player: (roomId) => api.get(`/room/${roomId}/users`),
  ready: (roomId, userId) => api.patch(`/room/${roomId}/user/${userId}/ready`),
  cancelReady: (roomId, userId) =>
    api.patch(`/room/${roomId}/user/${userId}/cancelReady`),
  start: (roomId, userId) => api.patch(`/room/${roomId}/user/${userId}/start`),
  // post: (postId) => api.get(`/api/posts/${postId}`),
  // add: (title, price, imgurl, content) =>
  //   api.post('/api/posts', title, price, imgurl, content),
  // image: (file) => api.post('/api/image', file),
  // edit: (postId, title, price, imgurl, content) =>
  //   api.put(`/api/posts`, postId, title, price, imgurl, content),
  // del: (postId) => api.delete(`/api/posts`, postId),
  // changeStatus: (postId) => api.patch(`/api/status`, postId),

  //vote
  lawyerAct: (roomId, roundNo, userId) => api.patch(`/room/${roomId}/lawyerAct`,roundNo, userId),
  detectiveAct: (roomId) => api.get(`/room/${roomId}detectiveAct`),
  spyAct: (roomId) => api.patch(`/room/${roomId}/spyAct`),
  dayTimeVote: (roomId, userId, round, chosenId) =>
    api.patch(`/room/${roomId}/voter/${userId}/vote`, round, chosenId),
  dayTimeVoteResult: (roomId) => api.get(`/room/${roomId}/voteResult`),
  getGameRoundNo: (roomId) => api.get(`/room/${roomId}/roundNo`),

  //AI 플레이어 생성
  makeAiPlayer: (roomId) => api.put(`room/${roomId}/ai`),
};
