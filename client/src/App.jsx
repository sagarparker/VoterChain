import {Route,Switch,Redirect} from 'react-router-dom';
import LandingPage from './LandingPage/LandinPage';
import VotingPage from './votingPage/VotingPage';

function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/votingPage">
          <VotingPage/>
        </Route>
        <Route exact path="/home">
          <LandingPage/>
        </Route>
        <Redirect to="/home"/>
      </Switch>
    </div>
  );
}

export default App;
