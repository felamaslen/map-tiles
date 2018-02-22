import * as actions from '../constants/actions';

export const appLoaded = () => ({ type: actions.APP_LOADED });

export const tileRequested = () => ({ type: actions.TILE_REQUESTED });

export const tileLoaded = id => ({ type: actions.TILE_LOADED, id });

