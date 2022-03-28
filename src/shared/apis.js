import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mafia.milagros.shop/api',
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
  checkStart: (roomId, userId) => api.get(`/room/${roomId}/user/${userId}/msg`),
  start: (roomId) => api.patch(`/room/${roomId}/start`),
  changeMaxPlayer: (roomId, changeMaxLength) =>
    api.patch(`/room/${roomId}/changeMaxPlayer`, changeMaxLength),
  getRole: (roomId) => api.patch(`/room/${roomId}/role`),
  startCheck: (roomId) => api.get(`/room/${roomId}/isStart`),
  statusCheck: (roomId) => api.get(`/room/${roomId}/status_1`),
  statusCheck2: (roomId, userId) =>
    api.get(`/room/${roomId}/user/${userId}/status`),
  // post: (postId) => api.get(`/api/posts/${postId}`),
  // add: (title, price, imgurl, content) =>
  //   api.post('/api/posts', title, price, imgurl, content),
  // image: (file) => api.post('/api/image', file),
  // edit: (postId, title, price, imgurl, content) =>
  //   api.put(`/api/posts`, postId, title, price, imgurl, content),
  // del: (postId) => api.delete(`/api/posts`, postId),
  // changeStatus: (postId) => api.patch(`/api/status`, postId),

  //vote
  lawyerAct: (roomId, userId) =>
    api.patch(`/room/${roomId}/lawyerAct`, { userId: userId }),
  aiVote: (roomId, roundNo) =>
    api.put(`/room/${roomId}/roundNo/${roundNo}/aiVote`),

  detectiveAct: (roomId, userId) =>
    api.get(`/room/${roomId}/detectiveAct/${userId}`),

  spyAct: (roomId, userId) =>
    api.patch(`/room/${roomId}/spyAct`, { userId: userId }),

  dayTimeVote: (roomId, userId, round, chosenId) =>
    api.patch(`/room/${roomId}/voter/${userId}/vote`, round, chosenId),
  dayTimeVoteResult: (roomId, roundNo) =>
    api.get(`/room/${roomId}/round/${roundNo}`),
  getGameRoundNo: (roomId) => api.get(`/room/${roomId}/roundNo`),
  sendInvalidVote: (roomId, roundNo, userId) =>
    api.put(`/room/${roomId}/round/${roundNo}/user/${userId}/invalidAndAiVote`),

  isVote: (roomId) => api.get(`/room/${roomId}/isZeroVote`),

  //AI 플레이어 생성
  makeAiPlayer: (roomId) => api.put(`room/${roomId}/ai`),

  // role 부여 1-시민/2-의사/3-경찰/4-스파이
  role: (roomId) => api.patch(`/room/${roomId}/role`),
  gameResult: (roomId) => api.get(`/room/${roomId}/result`),
  aiLawyerAct: (roomId) => api.patch(`/room/${roomId}/aiLawyerAct`),
  aiSpyAct: (roomId) => api.patch(`/room/${roomId}/aiSpyAct`),
  finalResult: (roomId) => api.get(`/room/${roomId}/winner`),
};
