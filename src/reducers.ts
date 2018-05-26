import { combineReducers } from 'redux';
import { reducer as nowPlayingReducer } from './nowPlaying';
import { reducer as routerReducer } from './router';

export default combineReducers({
  nowPlaying: nowPlayingReducer,
  router: routerReducer,
});
