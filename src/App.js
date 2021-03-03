import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from './components/PrivateRoute';
import PageConnexion from './components/LandingPage/PageConnexion.js';
import ForgotPassword from './components/LandingPage/ForgotPassword';
import Nav from './components/Navigation/Nav';
import Profile from './components/Profile/Profile';
import VisitingProfile from './components/VisitingProfile/VisitingProfile';
import Dashboard from './components/Dashboard/Dashboard';
global.jQuery = require('jquery');
require('bootstrap');

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <PrivateRoute path='/visitingProfile' component={VisitingProfile} />
          <PrivateRoute path='/dashboard' component={Dashboard} />
          <PrivateRoute exact path='/' component={Profile} />
          <Route path='/login-signup' component={PageConnexion} />
          <Route path='/forgot-password' component={ForgotPassword} />
          <PrivateRoute path='/Nav' component={Nav} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
