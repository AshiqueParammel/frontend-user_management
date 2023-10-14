import React from 'react';
import { Routes,Route} from 'react-router-dom';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import Admin from './Components/Admin/Admin';
import { CrossChecks } from './Helpers/CrossChecks';
import Profile from './Components/Profile/Profile';



function App() {
  return (
    <div>
      <Routes>
        <Route Component={Register} path="/signup"/>
        <Route Component={Login} path="/login"/>
        <Route Component={CrossChecks} path="/"/>
        <Route Component={Admin} path="/admin"/>
        <Route Component={Profile} path="/profile"/>
      </Routes>  
    </div>
  );
}

export default App;
