import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Header from 'components/Header';
import Footer from 'components/Footer';
import LandingPage from 'components/LandingPage';

const App = () => {
  return (
    <div className="app-container">
      <Router>
        <Header />
        <LandingPage />
        <Footer />
      </Router>
    </div>
  );
}

export default App;
