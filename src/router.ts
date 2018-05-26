import { Action } from 'redux';
import store from './store';
import { router as legacyRouter } from './legacy';

interface ReplaceCallbacksAction extends Action {
  type: 'REPLACE_CALLBACKS';
  callbacks: Partial<Callbacks>;
}

type RouterAction = ReplaceCallbacksAction;

export function replace(callbacks: Partial<Callbacks>): ReplaceCallbacksAction {
  return {
    type: 'REPLACE_CALLBACKS',
    callbacks,
  };
}

type RouterState = Partial<Callbacks>;

export function reducer(
  state: RouterState | undefined,
  action: RouterAction
): RouterState {
  if (state == null) {
    console.log('returning root callbacks');
    return rootCallbacks;
  }

  switch (action.type) {
    case 'REPLACE_CALLBACKS':
      return action.callbacks;
    default:
      return state;
  }
}

const rootCallbacks: Partial<Callbacks> = {
  on_key_up: (key: number) => {
    if (key === 65) {
      store.dispatch(replace(legacyRouter));
    }
  },
};

function handleLookupWithArgs(name: string) {
  return (...args: any[]) => {
    const state = store.getState();

    if (state == null || state.router == null) {
      return undefined;
    }

    const pointer = (<any>state.router)[name];
    if (pointer) {
      return pointer(...args);
    } else {
      return undefined;
    }
  };
}

export const lookupRouter: Partial<Callbacks> = {
  on_always_on_top_changed: handleLookupWithArgs('on_always_on_top_changed'),
  on_char: handleLookupWithArgs('on_char'),
  on_colours_changed: handleLookupWithArgs('on_colours_changed'),
  on_cursor_follow_playback_changed: handleLookupWithArgs(
    'on_cursor_follow_playback_changed'
  ),
  on_drag_drop: handleLookupWithArgs('on_drag_drop'),
  on_drag_enter: handleLookupWithArgs('on_drag_enter'),
  on_drag_leave: handleLookupWithArgs('on_drag_leave'),
  on_drag_over: handleLookupWithArgs('on_drag_over'),
  on_dsp_preset_changed: handleLookupWithArgs('on_dsp_preset_changed'),
  on_focus: handleLookupWithArgs('on_focus'),
  on_font_changed: handleLookupWithArgs('on_font_changed'),
  on_get_album_art_done: handleLookupWithArgs('on_get_album_art_done'),
  on_item_focus_change: handleLookupWithArgs('on_item_focus_change'),
  on_item_played: handleLookupWithArgs('on_item_played'),
  on_key_down: handleLookupWithArgs('on_key_down'),
  on_key_up: handleLookupWithArgs('on_key_up'),
  on_library_items_added: handleLookupWithArgs('on_library_items_added'),
  on_library_items_changed: handleLookupWithArgs('on_library_items_changed'),
  on_library_items_removed: handleLookupWithArgs('on_library_items_removed'),
  on_load_image_done: handleLookupWithArgs('on_load_image_done'),
  on_main_menu: handleLookupWithArgs('on_main_menu'),
  on_metadb_changed: handleLookupWithArgs('on_metadb_changed'),
  on_mouse_lbtn_dblclk: handleLookupWithArgs('on_mouse_lbtn_dblclk'),
  on_mouse_lbtn_down: handleLookupWithArgs('on_mouse_lbtn_down'),
  on_mouse_lbtn_up: handleLookupWithArgs('on_mouse_lbtn_up'),
  on_mouse_leave: handleLookupWithArgs('on_mouse_leave'),
  on_mouse_mbtn_dblclk: handleLookupWithArgs('on_mouse_mbtn_dblclk'),
  on_mouse_mbtn_down: handleLookupWithArgs('on_mouse_mbtn_down'),
  on_mouse_mbtn_up: handleLookupWithArgs('on_mouse_mbtn_up'),
  on_mouse_move: handleLookupWithArgs('on_mouse_move'),
  on_mouse_rbtn_dblclk: handleLookupWithArgs('on_mouse_rbtn_dblclk'),
  on_mouse_rbtn_down: handleLookupWithArgs('on_mouse_rbtn_down'),
  on_mouse_rbtn_up: handleLookupWithArgs('on_mouse_rbtn_up'),
  on_mouse_wheel: handleLookupWithArgs('on_mouse_wheel'),
  on_mouse_wheel_h: handleLookupWithArgs('on_mouse_wheel_h'),
  on_notify_data: handleLookupWithArgs('on_notify_data'),
  on_output_device_changed: handleLookupWithArgs('on_output_device_changed'),
  on_paint: handleLookupWithArgs('on_paint'),
  on_playback_dynamic_info: handleLookupWithArgs('on_playback_dynamic_info'),
  on_playback_dynamic_info_track: handleLookupWithArgs(
    'on_playback_dynamic_info_track'
  ),
  on_playback_edited: handleLookupWithArgs('on_playback_edited'),
  on_playback_follow_cursor_changed: handleLookupWithArgs(
    'on_playback_follow_cursor_changed'
  ),
  on_playback_new_track: handleLookupWithArgs('on_playback_new_track'),
  on_playback_order_changed: handleLookupWithArgs('on_playback_order_changed'),
  on_playback_pause: handleLookupWithArgs('on_playback_pause'),
  on_playback_queue_changed: handleLookupWithArgs('on_playback_queue_changed'),
  on_playback_seek: handleLookupWithArgs('on_playback_seek'),
  on_playback_starting: handleLookupWithArgs('on_playback_starting'),
  on_playback_stop: handleLookupWithArgs('on_playback_stop'),
  on_playback_time: handleLookupWithArgs('on_playback_time'),
  on_playlist_item_ensure_visible: handleLookupWithArgs(
    'on_playlist_item_ensure_visible'
  ),
  on_playlist_items_added: handleLookupWithArgs('on_playlist_items_added'),
  on_playlist_items_removed: handleLookupWithArgs('on_playlist_items_removed'),
  on_playlist_items_reordered: handleLookupWithArgs(
    'on_playlist_items_reordered'
  ),
  on_playlist_switch: handleLookupWithArgs('on_playlist_switch'),
  on_playlists_changed: handleLookupWithArgs('on_playlists_changed'),
  on_replaygain_mode_changed: handleLookupWithArgs(
    'on_replaygain_mode_changed'
  ),
  on_script_unload: handleLookupWithArgs('on_script_unload'),
  on_selection_changed: handleLookupWithArgs('on_selection_changed'),
  on_size: handleLookupWithArgs('on_size'),
  on_volume_change: handleLookupWithArgs('on_volume_change'),
};
