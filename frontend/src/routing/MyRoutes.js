import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from 'routing/PrivateRoute';
import GuestRoute from 'routing/GuestRoute';

import LandingPage from 'pages/LandingPage';
import AllCategories from 'pages/AllCategories';
import Shop from 'pages/Shop';
import ItemPage from 'pages/ItemPage';
import About from 'pages/About';
import Login from 'pages/Login';
import Register from 'pages/Register';
import ForgotPassword from 'pages/ForgotPassword';
import ResetPassword from 'pages/ResetPassword';
import Sell from 'pages/Sell';
import MyAccount from 'pages/MyAccount';
import PageNotFound from 'pages/PageNotFound';

const MyRoutes = () => {
    return (
        <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/all" component={AllCategories} />
            <Route path="/shop/*/*/:id" component={ItemPage} />
            <Route path="/shop*" component={Shop} />
            <Route path="/about" component={About} />
            <GuestRoute path="/login" component={Login} />
            <GuestRoute path="/register" component={Register} />
            <GuestRoute path="/forgot_password" component={ForgotPassword} />
            <GuestRoute path="/reset_password" component={ResetPassword} />
            <PrivateRoute path="/my_account/seller/sell" component={Sell} />
            <PrivateRoute path="/my_account" component={MyAccount} />
            <Route component={PageNotFound} />
        </Switch>
    );
}

export default MyRoutes;
