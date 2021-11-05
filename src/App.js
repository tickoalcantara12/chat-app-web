import './App.css';
import  React  from 'react'
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Home from "./components/Home"
import ListRoom from "./components/ListRoom"
import RoomChat from "./components/RoomChat"

function App() {

  return (
      <Router>
          <div>
              <Switch>
                  <Route exact path='/' component={Home} />
                  <Route path='/list-room' component={ListRoom} />
                  <Route path='/room-chat' component={RoomChat} />
              </Switch>
          </div>
      </Router>

  );
}

export default App;
