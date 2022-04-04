import {
  BrowserRouter as Router,
  Routes,
  Route,
  Switch,
} from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { history } from '../redux/configureStore';
import { useMediaQuery } from 'react-responsive';

import Main from '../pages/Main';
import LoginTitle from '../pages/LoginTitle';

import MakingRoom from '../pages/MakingRoom';
import Result from '../pages/Result';
import Ingame from '../pages/Ingame';
import NotFound from '../pages/NotFound';
import Mobile from '../pages/Mobile';

function App() {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1040px)' });

  return isTabletOrMobile ? (
    <>
      <Mobile></Mobile>
    </>
  ) : (
    <>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/lobby" exact component={Main}></Route>
          <Route path="/" exact component={LoginTitle}></Route>
          <Route path="/makingroom" exact component={MakingRoom}></Route>
          <Route path="/result/:roomId" exact component={Result}></Route>
          <Route path="/room/:roomId" exact component={Ingame}></Route>
          <Route exact component={NotFound} />
        </Switch>
      </ConnectedRouter>
    </>
  );
}

export default App;
