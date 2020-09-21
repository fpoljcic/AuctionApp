import PageNotFound from 'components/PageNotFound';
import React from 'react';
import { Route } from 'react-router-dom';
import { validToken } from './Common';

// handle the public routes
const GuestRoute = ({ component: Component, path: Path, ...rest }) => {
  return (
    <Route
      path={Path}
      render={() => !validToken() ? <Component {...rest} /> : <PageNotFound />}
    />
  )
}

export default GuestRoute;