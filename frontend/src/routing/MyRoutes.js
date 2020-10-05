import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from 'routing/PrivateRoute';
import GuestRoute from 'routing/GuestRoute';

import LandingPage from 'pages/LandingPage';
import AllCategories from 'pages/AllCategories';
import Shop from 'pages/Shop';
import ItemPage from 'pages/ItemPage';
import Login from 'pages/Login';
import Register from 'pages/Register';
import MyAccount from 'pages/MyAccount';
import PageNotFound from 'pages/PageNotFound';

const MyRoutes = (props) => {
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

export default MyRoutes;
