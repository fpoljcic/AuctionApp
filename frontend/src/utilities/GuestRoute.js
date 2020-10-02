import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { validToken } from './Common';

// handle the public routes
const GuestRoute = ({ component: Component, path: Path, ...rest }) => {
  return (
    <Route
      path={Path}
      render={() => !validToken() ? <Component {...rest} /> : <Redirect to="/" />}
    />
  )
}

export default GuestRoute;
