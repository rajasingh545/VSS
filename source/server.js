import 'babel-polyfill';
import 'isomorphic-fetch';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';

import configureStore from 'config/store';
import App from 'pages/App';

// Load CSS
// import 'index.css';
// import "bootstrap/css/bootstrap.min.css";
// import 'bootstrap/dist/css/bootstrap.min.css';
import "style.css";
import "alerts.css";
import "cal.css";
import 'rc-time.css';
import 'react-table.css';

// import "menu.css";

const store = configureStore();

// When used with server dehydrated state "ReactDOM.hydrate" should be called
const renderMethod = process.env.HYDRATE ? ReactDOM.hydrate : ReactDOM.render;

renderMethod(
  <AppContainer>
    <Provider store={ store }>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </AppContainer>,
  document.getElementById('root')
);
