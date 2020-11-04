import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'rc-slider/assets/index.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'moment-duration-format';
import App from './App';
import { AppProvider } from 'AppContext';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import enGB from 'date-fns/locale/en-GB';
import * as serviceWorker from './serviceWorker';

import './index.css';

registerLocale('en-GB', enGB);
setDefaultLocale('en-GB');

ReactDOM.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
