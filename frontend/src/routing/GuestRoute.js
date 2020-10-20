import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { homeUrl } from 'utilities/appUrls';
import { validToken } from 'utilities/common';

// handle the public routes
const GuestRoute = ({ component: Component, path: Path, ...rest }) => {
  return (
    <Route
      path={Path}
      render={() => !validToken() ? <Component {...rest} /> : <Redirect to={homeUrl} />}
    />
  )
}

export default GuestRoute;
