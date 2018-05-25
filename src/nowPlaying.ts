import { Action } from 'redux';
import { AppStore } from './store';

export interface NowPlayingState {
  trackMetadata: { [key: string]: string | null };
}

interface UpdateTrackMetadataAction extends Action {
  type: 'UPDATE_TRACK_METADATA';
  formatString: string;
  evalOutput: string;
}

interface AddTrackMetadataAction extends Action {
  type: 'ADD_TRACK_METADATA';
  formatString: string;
}

type NowPlayingAction = UpdateTrackMetadataAction | AddTrackMetadataAction;

function selectAllRegisteredTrackMetadata(store: AppStore) {
  return store.getState().nowPlaying.trackMetadata;
}

export function handleNewTrack(store: AppStore) {
  const actionsToUpdateAll = Object.keys(
    selectAllRegisteredTrackMetadata(store)
  ).map<UpdateTrackMetadataAction>(key => ({
    type: 'UPDATE_TRACK_METADATA',
    formatString: key,
    evalOutput: fb.TitleFormat(`%${key}%`).Eval(),
  }));

  actionsToUpdateAll.forEach(action => store.dispatch(action));
}

export function reducer(
  state: NowPlayingState | undefined,
  action: NowPlayingAction
): NowPlayingState {
  if (state == null) {
    return {
      trackMetadata: {
        title: null,
        artist: null,
        album: null,
        length: null,
        codec: null,
        channels: null,
        samplerate: null,
      },
    };
  }

  switch (action.type) {
    case 'UPDATE_TRACK_METADATA':
      return {
        ...state,
        trackMetadata: {
          ...state.trackMetadata,
          [action.formatString]: action.evalOutput,
        },
      };
    case 'ADD_TRACK_METADATA':
      return {
        ...state,
        trackMetadata: {
          ...state.trackMetadata,
          [action.formatString]: null,
        },
      };
    default:
      return state;
  }
}
