import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import GuestRoute from './GuestRoute';

import LandingPage from 'components/LandingPage';
import AllCategories from 'components/AllCategories';
import Shop from 'components/Shop';
import ItemPage from 'components/ItemPage';
import Login from 'components/Login';
import Register from 'components/Register';
import MyAccount from 'components/MyAccount';
import PageNotFound from 'components/PageNotFound';

const UserRoutes = (props) => {
    return (
        <Switch>
            <Route exact path="/" render={() => <LandingPage {...props} />} />
            <Route path="/all" render={() => <AllCategories {...props} />} />
            <Route path="/shop/*/*/:id" render={() => <ItemPage {...props} />} />
            <Route path="/shop*" render={() => <Shop {...props} />} />
            <GuestRoute path="/login" {...props} component={Login} />
            <GuestRoute path="/register" {...props} component={Register} />
            <PrivateRoute path="/my_account" {...props} component={MyAccount} />
            <Route component={PageNotFound} />
        </Switch>
    );
}

export default UserRoutes;
