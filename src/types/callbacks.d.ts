declare interface Utf16EncodedChar extends String {
  _utf16brand: any;
}

declare enum DropEffect {
  None = 0,
  Copy = 1,
}

declare interface DragDropAction {
  Effect: DropEffect;

  /**
   * Destination playlist
   */
  Playlist: string;

  /**
   * Position in playlist
   */
  Base: number;

  /**
   * Whether to select dropped files and set focus to first new file
   */
  ToSelect: boolean;
}

declare type DragDropMask = FbTodo;

declare enum PlaybackStopReason {
  User = 0,
  EndOfFile = 1,
  StartingAnother = 2,
}

declare enum PlaybackStartCommand {
  Default = 0,
  Play = 1,
  Next = 2,
  Previous = 3,
  SetTrack = 4,
  Random = 5,
  Resume = 6,
}

declare enum PlaybackQueueChangeReason {
  UserAdded = 0,
  UserRemoved = 1,
  PlaybackAdvance = 2,
}

declare enum MouseMask {
  MK_LBUTTON = 0x0001,
  MK_RBUTTON = 0x0002,
  MK_SHIFT = 0x0004, // The SHIFT key is down.
  MK_CONTROL = 0x0008, // The CTRL key is down.
  MK_MBUTTON = 0x0010,
  MK_XBUTTON1 = 0x0020,
  MK_XBUTTON2 = 0x0040,
}

/**
 * This is a shim because all these callbacks are actually defined in the
 * global scope, but there's no way to reach those inside the compiled JS.
 * We work around that with some prefix and suffix shims. Hacks all around.
 * @see {@link https://raw.githubusercontent.com/marc2k3/foo_jscript_panel/master/foo_jscript_panel/docs/Callbacks.txt}
 */
declare interface Callbacks {
  /**
   * Called when "Always On Top" state changes from using the menu, Alt + A, fb.AlwaysOnTop, etc
   * @param state the current "always on top" state
   */
  on_always_on_top_changed(state: boolean): void;

  /**
   * In order to use this callback, use window.DlgCode(DLGC_WANTCHARS);
   * @see {@link flags.ts}
   * @param code UTF16 encoded char.
   */
  on_char(code: Utf16EncodedChar): void;

  /**
   * Called when colours are changed via default UI/columns UI preferences.
   * Use window.GetColourCUI()/window.GetColourDUI() to get new colours.
   */
  on_colours_changed(): void;

  /**
   * Called when "cursor follow playback" state is changed.
   * @param state the current "cursor follow playback" state
   */
  on_cursor_follow_playback_changed(state: boolean): void;

  /**
   * @see {@link https://github.com/marc2k3/foo_jscript_panel/wiki/Drag-and-Drop}
   * @param action an object containing Effect, which denotes the state of the action
   * @param x mouse coords
   * @param y mouse coords
   * @param mask TODO
   */
  on_drag_drop(
    action: DragDropAction,
    x: number,
    y: number,
    mask: DragDropMask
  ): void;
  on_drag_enter(
    action: DragDropAction,
    x: number,
    y: number,
    mask: DragDropMask
  ): void;
  on_drag_leave(): void;
  on_drag_over(
    action: DragDropAction,
    x: number,
    y: number,
    mask: DragDropMask
  ): void;

  /**
   * This callback is only available in foobar2000 v1.4 and later.
   * Called when DSP preset changes.
   * Does not get called when presets are added or removed.
   */
  on_dsp_preset_changed(): void;

  /**
   * Called when the panel gets/loses focus.
   */
  on_focus(is_focused: boolean): void;

  /**
   * Called when fonts are changed via default UI/columns UI preferences.
   * Retrieve fonts using window.GetFontDUI()/window.GetFontCUI()
   */
  on_font_changed(): void;

  /**
   * Called when thread created by utils.GetAlbumArtAsync() is done.
   * @param handle
   * @param art_id
   * @param image
   * @param image_path path to the image file or music file if showing embedded artwork
   */
  on_get_album_art_done(
    handle: FbTodo,
    art_id: FbTodo,
    image: FbTodo,
    image_path: string
  ): void;

  /**
   * Called when playlist focus has been changed.
   * @param playlistIndex TODO
   * @param from
   * @param to
   */
  on_item_focus_change(playlistIndex: FbTodo, from: FbTodo, to: FbTodo): void;

  /**
   * Called when at least one minute of the track has been played or the track has reached
   * its end after at least 1/3 of it has been played through.
   * @param handle
   */
  on_item_played(handle: FbMetadbHandle): void;

  /*
  Both keyboard related callbacks require "Grab focus" enabled in the Configuration window.
  in order to use arrow keys, use window.DlgCode(DLGC_WANTARROWS);
  See flags.txt > DLGC_WANTARROWS.
  vkey: Virtual Key Code, refer to: http://msdn.microsoft.com/en-us/library/ms927178.aspx

  on_key_down only: Keyboard shortcuts defined in the main preferences are always executed first
  and are not passed to the callback.
  */
  on_key_down(vkey: FbTodo): void;
  on_key_up(vkey: FbTodo): void;

  /**
   * Called when items are added to the library.
   * @param handle_list
   */
  on_library_items_added(handle_list: FbMetadbHandleList): void;

  /**
   * Called when the library items change
   * @param handle_list
   */
  on_library_items_changed(handle_list: FbMetadbHandleList): void;

  /**
   * Called when items are removed from the library
   * @param handle_list
   */
  on_library_items_removed(handle_list: FbMetadbHandleList): void;

  /**
   * Called when thread created by gdi.LoadImageAsync() is done.
   * @param cookie
   * @param image
   */
  on_load_image_done(cookie: FbTodo, image: FbTodo): void;

  /**
   * On the main menu>File>JScript Panel, there are 10 menu items and whichever number
   * is selected is sent as the "index" to this callback. Being main menu items now means you
   * can bind them to global keyboard shortcuts, standard toolbar buttons, panel stack splitter
   * buttons, etc. Remember to think carefully about where you use this code as you probably only
   * want it to run once and so don't include it in common files and scripts where you might have
   * multiple instances. Also, you should avoid sharing scripts containing this code so as not
   * to conflict with what other users may already be using.
   * @example
   * on_main_menu(index) {
   *   switch (index) {
   *   case 1: // triggered when File>JScript Panel>1 is run
   *     do_something();
   *     break;
   *   case 2: // triggered when File>JScript Panel>2 is run
   *     do_something_else();
   *     break;
   *   }
   * }
   */
  on_main_menu(index: number): void;

  /**
   * Called when metadb contents change.
   *
   * @param handle_list
   * @param fromhook true if notification is not from tag update but a component that provides tag-like data from a database. foo_playcount and the "RefreshStats" handle/handle list methods built in to JScript Panel are just 2 examples.
   */
  on_metadb_changed(handle_list: FbMetadbHandleList, fromhook: boolean): void;

  on_mouse_lbtn_dblclk(x: number, y: number, mask: MouseMask): void;
  on_mouse_lbtn_down(x: number, y: number, mask: MouseMask): void;
  on_mouse_lbtn_up(x: number, y: number, mask: MouseMask): void;
  on_mouse_leave(): void;
  on_mouse_mbtn_dblclk(x: number, y: number, mask: MouseMask): void;
  on_mouse_mbtn_down(x: number, y: number, mask: MouseMask): void;
  on_mouse_mbtn_up(x: number, y: number, mask: MouseMask): void;
  on_mouse_move(x: number, y: number, mask: MouseMask): void;
  on_mouse_rbtn_dblclk(x: number, y: number, mask: MouseMask): void;
  on_mouse_rbtn_down(x: number, y: number, mask: MouseMask): void;
  // See flags.txt > Mask for mouse callbacks

  on_mouse_rbtn_up(x: number, y: number, mask: MouseMask): void;
  // You must return true if you want to suppress the default context menu.
  // Hold left shift + left windows key to bypass user code and open default context menu.

  /**
   * Called when the mouse is scrolled vertically.
   * @param step positive for scrolling up, negative for scrolling down
   */
  on_mouse_wheel(step: number): void;
  // Scroll up/down

  /**
   * Called when the mouse is scrolled horizontally.
   */
  on_mouse_wheel_h(step: number): void;

  /**
   * Called in other panels after window.NotifyOthers(name, info) is executed
   * @param name
   * @param info
   */
  on_notify_data(name: FbTodo, info: FbTodo): void;

  /**
   * This callback is only available in foobar2000 v1.4 and later.
   * Called when output device changes. Use fb.GetOutputDevices to retrieve settings.
   */
  on_output_device_changed(): void;

  /**
   * Called when window is ready to draw.
   * @param gr
   */
  on_paint(gr: GdiGraphics): void;
  //
  // See interfaces.txt for all the methods used with gr.

  /**
   * Called when "playback follow cursor" state is changed
   * @param state the current "playback follows cursor" state
   */
  on_playback_follow_cursor_changed(playback_follows_cursor: boolean): void;

  /**
   * Called when per-track dynamic info (VBR bitrate etc) changes.
   */
  on_playback_dynamic_info(): void;

  /**
   * Called when per-track dynamic info (stream track titles etc) change.
   * Happens less often than on_playback_dynamic_info().
   */
  on_playback_dynamic_info_track(): void;

  /**
   * Called when currently playing file gets edited.
   * Also called by components that provide tag-like data such as foo_playcount.
   * @param handle
   */
  on_playback_edited(handle: FbMetadbHandle): void;

  /**
   * Called when a new track is selected for playback.
   * @param handle
   */
  on_playback_new_track(handle: FbMetadbHandle): void;

  /**
   * Called when playback order is changed.
   * @param new_order_index
   */
  on_playback_order_changed(new_order_index: PlaybackOrder): void;

  /**
   * Called when playback pauses.
   */
  on_playback_pause(is_paused: boolean): void;
  // state: boolean, true when paused, false when unpaused.

  /**
   * Called when the playback queue changes.
   * @param origin
   */
  on_playback_queue_changed(origin: PlaybackQueueChangeReason): void;
  // origin:

  /**
   * Called when the track position is seeked
   * @param time the seeked position in the track in seconds
   */
  on_playback_seek(time: number): void;
  // time: float value, in seconds.

  /**
   * Called when a new track starts to play.
   * @param cmd
   * @param is_paused
   */
  on_playback_starting(cmd: PlaybackStartCommand, is_paused: boolean): void;

  /**
   * Called when playback stops
   * @param reason
   */
  on_playback_stop(reason: PlaybackStopReason): void;

  /**
   * Called every second a track is playing. Useful for time display.
   * @param time the elapsed fractional playback time in seconds
   */
  on_playback_time(time: number): void;

  on_playlist_item_ensure_visible(
    playlistIndex: number,
    playlistItemIndex: number
  ): void;

  on_playlist_items_added(playlistIndex: number): void;
  on_playlist_items_removed(playlistIndex: number, new_count: number): void;
  on_playlist_items_reordered(playlistIndex: number): void;

  /**
   * Workaround for some 3rd party playlist viewers not working with on_selection_changed().
   */
  on_playlist_items_selection_change(): void;

  /**
   * Called when "stop after current" is enabled/disabled.
   * @param state the current "stop after current" state
   */
  on_playlist_stop_after_current_changed(state: boolean): void;

  /**
   * TODO
   */
  on_playlist_switch(): void;

  /**
   * Called when:
   * - playlists are added/removed/reordered/renamed.
   * - a playlist's lock status changes through the use of components such as foo_utils or foo_playlist_attributes.
   */
  on_playlists_changed(): void;

  /**
   * This callback is only available in foobar2000 v1.4 and later.
   *
   * Called when the ReplayGain mode is changed.
   *
   * @param new_mode
   */
  on_replaygain_mode_changed(new_mode: ReplayGainMode): void;

  /**
   * This callback is not guaranteed to be called during unloading.
   */
  on_script_unload(): void;

  /**
   * Called when selection changes based on "File>Preferences>Display>Selection viewers".
   */
  on_selection_changed(): void;

  /**
   * Called when panel is resized.
   * IMPORTANT: DO NOT call window.Repaint()
   */
  on_size(): void;

  /**
   * Called when the volume is changed.
   * @param val the volume in dBFS (minimum -100, maximum 0)
   */
  on_volume_change(val: number): void;
}

declare var callbacks: Partial<Callbacks>;
