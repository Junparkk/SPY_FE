import {
  BrowserRouter as Router,
  Routes,
  Route,
  Switch,
} from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { history } from '../redux/configureStore';

import Main from '../pages/Main';
import LoginTitle from '../pages/LoginTitle';
import SignUp from '../pages/SignUp';
// import Header from '../components/Header';
import MakingRoom from '../pages/MakingRoom';
import Result from '../pages/Result';
import Ingame from '../pages/Ingame';
import Tutorial from '../pages/Tutorial';
import NotFound from '../pages/NotFound';
import ResultModal from '../components/ResultModal';
import Slider from '../components/Slider/Slider';
function App() {
  return (
    <>
      {/* <Header /> */}
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/test" exact component={Slider}></Route>

          <Route path="/lobby" exact component={Main}></Route>
          <Route path="/" exact component={LoginTitle}></Route>
          <Route path="/signup" exact component={SignUp}></Route>
          <Route path="/makingroom" exact component={MakingRoom}></Route>
          <Route path="/result/:roomId" exact component={Result}></Route>
          <Route path="/room/:roomId" exact component={Ingame}></Route>
          <Route path="/tutorial" exact component={Tutorial}></Route>
          <Route exact component={NotFound} />
        </Switch>
      </ConnectedRouter>
    </>
  );
}

export default App;
