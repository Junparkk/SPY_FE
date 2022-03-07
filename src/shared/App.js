import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { history } from '../redux/configureStore';

import Main from '../pages/Main';
import LoginTitle from '../pages/LoginTitle';
import SignUp from '../pages/SignUp';
import Header from '../components/Header';
import MakingRoom from '../pages/MakingRoom';
import Result from '../pages/Result';

function App() {
  return (
    <>
      <Header />
      <ConnectedRouter history={history}>
        <Route path="/" exact component={Main}></Route>
        <Route path="/login" exact component={LoginTitle}></Route>
        <Route path="/signup" exact component={SignUp}></Route>
        <Route path="/makingroom" exact component={MakingRoom}></Route>
        <Route path="/result" exact component={Result}></Route>
      </ConnectedRouter>
    </>
  );
}

export default App;
