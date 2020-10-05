import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { loginUrl } from 'utilities/appUrls';
import { validToken } from 'utilities/localStorage';

// handle the private routes
const PrivateRoute = ({ component: Component, path: Path, ...rest }) => {
    return (
        <Route
            path={Path}
            render={() => validToken() ? <Component {...rest} /> : <Redirect push to={loginUrl} />}
        />
    )
}

export default PrivateRoute;
