declare enum ReplayGainMode {
  None,
  Track,
  Album,
  PlaybackOrder,
}

type FbMetadbHandleList = any;

type FbTodo = any;

declare interface FbUiSelectionHolder {
  Dispose(): void;

  /**
   * Sets the selected items
   * @see {@link https://github.com/lediur/foo_jscript_panel/blob/master/foo_jscript_panel/docs/Interfaces.txt}
   */
  SetSelection(handleList: FbMetadbHandleList): void;

  /**
   * Sets selected items to playlist selection and enables tracking.
   * When the playlist selection changes, the stored selection is automatically
   * updated. Tracking ends when a set method is called on any ui_selection_holder
   * or when the last reference to this ui_selection_holder is released.
   * @see {@link https://github.com/lediur/foo_jscript_panel/blob/master/foo_jscript_panel/docs/Interfaces.txt}
   */
  SetPlaylistSelectionTracking(): void;

  /**
   * Sets selected items to playlist contents and enables tracking.
   * When the playlist selection changes, the stored selection is automatically
   * updated. Tracking ends when a set method is called on any ui_selection_holder
   * or when the last reference to this ui_selection_holder is released.
   * @see {@link https://github.com/lediur/foo_jscript_panel/blob/master/foo_jscript_panel/docs/Interfaces.txt}
   */
  SetPlaylistTracking(): void;
}

declare interface AppendMenuItemFlags extends Number {
  _amifBrand: any;
}

declare interface AppendMenuItemId extends Number {
  _amidBrand: any;
}

declare interface TrackPopupMenuFlags extends Number {
  _tpmfBrand: any;
}

declare interface DragDropEffect extends Number {
  _ddeBrand: any;
}

declare interface MenuObj {
  /**
   * @param flags
   * @param item_id unique id for each menu item > 0
   * @param text
   */
  AppendMenuItem(
    flags: AppendMenuItemFlags,
    item_id: number,
    text: string
  ): void;

  AppendMenuSeparator(): void;

  AppendTo(parentMenu: MenuObj, flags: AppendMenuItemFlags, text: string): void;

  CheckMenuItem(item_id: number, check: boolean): void;

  CheckMenuRadioItem(
    first_item_id: AppendMenuItemId,
    last_item_id: AppendMenuItemId,
    selected_item_id: AppendMenuItemId
  ): void;

  Dispose(): void;

  TrackPopupMenu(x: number, y: number, flags?: TrackPopupMenuFlags): void;
  // flags: default 0. See flags.txt > Used in TrackPopupMenu()
}

declare interface ContextMenuManager {
  /**
   * @param menuObj
   * @param base_id
   * @param max_id optional as of v2.0.4. Default -1.
   */
  BuildMenu(
    menuObj: MenuObj,
    base_id: AppendMenuItemId,
    max_id?: AppendMenuItemId
  ): void;
  Dispose(): void;
  ExecuteByID(id: AppendMenuItemId): boolean;
  InitContext(handle_list: FbMetadbHandleList): void;
  InitNowPlaying(): void;
}

declare interface MainMenuManager {
  BuildMenu(menuObj: MenuObj, base_id: AppendMenuItemId, count: number): void;
  Dispose(): void;
  ExecuteByID(id: AppendMenuItemId): boolean;

  /**
   *
   * @param rootName the internal name of the foobar2000 menu to display (e.g. "file" to display the native foobar2000 File menu)
   */
  Init(rootName: string): void;
}

declare interface FbProfiler {
  /**
   * Milliseconds elapsed since creation
   */
  Time: number;

  Reset(): void;

  /**
   * Print out component name, version, name, time elapsed
   *
   * @example
   * var test = fb.CreateProfiler("test");
   * test.Print(); // "JScript Panel v2.0.2: FbProfiler (test): 789 ms"
   */
  Print(): void;
}

declare namespace fb {
  /**
   * Whether the "Always on top" setting is checked
   */
  var AlwaysOnTop: boolean;

  /**
   * The path to the foo_jscript_panel component
   */
  const ComponentPath: string;

  /**
   * Whether or not the "Cursor follows playback" setting is checked
   */
  var CursorFollowPlayback: boolean;

  /**
   * The path to the foobar2000 installation directory
   */
  const FoobarPath: string;

  /**
   * Whether or not playback is paused
   */
  const IsPaused: boolean;

  /**
   * Whether or not playback is currently playing
   */
  const IsPlaying: boolean;

  /**
   * Whether or not the "Playback follows cursor" setting is checked
   */
  var PlaybackFollowCursor: boolean;

  /**
   * The total length of the current track in seconds
   */
  const PlaybackLength: number;

  /**
   * The elapsed playback time of the current track in seconds
   */
  var PlaybackTime: number;

  /**
   * The path to the foobar2000 user profile directory (usually in %appdata%)
   */
  const ProfilePath: string;

  /**
   * The current ReplayGain mode
   */
  var ReplaygainMode: ReplayGainMode;

  /**
   * Whether or not playback will stop after the current track finishes
   */
  var StopAfterCurrent: boolean;

  /**
   * The current player volume, in -dBFS
   * (0 is maximum volume, -100 is minimum volume)
   */
  var Volume: number;

  /**
   * This is typically used to update the selection used by the default UI artwork panel
   * or any other panel that makes use of the preferences under
   * File>Preferences>Display>Selection viewers. Use in conjunction with the on_focus
   * callback. See callbacks.txt.
   *
   * @example <caption>(for playlist viewers)</caption>
   *
   * var selection_holder = fb.AcquireUiSelectionHolder();
   * selection_holder.SetPlaylistSelectionTracking();
   *
   * function on_focus(is_focused) {
   *   if (is_focused) {
   *     // Updates the selection when panel regains focus
   *     selection_holder.SetPlaylistSelectionTracking();
   *   }
   * }
   *
   * @example <caption>(for library viewers)</caption>
   *
   * var selection_holder = fb.AcquireUiSelectionHolder();
   * var handle_list = null;
   *
   * function on_mouse_lbtn_up(x, y) {
   *   // Presumably going to select something here...
   *   handle_list = ...;
   *   selection_holder.SetSelection(handle_list);
   * }
   *
   * function on_focus(is_focused) {
   *   if (is_focused) {
   *     // Updates the selection when panel regains focus
   *     if (handle_list && handle_list.Count) {
   *       selection_holder.SetSelection(handle_list);
   *     }
   *   }
   * }
   *
   * @see {@link https://github.com/lediur/foo_jscript_panel/blob/master/foo_jscript_panel/docs/Interfaces.txt}
   */
  function AcquireUiSelectionHolder(): FbUiSelectionHolder;

  function AddDirectory(): void;
  function AddFiles(): void;

  /**
   * Checks Clipboard contents are handles or a file selection from Windows Explorer.
   * Use in conjunction with {@link fb#GetClipboardContents}.
   *
   * @param window_id
   * @see {@link https://github.com/lediur/foo_jscript_panel/blob/master/foo_jscript_panel/docs/Interfaces.txt}
   */
  function CheckClipboardContents(window_id: FbTodo): boolean;

  /**
   * Clears active playlist.
   * If you wish to clear a specific playlist, use {@link plman#ClearPlaylist}.
   *
   * @see {@link https://github.com/lediur/foo_jscript_panel/blob/master/foo_jscript_panel/docs/Interfaces.txt}
   */
  function ClearPlaylist(): void;

  /**
   * Items can then be pasted in other playlist viewers or in Windows Explorer as files.
   *
   * @example <caption>copy playlist items</caption>
   *
   * var items = plman.GetPlaylistSelectedItems(plman.ActivePlaylist);
   * fb.CopyHandleListToClipboard(items);
   * items.Dispose();
   *
   * @example <caption>cut playlist items</caption>
   *
   * var ap = plman.ActivePlaylist;
   * if (!plman.IsPlaylistLocked(ap)) {
   *   var items = plman.GetPlaylistSelectedItems(ap);
   *   if (fb.CopyHandleListToClipboard(items)) {
   *     plman.UndoBackup(ap);
   *     plman.RemovePlaylistSelection(ap);
   *   }
   *   items.Dispose();
   * }
   *
   * @param handleList handles to foobar playback items
   * @returns whether or not copy the items to the clipboard was successful
   */
  function CopyHandleListToClipboard(handleList: FbMetadbHandleList): boolean;

  /**
   * @see {@link samples/basic/MainMenuManager All-In-One.txt}
   * @see {@link samples/basic/Menu Sample.txt}
   */
  function CreateContextMenuManager(): ContextMenuManager;

  /**
   * @returns an empty handle list
   */
  function CreateHandleList(): FbMetadbHandleList;

  /**
   * @see {@link samples/basic/MainMenuManager All-In-One.txt}
   * @see {@link samples/basic/Menu Sample.txt}
   */
  function CreateMainMenuManager(): MainMenuManager;

  function CreateProfiler(name?: string): FbProfiler;

  /**
   *
   * @param handle_list
   * @param effect {@link https://github.com/marc2k3/foo_jscript_panel/wiki/Drag-and-Drop}
   */
  function DoDragDrop(
    handle_list: FbMetadbHandleList,
    effect: DragDropEffect
  ): number;

  // function Exit()
  // function GetClipboardContents(window_id)
  // function GetDSPPresets();
  // function GetFocusItem([force])
  // function GetLibraryItems()
  // function GetLibraryRelativePath(handle)
  // function GetNowPlaying()
  // function GetOutputDevices()
  // function GetQueryItems(handle_list, query)
  // function GetSelection()
  // function GetSelections([flags])
  // function GetSelectionType()
  // function IsLibraryEnabled()
  // function IsMetadbInMediaLibrary(handle)
  // function LoadPlaylist()
  // function Next()
  // function Pause()
  // function Play()
  // function PlayOrPause()
  // function Prev()
  // function Random()
  // function RunContextCommand(command[, flags])
  // function RunContextCommandWithMetadb(command, handle_or_handle_list[, flags])
  // function RunMainMenuCommand(command)
  // function SavePlaylist()
  // function SetDSPPreset(idx)
  // function SetOutputDevice(output, device)
  // function ShowConsole()
  // function ShowLibrarySearchUI(query)
  // function ShowPopupMessage(msg[, title])
  // function ShowPreferences()
  // function Stop()
  // function TitleFormat(expression)
  // function VolumeDown()
  // function VolumeMute()
  // function VolumeUp()
}
