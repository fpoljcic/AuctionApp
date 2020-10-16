import React, { useState } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { Alert, Breadcrumb } from 'react-bootstrap';
import { scrollToTop } from 'utilities/common';
import axios from 'axios';

import './App.css';

import Header from 'components/Header';
import Footer from 'components/Footer';
import MyRoutes from 'routing/MyRoutes';

const App = () => {

  const [loggedInState, setLoggedInState] = useState(null);

  const [alertVisible, setAlertVisible] = useState(false);
  const [variant, setVariant] = useState(null);
  const [message, setMessage] = useState(null);

  const [breadcrumbItems, setBreadcrumbItems] = useState([]);
  const [breadcrumbTitle, setBreadcrumbTitle] = useState(null);

  let keepFlag = false;

  const handleError = (error) => {
    showMessage("warning", error.response !== undefined ? error.response.data.message : error.message);
    return Promise.reject(error);
  }

  axios.interceptors.response.use((response) => response, handleError);

  const showMessage = (variant, message) => {
    scrollToTop();
    setVariant(variant);
    setMessage(message);
    setAlertVisible(true);
    keepFlag = true;
  }

  // Remove alert after switching page
  const removeAlert = () => {
    if (keepFlag === true) {
      keepFlag = false;
    } else {
      setAlertVisible(false);
    }
  }

  const setBreadcrumb = (title, items) => {
    setBreadcrumbTitle(title);
    setBreadcrumbItems(items);
    removeAlert();
  }

  const removeBreadcrumb = () => {
    setBreadcrumbTitle(null);
    removeAlert();
  }

  const changeLoggedInState = () => {
    if (loggedInState === null) {
      setLoggedInState(false);
      return;
    }
    setLoggedInState(!loggedInState);
  }

  return (
    <div className="app-container purple-theme">
      <Router>
        <Header loggedInState={loggedInState} />
        <Breadcrumb style={breadcrumbTitle === null ? { display: 'none' } : null}>
          <div className="breadcrumb-title">
            {breadcrumbTitle}
          </div>
          {breadcrumbItems.map((item, i, { length }) => (
            <Breadcrumb.Item active key={item.text}>
              {length - 1 === i ? (
                <div style={{ color: 'var(--text-primary)' }}>
                  {item.text}
                </div>
              ) : (
                  <Link className="black-nav-link" to={item.href}>
                    {item.text}
                  </Link>
                )}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
        <div style={alertVisible && breadcrumbTitle === null ? { marginTop: 40, marginBottom: '-1rem' } : null}>
          <Alert dismissible onClose={() => setAlertVisible(false)} transition={false} show={alertVisible} variant={variant}>
            {message}
          </Alert>
        </div>
        <div className="route-container">
          <MyRoutes changeLoggedInState={changeLoggedInState} setBreadcrumb={setBreadcrumb} showMessage={showMessage} removeBreadcrumb={removeBreadcrumb} />
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
