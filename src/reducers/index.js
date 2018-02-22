import { createReducer } from 'redux-create-reducer';

import * as actions from '../constants/actions';

import initialState from '../initialState';

import * as app from './app.reducer';

function createReducerObject(array) {
    return array.reduce((handlers, [type, handler]) => ({
        ...handlers,
        [type]: (state, action) => handler(state, action)
    }), {});
}

export default createReducer(initialState, createReducerObject([
    [actions.TILE_REQUESTED, app.onTileRequested],
    [actions.TILE_LOADED, app.onTileLoaded]
]));

