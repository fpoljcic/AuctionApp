import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { validToken } from './Common';

// handle the private routes
const PrivateRoute = ({ component: Component, path: Path, ...rest }) => {
    return (
        <Route
            path={Path}
            render={() => validToken() ? <Component {...rest} /> : <Redirect push to="/login" />}
        />
    )
}

export default PrivateRoute;
