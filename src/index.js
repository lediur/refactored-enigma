//
//  Metropanel
//
//  A foobar2000 playback information panel for foo_wsh_panel_mod
//  inspired by the Metro Design Language.
//
//  Derrick Liu, 2011-2015, CC-BY

//  Initialization

//  System Helper Functions

AlbumArtId = {
  front: 0,
  back: 1,
  disc: 2,
  icon: 3,
};

var DT_TOP = 0x00000000;
var DT_LEFT = 0x00000000;
var DT_CENTER = 0x00000001;
var DT_RIGHT = 0x00000002;
var DT_VCENTER = 0x00000004;
var DT_BOTTOM = 0x00000008;
var DT_WORDBREAK = 0x00000010;
var DT_CALCRECT = 0x00000400;
var DT_NOPREFIX = 0x00000800;

function RGB(r, g, b) {
  return 0xff000000 | (r << 16) | (g << 8) | b;
}
function RGBA(r, g, b, a) {
  return (a << 24) | (r << 16) | (g << 8) | b;
}

function getAlpha(color) {
  return (color >> 24) & 0xff;
}
function getRed(color) {
  return (color >> 16) & 0xff;
}
function getGreen(color) {
  return (color >> 8) & 0xff;
}
function getBlue(color) {
  return color & 0xff;
}

function setAlpha(color, a) {
  return (color & 0x00ffffff) | (a << 24);
}
function setRed(color, r) {
  return (color & 0xff00ffff) | (r << 16);
}
function setGreen(color, g) {
  return (color & 0xffff00ff) | (g << 8);
}
function setBlue(color, b) {
  return (color & 0xffffff00) | b;
}

function clamp(x, l, h) {
  return x < l ? l : x > h ? h : x;
}

//  Global Variables

//  Managers and Functions
var displayManager;
var albumArtManager;
var shuffleStatus;
var MetadataArray;

//  Position Information
var ARTIST_X = 20;
var ARTIST_Y = 75;

var ALBUM_X = 20;
var ALBUM_Y = 110;

var ALBUMART_X = 20;
var ALBUMART_Y = 160;

var TITLE_X = 20;
var TITLE_Y = 340;

var TIMEP_X = 20;
var TIMEP_Y = 435;

var TIMET_X = 135;
var TIMET_Y = 435;

var META_X = 215;
var META_STARTINGY = 308;
var META_DELTA = 20;

//  Color Information
var C_BACKGROUND = RGB(240, 240, 240);
var C_FOREGROUND = RGB(10, 10, 10);
var C_ACCENT = RGB(0, 174, 255);
var C_SUBTLE = C_FOREGROUND & (100 << 24);
var C_ARTIST = C_FOREGROUND;
var C_ALBUM = C_FOREGROUND;
var C_TITLE = C_FOREGROUND;
var C_TIME = C_FOREGROUND;
var C_META = C_FOREGROUND;

// Font information
var normalFont = "Segoe UI";
var semiboldFont = "Segoe UI Semibold";
var semilightFont = "Segoe UI Semilight";

//  Timer
var timer;
var timerInterval;
var TIMER_INTERVAL_NORMAL = 100;
var TIMER_INTERVAL_ANIM = 1000 / 60;
var justStarted = true;

//  foobar Specific Variables
var playbackOrder;
var stubImagePath = fb.ProfilePath + "images\\metropanel\\stub.png";

//  DEBUGGING VARIABLES
var consoleEnabled = false;
var debugging = new Debugging();

//  Display Manager

var DisplayManager = (function() {
  function DisplayManager() {
    this.windowWidth = window.Width;
    this.windowHeight = window.Height;

    shuffleStatus = new ShuffleStatus();
    MetadataArray = MetadataInitialize();

    this.animationTimerEngaged = false;
  }

  DisplayManager.prototype.Paint = function(gr) {
    gr.SetTextRenderingHint(4);

    // Background fill
    gr.FillSolidRect(0, 0, this.windowWidth, this.windowHeight, C_BACKGROUND);

    if (MetadataArray) {
      for (var index in MetadataArray) {
        MetadataArray[index].evaledInfo = MetadataArray[index].Eval();
      }
    }

    // Draw metadata.
    if (MetadataArray) {
      //debugging.Trace("[DISPLAY SUBSYSTEM] Drawing MetadataArray: " + MetadataArray);
      for (var index in MetadataArray) {
        var alignment = 0;

        MetadataArray[index].Paint(gr);
      }
    }

    // Draw progress bar.
    if (fb.PlaybackTime > 0 && fb.playbackLength != 0) {
      gr.FillSolidRect(0, this.windowHeight - 5, fb.PlaybackTime / fb.PlaybackLength * this.windowWidth, 5, C_ACCENT);
    }

    // Draw the album art.
    if (albumArtManager) {
      albumArtManager.Paint(gr);
    }

    // DEBUGGING INFORMATION
    if (consoleEnabled) {
      debugging.Append((this.animationTimerEngaged ? "60" : "10") + " FPS");
      debugging.Append("PlaybackOrder: " + playbackOrder + ", CurrentShuffleIcon: " + shuffleStatus.Eval());

      debugging.Paint(gr);
    }
  };

  DisplayManager.prototype.StartAnimation = function() {
    if (!this.animationTimerEngaged) {
      debugging.Trace("[DISPLAY] Started isAnimating...");
      timer = window.SetInterval(on_timer, TIMER_INTERVAL_ANIM);
      this.animationTimerEngaged = true;
    }
  };

  DisplayManager.prototype.EndAnimation = function() {
    if (this.animationTimerEngaged) {
      debugging.Trace("[DISPLAY] Stopped isAnimating...");
      timer = window.SetInterval(on_timer, TIMER_INTERVAL_NORMAL);
      this.animationTimerEngaged = true;
    }
  };

  DisplayManager.prototype.AnimationLatch = function(isAnimating) {
    if (isAnimating && !this.AnimationTimerEngaged) {
      this.StartAnimation();
    } else if (!isAnimating && this.AnimationTimerEngaged) {
      this.StopAnimation();
    }
  };

  return DisplayManager;
})();

displayManager = new DisplayManager();

//  Animations
var Animation = (function() {
  function Animation(initX, initY, endX, endY, fade, initA, endA, easing) {
    this.initX = initX;
    this.initY = initY;
    this.endX = endX;
    this.endY = endY;
    this.fade = fade || false;
    this.initA = initA != 0 ? initA : 0;
    this.endA = endA != 255 ? endA : 255;
    this.easing = !easing ? easing : true;

    this.timer = 0;
    this.duration = 800 * 0.06;
    this.tick = 0.0;
  }

  Animation.prototype.X = function() {
    return this.endX - (this.endX - this.initX) * (1 - this.tick);
  };

  Animation.prototype.Y = function() {
    return this.endY - (this.endY - this.initY) * (1 - this.tick);
  };

  Animation.prototype.A = function() {
    return this.endA - (this.endA - this.initA) * (1 - this.tick);
  };

  Animation.prototype.Ease = function(t, b, c, d) {
    t /= d;
    t--;
    return c * (t * t * t + 1) + b;
  };

  // We perform an easing function to smoothly interpolate the time function
  // for the animation between init and end.
  Animation.prototype.Update = function() {
    this.tick = this.Ease(this.timer, 0.0, 1.0, this.duration);
    this.timer++;
    //debugging.Trace("[ANIMATION SUBSYSTEM] Updating tick. tick: " + this.tick);
    return this.tick != 1;
  };

  return Animation;
})();

var newAlbumArtAnimationIn = new Animation(500, ALBUMART_Y, ALBUMART_X, ALBUMART_Y);

var newAlbumArtAnimationOut = new Animation(ALBUMART_X, ALBUMART_Y, -380, ALBUMART_Y);

var newArtistAnimation = new Animation(-380, ARTIST_Y, ARTIST_X, ARTIST_Y, true);

var newAlbumAnimation = new Animation(-380, ALBUM_Y, ALBUM_X, ALBUM_Y, true);

var newTitleAnimation = new Animation(-380, TITLE_Y, TITLE_X, TITLE_Y, true);

//  Module Managers

function AlbumArtManager() {
  this.currentAlbumArt = new AlbumArtImage();
  this.previousAlbumArt = null;

  this.isAnimating = false;
  this.animationIn = newAlbumArtAnimationIn;
  this.animationOut = newAlbumArtAnimationOut;

  this.Paint = function(gr) {
    this.Animate();

    if (this.currentAlbumArt) {
      //debugging.Trace("[ALBUM ART MANAGER] Painting Current Album Art.");
      this.currentAlbumArt.Paint(gr);
    }

    if (this.previousAlbumArt && this.isAnimating) {
      //debugging.Trace("[ALBUM ART MANAGER] Painting Previous Album Art.");
      this.previousAlbumArt.Paint(gr);
    }

    if (consoleEnabled) {
      debugging.Append("ALBUM ART isAnimating: " + this.isAnimating);
    }
  };

  //  When a new song is played, we want to animate the old album art out
  //  and animate in the new album art.
  this.UpdateAlbumArt = function(metadb) {
    debugging.Trace("[ALBUM ART MANAGER] Update Album Art");
    //  Let's clone the AlbumArtImage object for the old song
    //  and place it in a buffer.
    this.previousAlbumArt = this.currentAlbumArt.Clone();

    //  Move the album art off frame to be animated in.
    this.currentAlbumArt.X = -180;

    if (this.previousAlbumArt) {
      debugging.Trace("[ALBUM ART MANAGER] Previous album art cloned.");
      this.previousAlbumArt.X = 20;

      this.isAnimating = true;

      this.animationIn.tick = 0;
      this.animationIn.timer = 0;

      this.animationOut.tick = 0;
      this.animationOut.timer = 0;
    }

    //  Now, load the AlbumArtImage for the current song. It will be
    //  updated asynchronously.
    this.currentAlbumArt.Load(metadb);
  };

  this.DoneUpdatingAlbumArt = function(metadb, art_id, image, image_path) {
    this.currentAlbumArt.UpdateAlbumArt(metadb, art_id, image, image_path);
  };

  this.Update = function() {
    if (this.isAnimating) {
      if (this.currentAlbumArt) {
        this.currentAlbumArt.X = this.animationIn.X();
      }

      if (this.previousAlbumArt) {
        this.previousAlbumArt.X = this.animationOut.X();
      }
    }
  };

  this.Animate = function() {
    if (this.isAnimating) {
      this.isAnimating = this.animationIn.Update();
      this.isAnimating = this.animationOut.Update();
    }

    this.currentAlbumArt.animateIn = this.isAnimating;
    this.previousAlbumArt.animateOut = this.isAnimating;

    displayManager.AnimationLatch(this.isAnimating);
    this.Update();
  };
}

var albumArtManager = new AlbumArtManager();

//  Objects

function AlbumArtImage() {
  this.albumArt = null;

  this.alpha = 255;
  (this.X = ALBUMART_X), (this.Y = ALBUMART_Y);

  this.animateIn = false;
  this.animateOut = false;

  var scaleW;
  var scaleH;
  this.scale = 0;

  this.Paint = function(gr) {
    if (this.albumArt) {
      gr.DrawImage(
        this.albumArt,
        this.X,
        this.Y,
        this.albumArt.Width,
        this.albumArt.Height,
        0,
        0,
        this.albumArt.Width,
        this.albumArt.Height,
        0,
        this.alpha
      );

      if (consoleEnabled) {
        gr.GdiDrawText(
          Math.floor(this.X) + " " + Math.floor(this.Y),
          gdi.Font("Consolas", 18, 0),
          C_TITLE,
          this.X + 10,
          this.Y + 150,
          this.albumArt.Width,
          this.albumArt.Height
        );
      }
    }
  };

  this.Load = function(metadb) {
    debugging.Trace("[ALBUM ART IMAGE] Load");
    // GetAlbumArtAsync will run in the background
    // When it's finished, on_get_album_art_done() will get called.
    if (metadb) utils.GetAlbumArtAsync(window.ID, metadb, AlbumArtId.front);
    this.albumArt = gdi.Image(fb.FoobarPath + "images\\metropanel\\stub.png");
  };

  this.Update = function() {};

  this.UpdateAlbumArt = function(metadb, art_id, image, image_path) {
    debugging.Trace("[ALBUM ART IMAGE] Received, ImagePath: " + image_path);
    if (image_path.length > 0) {
      debugging.Trace("[ALBUM ART IMAGE] Image Loaded");
      this.albumArt = image;
    } else {
      debugging.Trace("[ALBUM ART IMAGE] IMAGE MISSING, STUB AT " + stubImagePath);
      this.albumArt = gdi.Image(stubImagePath);
    }

    //  Keep aspect ratio
    if (this.albumArt) {
      scaleW = 180 / this.albumArt.Width;
      scaleH = 180 / this.albumArt.Height;
      this.scale = Math.min(scaleW, scaleH);

      if (scaleW < scaleH) {
        Y = (displayManager.windowWidth - this.albumArt.height * this.scale) / 2;
      } else if (scaleW > scaleH) {
        X = (displayManager.windowHeight - this.albumArt.Width * this.scale) / 2;
      }

      debugging.Trace("[ALBUM ART IMAGE] Processed");
      debugging.Trace("[ALBUM ART IMAGE]\tWidth: " + this.albumArt.Width + ", Height: " + this.albumArt.Height);
      debugging.Trace("[ALBUM ART IMAGE]\tScaleW: " + scaleW + ", ScaleH: " + scaleH + ", Scale: " + this.scale);
      debugging.Trace(
        "[ALBUM ART IMAGE]\tWidth *: " +
          this.albumArt.Width * this.scale +
          ", Height *: " +
          this.albumArt.Height * this.scale
      );
      debugging.Trace("[ALBUM ART IMAGE]\tAlpha: " + this.alpha);

      this.albumArt = this.albumArt.Resize(this.albumArt.Width * this.scale, this.albumArt.Height * this.scale);
    }
  };

  this.Animate = function() {};

  this.Clone = function() {
    var out = new AlbumArtImage();

    out.albumArt = this.albumArt;
    out.alpha = this.alpha;
    out.X = this.X;
    out.Y = this.Y;
    out.scale = this.scale;

    return out;
  };
}

function InfoString(
  _text,
  _initX,
  _initY,
  _initW,
  _initH,
  _fontFace,
  _fontSize,
  _fontStyle,
  _color,
  _animation,
  _dynamicInformation,
  _alignment
) {
  //debugging.Trace("[INFOSTRING] Initialize");
  this.isAnimating = false;

  this.Text = _text;
  //debugging.Trace("[INFOSTRING] Text: " + this.Text);

  this.X = _initX;
  this.Y = _initY;
  //debugging.Trace("[INFOSTRING] X: " + this.X + ", Y: " + this.Y);

  this.W = _initW;
  this.H = _initH;

  //debugging.Trace("[INFOSTRING] W: " + this.W + ", H: " + this.H);

  this.FontFace = _fontFace;
  this.FontSize = _fontSize;
  this.FontStyle = _fontStyle;

  //debugging.Trace("[INFOSTRING] FontFace: " + this.FontFace + ", FontSize: " + this.FontSize + ", FontStyle: " + this.FontStyle);

  this.Font = function() {
    return gdi.Font(this.FontFace, this.FontSize, this.FontStyle);
  };

  this.Color = _color;

  this.alignment = _alignment;
  var alignmentHex = 0;

  this.dynamicInfo = _dynamicInformation;
  this.evaledInfo = null;
  this.Eval = function() {
    switch (this.alignment) {
      case 0:
        alignmentHex = 0x01000000;
        break;
      case 1:
        alignmentHex = 0x11000000;
        break;
      case 2:
        alignmentHex = 0x21000000;
        break;
    }

    // DebugPane.Append("DynamicInfo: " + this.dynamicInfo);

    if (this.dynamicInfo != null) {
      var evalled = this.dynamicInfo.Eval();
      // debugging.Append("DynamicInfoEval: " + evalled);
      return evalled;
    } else {
      return null;
    }
  };

  this.Animation = _animation;

  this.Paint = function(gr) {
    this.Animate();

    gr.DrawString(this.Text, this.Font(), this.Color, this.X, this.Y, this.W, this.H, DT_WORDBREAK | alignmentHex);
  };

  //  When a new song is played, we want to animate the old album art out
  //  and animate in the new album art.
  this.Refresh = function() {
    debugging.Trace("[INFOSTRING " + this.Text + " + ] Refresh");

    //  Move the album art off frame to be animated in.
    this.X = -380;

    this.isAnimating = true;

    this.Animation.tick = 0;
    this.Animation.timer = 0;
  };

  this.Update = function() {
    if (this.Animation) {
      if (this.X != this.Animation.X()) {
        this.X = this.Animation.X();
      }

      if (this.Y != this.Animation.Y()) {
        this.Y = this.Animation.Y();
      }

      if (getAlpha(this.Color) != this.Animation.A()) {
        setAlpha(this.Color, this.Animation.A());
      }
    }

    if (this.evaledInfo != null) {
      this.Text = this.evaledInfo;
    }
  };

  this.Animate = function() {
    if (this.isAnimating) {
      this.isAnimating = this.Animation.Update();
    }

    this.Update();
  };
}

function ShuffleStatus() {
  // This method is to emulate functionality for the Eval() method used within InfoString to get
  // foobar dynamic info. We pass the shuffle icon in our Eval() method.

  this.Eval = function() {
    // Shuffle icons to be used:
    //  0: Sequential
    //  1: Repeat
    //  2: Shuffle
    var shuffleIcons = new Array("➔", "", "");
    var currentShuffleIcon;

    switch (playbackOrder) {
      case 2:
        currentShuffleIcon = shuffleIcons[1];
        break; // Repeat playback
      case 4:
        currentShuffleIcon = shuffleIcons[2];
        break; // Shuffle playback
      default:
        currentShuffleIcon = shuffleIcons[0];
        break; // Sequential playback
    }

    return currentShuffleIcon;
  };
}

function MetadataInitialize() {
  var SidebarTitleArray = new Array("SHUFFLE", "CODEC", "BITRATE", "SAMPRATE", "CHANNELS", "HEART");
  var SidebarFormatArray = new Array(
    shuffleStatus,
    fb.TitleFormat("%codec%"),
    fb.TitleFormat(
      "$if($strcmp(%__encoding%,lossy),%bitrate% kbps,$if(%__bitspersample%,%__bitspersample% bit,interpreted))"
    ),
    fb.TitleFormat(
      "$div(%samplerate%,1000)$ifgreater($cut($mod(%samplerate%,1000),1),0,.$cut($mod(%samplerate%,1000),1),) kHz"
    ),
    fb.TitleFormat("%channels%"),
    fb.TitleFormat("$repeat(♥, %LASTFM_LOVED_DB%)")
  );
  var MetadataArray = new Array();

  //  Artist
  MetadataArray[0] = new InfoString(
    "",
    ARTIST_X,
    ARTIST_Y,
    1999,
    60,
    normalFont,
    30,
    0,
    C_ARTIST,
    newArtistAnimation,
    fb.TitleFormat("%artist%"),
    0
  );

  //  Album
  MetadataArray[1] = new InfoString(
    "",
    ALBUM_X,
    ALBUM_Y,
    1999,
    50,
    normalFont,
    24,
    0,
    C_ALBUM,
    newAlbumAnimation,
    fb.TitleFormat("%album%"),
    0
  );

  //  Title
  MetadataArray[2] = new InfoString(
    "",
    TITLE_X,
    TITLE_Y,
    1999,
    50,
    normalFont,
    24,
    0,
    C_TITLE,
    newTitleAnimation,
    fb.TitleFormat("%title%"),
    0
  );

  //  Time Elapsed
  MetadataArray[3] = new InfoString(
    "0:00",
    TIMEP_X,
    TIMEP_Y,
    150,
    50,
    normalFont,
    20,
    0,
    C_TIME,
    null,
    fb.TitleFormat("%playback_time%"),
    0
  );

  //  Total time
  MetadataArray[4] = new InfoString(
    "-:--",
    TIMET_X,
    TIMET_Y,
    150,
    50,
    normalFont,
    20,
    0,
    C_ACCENT,
    null,
    fb.TitleFormat("%length%"),
    2
  );
  //  Remaining time
  MetadataArray[13] = new InfoString(
    "-:--",
    TIMET_X - 110,
    TIMET_Y,
    150,
    50,
    normalFont,
    20,
    0,
    C_SUBTLE,
    null,
    fb.TitleFormat("-%playback_time_remaining%"),
    2
  );
  var sidebarIndex = 0;
  //  Shuffle status
  MetadataArray[5 + sidebarIndex] = new InfoString(
    shuffleStatus,
    META_X,
    META_STARTINGY + META_DELTA * sidebarIndex - 5,
    350,
    50,
    "Segoe UI Symbol",
    18,
    0,
    C_ACCENT,
    null,
    SidebarFormatArray[sidebarIndex],
    0
  );

  for (sidebarIndex = 1; sidebarIndex < 7; sidebarIndex++) {
    MetadataArray[5 + sidebarIndex] = new InfoString(
      SidebarTitleArray[sidebarIndex],
      META_X,
      META_STARTINGY - META_DELTA * sidebarIndex - 10,
      100,
      50,
      normalFont,
      14,
      0,
      C_SUBTLE,
      null,
      SidebarFormatArray[sidebarIndex],
      0
    );
  }

  return MetadataArray;
}

//  DEBUGGING

function Debugging() {
  this.log = "";
  var lines = 0;
  var debugColor = RGBA(27, 161, 226, 255);
  var frameCounterColor = RGBA(255, 255, 255, 255);
  var framePos = 0;
  var enableTracing = false;

  this.Append = function(e) {
    this.log += e + "\n";
    lines++;
  };

  this.Paint = function(gr) {
    gr.FillSolidRect(0, 0, 300, 20 * lines, debugColor);
    gr.FillSolidRect(30 * framePos, 0, 30, 5, frameCounterColor);

    gr.GdiDrawText(this.log, gdi.Font("Consolas", 12, 0), C_TITLE, 10, 10, displayManager.windowWidth, 15 * lines);

    framePos = ++framePos % 10;

    this.log = "";
    lines = 0;
  };

  this.Trace = function(input) {
    if (enableTracing) {
      var timestampDate = new Date();

      var timestampHour = timestampDate.getHours();
      var timestampMinute = timestampDate.getMinutes();
      var timestampSecond = timestampDate.getSeconds();
      var timestampMSecond = timestampDate.getMilliseconds();
      var timestamp = timestampHour + ":" + timestampMinute + ":" + timestampSecond + "." + timestampMSecond;

      var coalesced = "[" + timestamp + "] " + input;

      console.log(coalesced);
    }
  };
}

//  Callbacks

function on_paint(gr) {
  displayManager.windowHeight = window.Height;
  displayManager.windowWidth = window.Width;

  displayManager.Paint(gr);
}

function on_size() {
  // debugging.Trace("[BASE] Resized, width: " + window.Width + ", height: " + window.Height);

  window.Repaint();
}

function on_key_up(key) {
  // 0xC0 is the tilde key.
  if (key == 0xc0) {
    consoleEnabled = !consoleEnabled;
  }
}

function on_playback_starting(cmd, paused) {
  if (justStarted) {
    justStarted = false;
  }
  timer = window.SetInterval(on_timer, timerInterval);
}

function on_playback_new_track(metadb) {
  for (var index in MetadataArray) {
    var alignment = 0;

    MetadataArray[index].evaledInfo = MetadataArray[index].Eval();
  }

  albumArtManager.UpdateAlbumArt(metadb);
  playbackOrder = fb.PlaybackOrder;
  CollectGarbage();
  window.Repaint();
}

function on_playback_order_changed(index) {
  playbackOrder = fb.PlaybackOrder;
}

function on_playback_pause(state) {}

function on_playback_stop() {
  window.Repaint();
}

function on_get_album_art_done(metadb, art_id, image, image_path) {
  albumArtManager.DoneUpdatingAlbumArt(metadb, art_id, image, image_path);
}

function on_mouse_wheel(delta) {
  if (fb.PlaybackOrder == 0 && delta == -1) fb.PlaybackOrder = 6;

  fb.PlaybackOrder += delta * 2;

  if (fb.PlaybackOrder > 4) fb.PlaybackOrder = 0;

  playbackOrder = fb.PlaybackOrder;
}

function on_timer() {
  window.Repaint();
}

on_playback_new_track(fb.GetNowPlaying());
