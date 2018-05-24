declare namespace utils {
  // function Version (uint) (read)
  /*
    New in v1.2.0. Returns a 4 digit number corresponding to the version.

    v1.2.0 -> 1200
    v1.2.1 -> 1210

    If you try and access this in older components where it doesn't exist, the script will
    crash so you can do a check like this.

    if (!("Version" in utils)) {
      fb.ShowPopupMessage("Current component version is less than v1.2.0. This script requires vX.X.X");
    } else {
      // Check the actual version.
    }
    */
  // function CheckComponent(name[, is_dll]); (boolean)
  /*
    is_dll: boolean, default true.
    If true, method checks filename as well as the internal name.

    Example:
    console.log(utils.CheckComponent("foo_playcount", true));
    */
  // function CheckFont(name); (boolean)
  /*
    name: Can be either in English or the localised name in your OS.
    This only checks for fonts that are actually installed. It cannot detect fonts
    loaded by foo_ui_hacks and always returns false. However, gdi.Font can use those fonts.
    */
  // function ColourPicker(window_id, default_colour); (int)
  /*
    Spawns a windows popup dialog to let you choose a colour.
    window_id: window.ID

    Example:
    var colour = utils.ColourPicker(window.ID, RGB(255, 0, 0));
    See docs\helpers.txt for RGB function.
    */
  // function FileTest(path, mode); (VARIANT)
  /*
    mode:
    "chardet"
    Guess the charset of a file and return the codepage. It may not be accurate and returns 0 if an error occurred.

    "e"
    If file path exists, return true.

    "s"
    Retrieve file size, in bytes.

    "d"
    If path is a directory, return true.

    "split"
    Returns a VBArray so you need to use .toArray() on the result.

    Example:
    var arr = utils.FileTest("D:\\Somedir\\Somefile.txt", "split").toArray();
    arr[0] <= "D:\\Somedir\\" (always includes backslash at the end)
    arr[1] <= "Somefile"
    arr[2] <= ".txt"
    */
  // function FormatDuration(seconds) (string)
  /*
    Example:
    console.log(utils.FormatDuration(plman.GetPlaylistItems(plman.ActivePlaylist).CalcTotalDuration())); // 1wk 1d 17:25:30
    */
  // function FormatFileSize(bytes) (string)
  /*
    Example:
    console.log(utils.FormatFileSize(plman.GetPlaylistItems(plman.ActivePlaylist).CalcTotalSize())); // 7.9 GB
    */
  function GetAlbumArtAsync(
    window_id: FbTodo,
    handle: FbMetadbHandle,
    art_id?: any,
    need_stub?: boolean,
    only_embed?: boolean,
    no_load?: boolean
  ): number;
  /*
    window_id: window.ID
    art_id: default 0. See flags.txt > AlbumArtId
    need_stub: boolean, default true.
    only_embed: boolean, default false.
    no_load: boolean, default false. If true, "image" parameter will be null in on_get_album_art_done callback.
    See samples\basic\GetAlbumArtAsync.txt
    */
  // function GetAlbumArtEmbedded(rawpath[, art_id]); (IGdiBitmap)
  /*
    art_id: default 0. See flags.txt > AlbumArtId

    Example:
    var img = utils.GetAlbumArtEmbedded(fb.GetNowPlaying().RawPath, 0);
    */
  // function GetAlbumArtV2(handle[, art_id][, need_stub]); (IGdiBitmap)
  /*
    art_id: default 0. See flags.txt > AlbumArtId
    need stub: boolean, default true.
    See samples\basic\GetAlbumArtV2.txt
    */
  // function GetSysColour(index); (uint)
  /*
    index: http://msdn.microsoft.com/en-us/library/ms724371%28VS.85%29.aspx

    Example:
    var splitter_colour = utils.GetSysColour(15);
    Returns 0 if failed.
    */
  // function GetSystemMetrics(index); (int)
  /*
    index: http://msdn.microsoft.com/en-us/library/ms724385%28VS.85%29.aspx
    Returns 0 if failed.
    */
  // function Glob(pattern[, exc_mask][, inc_mask]); (VBArray)
  /*
    exc_mask: default FILE_ATTRIBUTE_DIRECTORY
    See flags.txt > Used in utils.Glob()
    inc_mask: default 0xffffffff
    Returns a VBArray so you need to use .toArray() on the result.

    Example:
    var arr = utils.Glob("C:\\*.*").toArray();
    */
  // function IsKeyPressed(vkey); (boolean)
  /*
    vkey: http://msdn.microsoft.com/en-us/library/ms927178.aspx
    Some are defined in flags.txt > Used with utils.IsKeyPressed()
    */
  // function MapString(text, lcid, flags); (string)
  // function PathWildcardMatch(pattern, str); (boolean)
  // Using Microsoft MS-DOS wildcards match type. eg "*.txt", "abc?.tx?"
  // function ReadTextFile(filename[, codepage]); (string)
  /*
    codepage: default 0. See codepages.txt
    If codepage is 0, text file can be UTF16-BOM, UTF8-BOM or ANSI.

    Example:
    var text = utils.ReadTextFile("E:\\some text file.txt");
    */
  // function ReadINI(filename, section, key[, defaultval]); (string)
  /*
    An INI file should like this:

    [section]
    key=val

    This only returns up to 255 characters per value.

    Example:
    var username = utils.ReadINI("e:\\my_file.ini", "Last.fm", "username");
    */
  // function WriteINI(filename, section, key, val); (boolean)
  /*
    Example:
    // function WriteINI("e:\\my_file.ini", "Last.fm", "username", "Bob");
    */
  // function WriteTextFile(filename, content[, write_bom]); (boolean)
  /*
    write_bom: boolean, default true.
    The parent folder must already exist.

    Example:
    // function WriteTextFile("z:\\1.txt", "test"); // write_bom missing but defaults to true, resulting file is UTF8-BOM
    // function WriteTextFile("z:\\2.txt", "test", true); // resulting file is UTF8-BOM
    // function WriteTextFile("z:\\3.txt", "test", false); // resulting file is UTF8 without BOM
    */
}
