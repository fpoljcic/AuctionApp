import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import './App.css';

import Header from 'components/Header';
import Footer from 'components/Footer';
import MyRoutes from 'utilities/MyRoutes';

const App = () => {
  return (
    <div className="app-container">
      <Router>
        <Header />
        <MyRoutes />
        <Footer />
      </Router>
    </div>
  );
}

export default App;
