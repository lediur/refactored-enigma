declare enum ReplayGainMode {
  None,
  Track,
  Album,
  PlaybackOrder,
}

type FbMetadbHandleList = FbTodo;

type FbMetadbHandle = FbTodo;

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

declare interface QueryString extends String {
  _qsBrand: any;
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

declare interface DSPPreset {
  active: boolean;
  name: string;
}

declare type DSPPresetList = DSPPreset[];

declare interface OutputDevice {
  active: boolean;
  device_id: string;
  name: string;
  output_id: string;
}

declare type OutputDeviceList = OutputDevice[];

declare enum GetSelectionsFlags {
  Default = 0,
  ExcludeNotPlaying = 1,
}

declare enum SelectionType {
  NoItem = 0,
  ActivePlaylistSelection,
  CallerActivePlaylist,
  PlaylistManager,
  NowPlaying,
  KeyboardShortcutList,
  MediaLibraryViewer,
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
  function CheckClipboardContents(windowId: FbTodo): boolean;

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

  function Exit(): void;

  /**
   * Clipboard contents can be handles copied to the clipboard in other components, from fb.CopyHandleListToClipboard or a file selection
   * from Windows Explorer etc.
   *
   * @example
   *
   * function on_mouse_rbtn_up(x, y) {
   *   var ap = plman.ActivePlaylist;
   *   var menu = window.CreatePopupMenu();
   *   menu.AppendMenuItem(!plman.IsPlaylistLocked(ap) && fb.CheckClipboardContents(window.ID) ? MF_STRING : MF_GRAYED, 1, "Paste"); // assume MF_* are already defined
   *   var idx = menu.TrackPopupMenu(x, y);
   *   if (idx == 1) {
   *     var items = fb.GetClipboardContents(window.ID);
   *     plman.InsertPlaylistItems(ap, plman.PlaylistItemCount(ap), items);
   *     items.Dispose();
   *   }
   *   menu.Dispose();
   *   return true;
   * }
   */
  function GetClipboardContents(windowId: FbTodo): FbMetadbHandleList;

  /**
   * foobar2000 v1.4 and above only. Throws a script error on v1.3.
   * Returns a JSON array in string form so you need to use JSON.parse() on the result.
   *
   * @example
   *
   * var str = fb.GetDSPPresets();
   * var arr = JSON.parse(str);
   * console.log(arr.length); // number of presets
   * console.log(JSON.stringify(arr, null, 4)); // using JSON.stringify here for displaying the output below
   *
   * [
   *   {
   *     "active": true,
   *     "name": "two"
   *   },
   *   {
   *     "active": false,
   *     "name": "three"
   *   }
   * ]
   *
   * @example
   *
   * var active_name = "";
   * var str = fb.GetDSPPresets();
   * var arr = JSON.parse(str);
   * for (var i = 0; i < arr.length; i++) {
   *   if (arr[i].active) {
   *     active_name = arr[i].name;
   *   }
   * }
   * console.log(active_name);
   *
   * Simply use the array index to change preset using fb.SetDSPPreset(idx);
   * fb.SetDSPPreset(1); // changes to the 2nd entry in the example above
   */
  function GetDSPPresets(): string;

  /**
   * @param force use the first item of the active playlist if unable to get focus item
   */
  function GetFocusItem(force?: boolean): FbMetadbHandle;

  /**
   * @returns all media library items
   */
  function GetLibraryItems(): FbMetadbHandleList;

  /**
   * @returns the path to the metadb handle, or an empty string if not in the library
   * @example <caption>The foobar2000 Media Library is configured to watch "D:\Music" and the
   * path of the now playing item is "D:\Music\Albums\Artist\Some Album\Some Song.flac"</caption>
   *
   * var handle = fb.GetNowPlaying();
   * console.log(fb.GetLibraryRelativePath(handle)); // Albums\Artist\Some Album\Some Song.flac
   * NOTE: Do not use this while looping a handle list. Use IFbMetadbHandleList GetLibraryRelativePaths
   * instead.
   */
  function GetLibraryRelativePath(handle: FbMetadbHandle): string;

  /**
   * Gets the handle of the currently playing item
   */
  function GetNowPlaying(): FbMetadbHandle;

  /**
   * foobar2000 v1.4 and above only. Throws a script error on v1.3.
   * Returns a JSON array in string form so you need to use JSON.parse() on the result.
   *
   * @example
   * var str = fb.GetOutputDevices();
   * var arr = JSON.parse(str);
   * console.log(arr.length); // number of devices
   * console.log(JSON.stringify(arr, null, 4)); // using JSON.stringify here for displaying the output below
   *
   * [
   *   {
   *     "active": false,
   *     "device_id": "{5243F9AD-C84F-4723-8194-0788FC021BCC}",
   *     "name": "Null Output",
   *     "output_id": "{EEEB07DE-C2C8-44C2-985C-C85856D96DA1}"
   *   },
   *   {
   *     "active": true,
   *     "device_id": "{00000000-0000-0000-0000-000000000000}",
   *     "name": "Primary Sound Driver",
   *     "output_id": "{D41D2423-FBB0-4635-B233-7054F79814AB}"
   *   },
   *   {
   *     "active": false,
   *     "device_id": "{1C4EC038-97DB-48E7-9C9A-05FDED46847B}",
   *     "name": "Speakers (Sound Blaster Z)",
   *     "output_id": "{D41D2423-FBB0-4635-B233-7054F79814AB}"
   *   },
   *   {
   *     "active": false,
   *     "device_id": "{41B86272-3D6C-4A5A-8907-4FE7EBE39E7E}",
   *     "name": "SPDIF-Out (Sound Blaster Z)",
   *     "output_id": "{D41D2423-FBB0-4635-B233-7054F79814AB}"
   *   },
   *   {
   *     "active": false,
   *     "device_id": "{9CDC0FAE-2870-4AFA-8287-E86099D69076}",
   *     "name": "3 - BenQ BL3200 (AMD High Definition Audio Device)",
   *     "output_id": "{D41D2423-FBB0-4635-B233-7054F79814AB}"
   *   }
   * ]
   *
   * As you can see, only one of the items in the array has "active"
   * set to true so that is the device you'd want to display the name of
   * or mark as selected in a menu.
   *
   * To actually change device, you'll need the device_id and output_id
   * and use them with fb.SetOutputDevice.
   *
   * Example:
   * var str = fb.GetOutputDevices();
   * var arr = JSON.parse(str);
   * // Assuming same list from above, switch output to the last device.
   * fb.SetOutputDevice(arr[4].output_id, arr[4].device_id);
   */
  function GetOutputDevices(): string;

  /**
   * Query the list of handles using a foobar2000 query string. Results are unsorted.
   *
   * NOTE: Use try/catch to handle invalid queries. An empty handle list will be returned if the query
   * is valid but there are no results.
   *
   * @example
   * var a = fb.GetQueryItems(plman.GetPlaylistItems(plman.ActivePlaylist), "rating IS 5");
   *
   * @example
   * var b = fb.GetQueryItems(fb.GetLibraryItems(), "rating IS 5");
   */
  function GetQueryItems(
    handle_list: FbMetadbHandleList,
    query: QueryString
  ): FbMetadbHandleList;

  /**
   * Gets now playing or selected item. What you get will depend on the setting
   * in "File > Preferences > Display > Selection viewers".
   */
  function GetSelection(): FbMetadbHandle | null;

  /**
   * Like GetSelection(), except will always return a valid list.
   * @param flags
   */
  function GetSelections(flags: GetSelectionsFlags): FbMetadbHandleList;

  /**
   * Retrieves the kind of selection
   */
  function GetSelectionType(): SelectionType;

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
