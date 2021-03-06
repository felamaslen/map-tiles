/* eslint-disable global-require */

import initialState from '../initialState';

let configStore = null;

if (process.env.NODE_ENV === 'development') {
    configStore = require('./configureStore.dev').default;
}
else {
    configStore = require('./configureStore.prod').default;
}

const store = configStore(initialState);

export default store;

