import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Login from '../pages/Login';
import Home from '../pages/Home';
import Layout from './Header-Footer/Layout';

let App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Switch>
          <Route exact path='/poderosas/admin/login'>
            <Login />
          </Route>
          <Route exact path='/poderosas/admin/home'>
            <Home />
          </Route>
          <Redirect from='*' to='/poderosas/admin/login' />
        </Switch>
      </Layout>
    </BrowserRouter>
  );
}
export default App;

