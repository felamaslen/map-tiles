/**
 * Entry point to the web app
 */

/* eslint-disable global-require */

import 'babel-polyfill';

import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';

import store from './store';
import Root from './containers/Root';

import './sass/index.scss';
import './sass/fonts.scss';
import './images/favicon.png';

function renderApp(RootComponent = Root) {
    render(
        <AppContainer>
            <RootComponent store={store} />
        </AppContainer>,
        document.getElementById('root')
    );
}

renderApp();

if (module.hot) {
    module.hot.accept(
        './containers/Root',
        () => renderApp(require('./containers/Root').default)
    );
}

