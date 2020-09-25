import React, { useState } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { Alert, Breadcrumb } from 'react-bootstrap';

import './App.css';

import Header from 'components/Header';
import Footer from 'components/Footer';
import MyRoutes from 'utilities/MyRoutes';

const App = () => {

  const [loggedInState, setLoggedInState] = useState(null);

  const [alertVisible, setAlertVisible] = useState(false);
  const [variant, setVariant] = useState(null);
  const [message, setMessage] = useState(null);

  const [breadcrumbItems, setBreadcrumbItems] = useState([]);
  const [breadcrumbTitle, setBreadcrumbTitle] = useState(null);

  const showMessage = (variant, message) => {
    setMessage(message);
    setVariant(variant);
    setAlertVisible(true);
  }

  const setBreadcrumb = (title, items) => {
    setBreadcrumbTitle(title);
    setBreadcrumbItems(items);
  }

  const removeBreadcrumb = () => {
    setBreadcrumbTitle(null);
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
        <Alert transition={false} show={alertVisible} variant={variant}>
          {message}
        </Alert>
        <div className="route-container">
          <MyRoutes changeLoggedInState={changeLoggedInState} setBreadcrumb={setBreadcrumb} showMessage={showMessage} removeBreadcrumb={removeBreadcrumb} />
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
