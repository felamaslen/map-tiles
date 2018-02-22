import { fork, take, put } from 'redux-saga/effects';
import * as actions from '../constants/actions';
import { tileRequested } from '../actions/app.actions';

export function *startLoadingMap() {
    yield take(actions.APP_LOADED);

    yield put(tileRequested());

    while (true) {
        yield take(actions.TILE_LOADED);

        yield put(tileRequested());
    }
}

export default function *rootSaga() {
    yield fork(startLoadingMap);
}

