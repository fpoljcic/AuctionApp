import React, { useState } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { Alert, Breadcrumb } from 'react-bootstrap';
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
    let errorMessage;
    if (error.response === undefined)
      errorMessage = error.message;
    else if (error.response.data.errors !== undefined && error.response.data.errors.length !== 0)
      errorMessage = error.response.data.errors[0].defaultMessage;
    else
      errorMessage = error.response.data.message;
    showMessage("warning", errorMessage);
    return Promise.reject(error);
  }

  axios.interceptors.response.use((response) => response, handleError);

  const showMessage = (variant, message) => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
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
    <div className="app-container">
      <Router>
        <Header loggedInState={loggedInState} />
        <Breadcrumb style={breadcrumbTitle === null ? { display: 'none' } : null}>
          <div className="breadcrumb-title">
            {breadcrumbTitle}
          </div>
          {breadcrumbItems.map((item, i, { length }) => (
            <Breadcrumb.Item active key={item.text}>
              {length - 1 === i ? (
                <div style={{ color: '#252525' }}>
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
