import React from 'react';
import {BrowserRouter,  Route,  Switch} from 'react-router-dom';

import Welcome from '././components/Welcome/Welcome';
import Home from '././components/Home/Home';
import Login from '././components/Login/Login';
import Signup from '././components/Signup/Signup';
import Update from '././components/Update/Update';
import ForgotPassword from '././components/ForgotPassword/ForgotPassword';
import VerifyOtp from '././components/VerifyOtp/VerifyOtp';
import UpdatePassword from '././components/UpdatePassword/UpdatePassword';
import UpdateEmail from '././components/UpdateEmail/UpdateEmail';
import Favorites from '././components/Favorites/Favorites';
import NotFound from '././components/NotFound/NotFound';

const Routes = () => (
  <BrowserRouter >
      <Switch>
          <Route exact path="/" component={Welcome}/>
          <Route path="/home" component={Home}/>
          <Route path="/login" component={Login}/>
          <Route path="/Signup" component={Signup}/>
          <Route path="/update" component={Update}/>
          <Route path="/forgotPassword" component={ForgotPassword}/>
          <Route path="/verifyOtp" component={VerifyOtp}/>
          <Route path="/updatePassword" component={UpdatePassword}/>
          <Route path="/updateEmail" component={UpdateEmail}/>
          <Route path="/favorites" component={Favorites}/>




          <Route path="*" component={NotFound}/>
      </Switch>
  </BrowserRouter>
);

export default Routes;