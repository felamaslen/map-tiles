import { createReducer } from 'redux-create-reducer';

import * as AC from '../constants/actions';

import initialState from '../initialState';

function createReducerObject(array) {
    return array.reduce((obj, [type, handler]) => {
        obj[type] = (state, action) => handler(state, action.payload);

        return obj;
    }, {});
}

export default createReducer(initialState, createReducerObject([
]));

