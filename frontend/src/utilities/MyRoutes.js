import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import LandingPage from 'components/LandingPage';
import Shop from 'components/Shop';
import Login from 'components/Login';
import Register from 'components/Register';
import MyAccount from 'components/MyAccount';
import PageNotFound from 'components/PageNotFound';

const UserRoutes = (props) => {
    return (
        <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/shop" component={Shop} />
            <Route path="/login" component={Login} />
            <Route path="/register" render={() => <Register {...props} />} />
            <PrivateRoute path="/my_account" component={MyAccount} />
            <Route component={PageNotFound} />
        </Switch>
    );
}

export default UserRoutes;