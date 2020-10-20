import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import './App.css';

import Header from 'shared/Header';
import MyBreadcrumb from 'shared/MyBreadcrumb';
import MyAlert from 'shared/MyAlert';
import MyRoutes from 'routing/MyRoutes';
import Footer from 'shared/Footer';

const App = () => {
  return (
    <div className="app-container purple-theme">
      <Router>
        <Header />
        <MyBreadcrumb />
        <MyAlert />
        <div className="route-container">
          <MyRoutes />
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
