import { combineReducers } from 'redux';
import { reducer as nowPlayingReducer } from './nowPlaying';

export default combineReducers({
  nowPlaying: nowPlayingReducer,
});
