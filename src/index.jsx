import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { reducers } from './reducers';

import React from 'react';
import { App } from './containers/app';


let createLogger = require('redux-logger');

export const state = applyMiddleware(createLogger())(createStore)(reducers);
ReactDOM.render(<App state={state}/>, document.getElementById('appContainer'));

