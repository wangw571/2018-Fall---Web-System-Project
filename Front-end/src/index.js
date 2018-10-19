import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

import { App } from './containers';
import './styles/index.scss';

ReactDOM.render(
  <BrowserRouter basename={process.env.public_url}>
      <App />
  </BrowserRouter>,
  document.getElementById('root')
);
serviceWorker.register();
