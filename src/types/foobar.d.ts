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

declare interface MenuItemName extends String {
  _minBrand: any;
}

declare interface OutputDeviceId extends String {
  _odidBrand: any;
}

declare interface OutputId extends String {
  _oidBrand: any;
}

declare interface TimerId extends Number {
  _oidBrand: any;
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
    text: MenuItemName
  ): void;

  AppendMenuSeparator(): void;

  AppendTo(
    parentMenu: MenuObj,
    flags: AppendMenuItemFlags,
    text: MenuItemName
  ): void;

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
  device_id: OutputDeviceId;
  name: string;
  output_id: OutputId;
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

declare enum ContextCommandFlags {
  /**
   * depends on whether SHIFT key is pressed, flag_view_reduced or flag_view_full is selected
   */
  Default = 0,

  /**
   * Excludes commands hidden by user context menu preferences
   */
  FlagViewReduced = 4,

  /**
   * Includes all possible context menu items, including those hidden by the user's context menu preferences
   * at File>Preferences>Display>Context Menu
   */
  FlagViewFull = 8,
}

declare interface VBArray<T> {
  toArray(): T[];
}

declare interface FbTitleFormat {
  Dispose(): void;

  /**
   * Evaluate the title format string against the currently playing track.
   *
   * Always use Eval when you want dynamic info such as %playback_time%, %bitrate% etc.
   * EvalWithMetadb(fb.GetNowplaying()) will not give the results you want.
   *
   * @param force process text without title formatting even if a track isn't playing. When playing, you should always get a result.
   */
  Eval(force?: boolean): string;

  /**
   * Evaluate the title format string against the provided handle. If the track is currently playing,
   * use {@link Eval} instead to get dynamically updating information.
   * @param handle
   */
  EvalWithMetadb(handle: FbMetadbHandle): string;

  /**
   * Evaluate the title format against the provided handle list. Same caveats as {@link EvalWithMetadb}.
   * @param handle_list
   */
  EvalWithMetadbs(handle_list: FbMetadbHandleList): VBArray<string>;
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

  function IsLibraryEnabled(): boolean;

  /**
   *
   * @param handle
   * @returns whether the provided handle is in the media library
   */
  function IsMetadbInMediaLibrary(handle: FbMetadbHandle): boolean;

  function LoadPlaylist(): void;

  function Next(): void;
  function Pause(): void;
  function Play(): void;
  function PlayOrPause(): void;
  function Prev(): void;
  function Random(): void;

  function RunContextCommand(
    command: MenuItemName,
    flags: ContextCommandFlags
  ): boolean;

  /**
   * @param command
   * @param handleOrHandleList output from something like fb.GetFocusItem() or plman.GetPlaylistSelectedItems(plman.ActivePlaylist)
   * @param flags
   */
  function RunContextCommandWithMetadb(
    command: MenuItemName,
    handleOrHandleList: FbMetadbHandle | FbMetadbHandleList,
    flags: ContextCommandFlags
  ): boolean;

  /**
   * Run a main menu command
   * @param command A "/" separated command (e.g. "File/Add Location...")
   */
  function RunMainMenuCommand(command: string): boolean;

  function SavePlaylist(): void;

  /**
   * foobar2000 v1.4 and above only. Throws a script error on v1.3.
   * @param idx index in the DSP array returned by {@link GetDSPPreset}
   */
  function SetDSPPreset(idx: number): void;

  function SetOutputDevice(output: OutputId, device: OutputDeviceId): void;

  function ShowConsole(): void;

  /**
   * Opens the library search window with the query prepopulated
   * @param query A foobar2000 query string
   */
  function ShowLibrarySearchUI(query: QueryString): void;

  /**
   *
   * @param msg The message to display
   * @param title The title of the window (default "JScript Panel")
   */
  function ShowPopupMessage(msg: string, title: string): void;

  function ShowPreferences(): void;
  function Stop(): void;

  function TitleFormat(expression: string): FbTitleFormat;
  function VolumeDown(): void;
  function VolumeMute(): void;
  function VolumeUp(): void;
}

declare namespace window {
  /**
  See flags.txt > With window.DlgCode

  Example:
  window.DlgCode(DLGC_WANTALLKEYS);
  */
  function DlgCode(): number;

  /** Required in utils.ColourPicker, utils.GetAlbumArtAsync, utils.LoadImageAsync */
  const ID: number;

  /**
 Returns 0 if using Columns UI, 1 if using default UI.
 You need this to determine which GetFontXXX and GetColourXXX methods to use, assuming you want to support both interfaces.
 */
  const InstanceType: number;

  /**
Depends on setting inside JScript Panel Configuration window. You generally use it to determine
whether or not to draw a background. Only useful within Panel Stack Splitter (Columns UI component)
*/
  const IsTransparent: boolean;

  const IsVisible: boolean;

  const Height: number;

  let MaxHeight: number;
  let MaxWidth: number;
  let MinHeight: number;
  let MinWidth: number;
  // The previous 4 methods can be used to lock the panel size. Do not use if panels are contained within Panel Stack Splitter (Columns UI component).

  /**
     Returns the @name set in the preprocessor section. See preprocessors.txt
     If that isn't present, the GUID of the panel is returned.
     */
  const Name: string;

  const Width: number;

  function ClearInterval(timerID: TimerId): void;
  function ClearTimeout(timerID: TimerId): void;
  function SetInterval(func: () => void, delay: number): TimerId;
  function SetTimeout(func: () => void, delay: number): TimerId;
  // See samples\basic\Timer.txt

  // window.CreatePopupMenu(); (IMenuObj)
  // // See samples\basic\MainMenuManager All-In-One, samples\basic\Menu Sample.txt

  //   interface IMenuObj {
  //     Methods:
  //       AppendMenuItem(flags, item_id, text); (void)
  //       /*
  //       flags: See flags.txt > Used in AppendMenuItem()
  //       item_id: integer greater than 0. Each menu item needs a unique id.
  //       */

  //       AppendMenuSeparator(); (void)

  //       AppendTo(parentMenu, flags, text); (void)

  //       CheckMenuItem(item_id, check); (void)
  //       // check: boolean.

  //       CheckMenuRadioItem(first_item_id, last_item_id, selected_item_id); (void)

  //       Dispose(); (void)

  //       TrackPopupMenu(x, y[, flags]); (int)
  //       // flags: default 0. See flags.txt > Used in TrackPopupMenu()
  //   }

  // window.CreateThemeManager(class_list); (IThemeManager)
  // /*
  // class_list: http://msdn.microsoft.com/en-us/library/bb773210%28VS.85%29.aspx
  // See samples\basic\SimpleThemedButton.txt
  // */

  //   interface IThemeManager {
  //     Methods:
  //       DrawThemeBackground(IGdiGraphics, x, y, w, h[, clip_x][, clip_y][, clip_w][, clip_h]); (void)
  //       // clip_x, clip_y, clip_w, clip_h: defaults to 0 if omitted

  //       IsThemePartDefined(partid); (boolean)
  //       SetPartAndStateID(partid[, stateid]); (void)
  //       /*
  //       partid
  //       stateid: default 0
  //       See http://msdn.microsoft.com/en-us/library/bb773210%28VS.85%29.aspx
  //       */
  //   }

  // window.CreateTooltip([font_name][, font_size_px][, font_style]); (IFbTooltip)
  // /*
  // font_name: default "Segoe UI"
  // font_size_px: default 12
  // font_style: default 0. See flags.txt > FontStyle
  // */

  //   interface IFbTooltip {
  //     /*
  //     This will be used in the examples below.
  //     var tooltip = window.CreateTooltip();
  //     */

  //     Properties:
  //       Text; (string) (read, write)
  //       /*
  //       Example:
  //       tooltip.Text = "Whoop";
  //       */

  //       TrackActivate; (boolean) (write)

  //     Methods:
  //       Activate(); (void)
  //       /*
  //       Only do this when text has changed otherwise it will flicker

  //       Example:
  //       var text = "...";
  //       if (tooltip.Text != text) {
  //         tooltip.Text = text;
  //         tooltip.Activate();
  //       }
  //       */

  //       Deactivate(); (void)

  //       Dispose(); (void)

  //       GetDelayTime(type); (int)
  //       SetDelayTime(type, time); (void)
  //       // type. See flags.txt > Used in IFbTooltip.GetDelayTime() and IFbTooltip.SetDelayTime()

  //       SetMaxWidth(width); (void)
  //       /*
  //       Use if you want multi-line tooltips.

  //       Example:
  //       tooltip.SetMaxWidth(800);
  //       tooltip.Text = "Line1\nLine2";
  //       Use \n as a new line separator.
  //       */

  //       TrackPosition(x, y); (void)
  //       // Check x, y positions have changed from last time otherwise it will flicker
  //   }

  // window.GetColourCUI(type[, client_guid]); (uint)
  // window.GetColourDUI(type); (uint)

  // window.GetFontCUI(type[, client_guid]); (IGdiFont)
  // window.GetFontDUI(type); (IGdiFont)
  // /*
  // type:
  // See flags.txt > Used in window.GetFontXXX()
  // client_guid: default "".
  // See flags.txt > Used in GetFontCUI() as client_guid.
  // This returns null if the component was unable to determine your font.
  // To avoid errors when trying to use the font or access its properties, you
  // should use code something like this...

  // var font = window.GetFontDUI(0);
  // if (!font) {
  //   console.log("Unable to determine your default font. Using Segoe UI instead.");
  //   font = gdi.Font("Segoe UI", 12);
  // }
  // */

  // window.NotifyOthers(name, info); (void)
  // /*
  // name: string
  // info: all variable/array/object types should be supported
  // Listen for notifications in other panels using on_notify_data(name, info) {}
  // */

  // window.Reload(); (void)
  // // reload panel

  // force: boolean, default false.
  function Repaint(force?: boolean): void;

  // window.RepaintRect(x, y, w, h[, force]); (void)
  // /*
  // force: boolean, default false.

  // Use this instead of window.Repaint on frequently updated areas
  // such as time, bitrate, seekbar, etc.
  // */

  // window.SetCursor(id); (void)
  // /*
  // id: See flags.txt > Used in window.SetCursor()
  // This would usually be used inside the on_mouse_move callback. Use -1 if you want to hide the cursor.
  // */

  // window.GetProperty(name[, defaultval]); (VARIANT)
  // /*
  // name: string
  // defaultval: string, number, boolean
  // Get value of name from properties. If no value is present, defaultval will be stored and returned
  // */

  // window.SetProperty(name, val); (void)
  // /*
  // name: string
  // val: string, number, boolean
  // Set property value, if val is invalid/null, it is removed. Property values will be saved per panel instance and are
  // remembered between foobar2000 restarts.
  // */

  // window.ShowConfigure(); (void)
  // // Show configuration window of current panel.

  // window.ShowProperties(); (void)
  // // Show properties window of current panel.
}

declare enum PlaybackOrder {
  Default = 0,
  RepeatPlaylist = 1,
  RepeatTrack = 2,
  Random = 3,
  ShuffleTracks = 4,
  ShuffleAlbums = 5,
  ShuffleFolders = 6,
}

declare namespace plman {
  let PlaybackOrder: PlaybackOrder;
}
