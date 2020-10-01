import LandingPage from 'components/LandingPage';
import React from 'react';
import { Route } from 'react-router-dom';
import { validToken } from './Common';

// handle the public routes
const GuestRoute = ({ component: Component, path: Path, ...rest }) => {

  const loggedIn = validToken();

  return (
    <Route
      path={loggedIn ? "/" : Path}
      render={() => !loggedIn ? <Component {...rest} /> : <LandingPage {...rest} />}
    />
  )
}

export default GuestRoute;
