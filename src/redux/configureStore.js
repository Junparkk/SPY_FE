import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { connectRouter } from 'connected-react-router';

import Room from './modules/room';
import User from './modules/user';
import Vote from './modules/vote';

// 1. 히스토리 객체 생성
export const history = createBrowserHistory();

const rootReducer = combineReducers({
  room: Room,
  user: User,
  vote: Vote,
  //   post: Post,
  // 2. 리덕스에 넣어준다.
  router: connectRouter(history),
});

//미들웨어 준비
const middlewares = [thunk.withExtraArgument({ history: history })];

// 지금이 어느 환경인 지 알려줘요. (개발환경, 프로덕션(배포)환경 ...)
const env = process.env.NODE_ENV;

// 개발환경에서는 로거라는 걸 하나만 더 써볼게요.
if (env === 'development') {
  // 개발환경일 때 패키지한테서 로거를 가지고 온다.(require를 사용해서)
  const { logger } = require('redux-logger');
  middlewares.push(logger);
}

// 리덕스 데브툴즈 사용설정
//redux devTools 설정
const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

// 지금까지 위에 있던 미들웨어들을 묶어준다.
const enhancer = composeEnhancers(applyMiddleware(...middlewares));

//스토어 만들기
let store = (initialStore) => createStore(rootReducer, enhancer);

export default store();
