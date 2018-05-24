//
//  Metropanel
//
//  A foobar2000 playback information panel for foo_wsh_panel_mod
//  inspired by the Metro Design Language.
//
//  Derrick Liu, 2011-2015, CC-BY

//  Initialization

//  System Helper Functions

// TODO
/* tslint:disable:no-bitwise */
/* tslint:disable:no-any */

const AlbumArtId = {
  front: 0,
  back: 1,
  disc: 2,
  icon: 3,
};

function RGB(r: number, g: number, b: number): number {
  return 0xff000000 | (r << 16) | (g << 8) | b;
}
function RGBA(r: number, g: number, b: number, a: number): number {
  return (a << 24) | (r << 16) | (g << 8) | b;
}

function getAlpha(color: number): number {
  return (color >> 24) & 0xff;
}
function getRed(color: number): number {
  return (color >> 16) & 0xff;
}
function getGreen(color: number): number {
  return (color >> 8) & 0xff;
}
function getBlue(color: number): number {
  return color & 0xff;
}

function setAlpha(color: number, a: number): number {
  return (color & 0x00ffffff) | (a << 24);
}
function setRed(color: number, r: number): number {
  return (color & 0xff00ffff) | (r << 16);
}
function setGreen(color: number, g: number): number {
  return (color & 0xffff00ff) | (g << 8);
}
function setBlue(color: number, b: number): number {
  return (color & 0xffffff00) | b;
}

function clamp(num: number, low: number, high: number): number {
  if (num < low) {
    return low;
  } else if (num > high) {
    return high;
  } else {
    return num;
  }
}

//  Global Variables

//  Position Information
const ARTIST_X = 20;
const ARTIST_Y = 75;

const ALBUM_X = 20;
const ALBUM_Y = 110;

const ALBUMART_X = 20;
const ALBUMART_Y = 160;

const TITLE_X = 20;
const TITLE_Y = 340;

const TIMEP_X = 20;
const TIMEP_Y = 435;

const TIMET_X = 135;
const TIMET_Y = 435;

const META_X = 215;
const META_STARTINGY = 308;
const META_DELTA = 20;

//  Color Information
const C_BACKGROUND = RGB(240, 240, 240);
const C_FOREGROUND = RGB(10, 10, 10);
const C_ACCENT = RGB(0, 174, 255);
const C_SUBTLE = C_FOREGROUND & (100 << 24);
const C_ARTIST = C_FOREGROUND;
const C_ALBUM = C_FOREGROUND;
const C_TITLE = C_FOREGROUND;
const C_TIME = C_FOREGROUND;
const C_META = C_FOREGROUND;

// Font information
const normalFont = 'Segoe UI';
const semiboldFont = 'Segoe UI Semibold';
const semilightFont = 'Segoe UI Semilight';

//  Timer
let timer: TimerId | null = null;
const timerInterval: number | null = null;
const TIMER_INTERVAL_NORMAL = 100;
const TIMER_INTERVAL_ANIM = 1000 / 60;
const justStarted = true;

//  foobar Specific Variables
const stubImagePath = `${fb.ProfilePath}\\images\\metropanel\\stub.png`;

//  DEBUGGING VARIABLES
const consoleEnabled = false;
const debugging = new Debugging();

// Lingering consts
const shuffleStatus = new ShuffleStatus();
// tslint:disable-next-line:no-any
const MetadataArray: any[] = MetadataInitialize();

//  Display Manager

class DisplayManager {
  private width: number;
  private height: number;
  private animationTimerEngaged: boolean;

  constructor() {
    this.width = window.Width;
    this.height = window.Height;
    this.animationTimerEngaged = false;
  }

  public Paint(gr: any) {
    gr.SetTextRenderingHint(4);

    // Background fill
    gr.FillSolidRect(0, 0, this.width, this.height, C_BACKGROUND);

    if (MetadataArray) {
      for (const index of MetadataArray) {
        MetadataArray[index].evaledInfo = MetadataArray[index].Eval();
      }
    }

    // Draw metadata.
    if (MetadataArray) {
      //debugging.Trace("[DISPLAY SUBSYSTEM] Drawing MetadataArray: " + MetadataArray);
      for (const index of MetadataArray) {
        MetadataArray[index].Paint(gr);
      }
    }

    // Draw progress bar.
    if (fb.PlaybackTime > 0 && fb.PlaybackLength !== 0) {
      gr.FillSolidRect(
        0,
        this.height - 5,
        fb.PlaybackTime / fb.PlaybackLength * this.width,
        5,
        C_ACCENT
      );
    }

    // Draw the album art.
    if (albumArtManager) {
      albumArtManager.Paint(gr);
    }

    // DEBUGGING INFORMATION
    if (consoleEnabled) {
      debugging.Append((this.animationTimerEngaged ? '60' : '10') + ' FPS');
      debugging.Append(
        'PlaybackOrder: ' +
          plman.PlaybackOrder +
          ', CurrentShuffleIcon: ' +
          shuffleStatus.Eval()
      );

      debugging.Paint(gr);
    }
  }

  public StartAnimation() {
    if (!this.animationTimerEngaged) {
      debugging.Trace('[DISPLAY] Started isAnimating...');
      timer = window.SetInterval(on_timer, TIMER_INTERVAL_ANIM);
      this.animationTimerEngaged = true;
    }
  }

  public EndAnimation() {
    if (this.animationTimerEngaged) {
      debugging.Trace('[DISPLAY] Stopped isAnimating...');
      timer = window.SetInterval(on_timer, TIMER_INTERVAL_NORMAL);
      this.animationTimerEngaged = true;
    }
  }

  public AnimationLatch(isAnimating: boolean) {
    if (isAnimating && !this.animationTimerEngaged) {
      this.StartAnimation();
    } else if (!isAnimating && this.animationTimerEngaged) {
      this.EndAnimation();
    }
  }
}

const displayManager = new DisplayManager();

//  Animations
class Animation {
  private initX: number;
  private initY: number;
  private endX: number;
  private endY: number;
  private shouldFade: boolean;
  private initA: number;
  private endA: number;
  private shouldEase: boolean;
  private timer: number;
  private duration: number;
  private tick: number;

  constructor(
    initX: number,
    initY: number,
    endX: number,
    endY: number,
    shouldFade: boolean = false,
    initA: number = 0,
    endA: number = 255,
    shouldEase: boolean = true
  ) {
    this.initX = initX;
    this.initY = initY;
    this.endX = endX;
    this.endY = endY;
    this.shouldFade = shouldFade;
    this.initA = initA;
    this.endA = endA;
    this.shouldEase = shouldEase;

    this.timer = 0;
    this.duration = 800 * 0.06;
    this.tick = 0.0;
  }

  public reset() {
    this.tick = 0;
    this.timer = 0;
  }

  public X() {
    return this.endX - (this.endX - this.initX) * (1 - this.tick);
  }

  public Y() {
    return this.endY - (this.endY - this.initY) * (1 - this.tick);
  }

  private A() {
    return this.endA - (this.endA - this.initA) * (1 - this.tick);
  }

  private Ease(tick: number, start: number, rate: number, duration: number) {
    const updatedTick = tick / duration - 1;
    return rate * (updatedTick * updatedTick * updatedTick + 1) + start;
  }

  // We perform an easing function to smoothly interpolate the time function
  // for the animation between init and end.
  public Update() {
    this.tick = this.Ease(this.timer, 0.0, 1.0, this.duration);
    this.timer = this.timer + 1;
    //debugging.Trace("[ANIMATION SUBSYSTEM] Updating tick. tick: " + this.tick);
    return this.tick !== 1;
  }
}

const newAlbumArtAnimationIn = new Animation(
  500,
  ALBUMART_Y,
  ALBUMART_X,
  ALBUMART_Y
);

const newAlbumArtAnimationOut = new Animation(
  ALBUMART_X,
  ALBUMART_Y,
  -380,
  ALBUMART_Y
);

const newArtistAnimation = new Animation(
  -380,
  ARTIST_Y,
  ARTIST_X,
  ARTIST_Y,
  true
);

const newAlbumAnimation = new Animation(-380, ALBUM_Y, ALBUM_X, ALBUM_Y, true);

const newTitleAnimation = new Animation(-380, TITLE_Y, TITLE_X, TITLE_Y, true);

//  Module Managers

class AlbumArtManager {
  private currentAlbumArt = new AlbumArtImage();
  private previousAlbumArt: any | null = null;

  private isAnimating = false;
  private animationIn = newAlbumArtAnimationIn;
  private animationOut = newAlbumArtAnimationOut;

  public Paint(gr: any) {
    this.Animate();

    if (this.currentAlbumArt) {
      //debugging.Trace("[ALBUM ART MANAGER] Painting Current Album Art.");
      this.currentAlbumArt.Paint(gr);
    }

    if (this.previousAlbumArt != null && this.isAnimating) {
      //debugging.Trace("[ALBUM ART MANAGER] Painting Previous Album Art.");
      this.previousAlbumArt.Paint(gr);
    }

    if (consoleEnabled) {
      debugging.Append(`ALBUM ART isAnimating: ${this.isAnimating}`);
    }
  }

  //  When a new song is played, we want to animate the old album art out
  //  and animate in the new album art.
  private UpdateAlbumArt(metadb: any) {
    debugging.Trace('[ALBUM ART MANAGER] Update Album Art');
    //  Let's clone the AlbumArtImage object for the old song
    //  and place it in a buffer.
    this.previousAlbumArt = this.currentAlbumArt.Clone();

    //  Move the album art off frame to be animated in.
    this.currentAlbumArt.X = -180;

    if (this.previousAlbumArt != null) {
      debugging.Trace('[ALBUM ART MANAGER] Previous album art cloned.');
      this.previousAlbumArt.X = 20;

      this.isAnimating = true;

      this.animationIn.reset();
      this.animationOut.reset();
    }

    //  Now, load the AlbumArtImage for the current song. It will be
    //  updated asynchronously.
    this.currentAlbumArt.Load(metadb);
  }

  private DoneUpdatingAlbumArt(
    metadb: any,
    art_id: any,
    image: any,
    image_path: any
  ) {
    this.currentAlbumArt.UpdateAlbumArt(metadb, art_id, image, image_path);
  }

  public Update() {
    if (this.isAnimating) {
      if (this.currentAlbumArt) {
        this.currentAlbumArt.X = this.animationIn.X();
      }

      if (this.previousAlbumArt) {
        this.previousAlbumArt.X = this.animationOut.X();
      }
    }
  }

  public Animate() {
    if (this.isAnimating) {
      this.isAnimating = this.animationIn.Update();
      this.isAnimating = this.animationOut.Update();
    }

    this.currentAlbumArt.animateIn = this.isAnimating;
    this.previousAlbumArt.animateOut = this.isAnimating;

    displayManager.AnimationLatch(this.isAnimating);
    this.Update();
  }
}

const albumArtManager = new AlbumArtManager();

//  Objects

class AlbumArtImage {
  private albumArt = null;

  private alpha = 255;
  private X = ALBUMART_X;
  private Y = ALBUMART_Y);

  private animateIn = false;
  private animateOut = false;

  private scaleW: number;
  private scaleH: number;
  private scale = 0;

  public Paint(gr: any) {
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
          Math.floor(this.X) + ' ' + Math.floor(this.Y),
          gdi.Font('Consolas', 18, 0),
          C_TITLE,
          this.X + 10,
          this.Y + 150,
          this.albumArt.Width,
          this.albumArt.Height
        );
      }
    }
  };

  public Load(metadb: any) {
    debugging.Trace('[ALBUM ART IMAGE] Load');
    // GetAlbumArtAsync will run in the background
    // When it's finished, on_get_album_art_done() will get called.
    if (metadb) {
      utils.GetAlbumArtAsync(window.ID, metadb, AlbumArtId.front);
    }
    this.albumArt = gdi.Image(fb.FoobarPath + 'images\\metropanel\\stub.png');
  };

  public UpdateAlbumArt(metadb: any, art_id: any, image: any, image_path: any) {
    debugging.Trace('[ALBUM ART IMAGE] Received, ImagePath: ' + image_path);
    if (image_path.length > 0) {
      debugging.Trace('[ALBUM ART IMAGE] Image Loaded');
      this.albumArt = image;
    } else {
      debugging.Trace(
        '[ALBUM ART IMAGE] IMAGE MISSING, STUB AT ' + stubImagePath
      );
      this.albumArt = gdi.Image(stubImagePath);
    }

    //  Keep aspect ratio
    if (this.albumArt) {
      scaleW = 180 / this.albumArt.Width;
      scaleH = 180 / this.albumArt.Height;
      this.scale = Math.min(scaleW, scaleH);

      if (scaleW < scaleH) {
        Y = (displayManager.width - this.albumArt.height * this.scale) / 2;
      } else if (scaleW > scaleH) {
        X = (displayManager.height - this.albumArt.Width * this.scale) / 2;
      }

      debugging.Trace('[ALBUM ART IMAGE] Processed');
      debugging.Trace(
        '[ALBUM ART IMAGE]\tWidth: ' +
          this.albumArt.Width +
          ', Height: ' +
          this.albumArt.Height
      );
      debugging.Trace(
        '[ALBUM ART IMAGE]\tScaleW: ' +
          scaleW +
          ', ScaleH: ' +
          scaleH +
          ', Scale: ' +
          this.scale
      );
      debugging.Trace(
        '[ALBUM ART IMAGE]\tWidth *: ' +
          this.albumArt.Width * this.scale +
          ', Height *: ' +
          this.albumArt.Height * this.scale
      );
      debugging.Trace('[ALBUM ART IMAGE]\tAlpha: ' + this.alpha);

      this.albumArt = this.albumArt.Resize(
        this.albumArt.Width * this.scale,
        this.albumArt.Height * this.scale
      );
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
      const evalled = this.dynamicInfo.Eval();
      // debugging.Append("DynamicInfoEval: " + evalled);
      return evalled;
    } else {
      return null;
    }
  };

  this.Animation = _animation;

  this.Paint = function(gr) {
    this.Animate();

    gr.DrawString(
      this.Text,
      this.Font(),
      this.Color,
      this.X,
      this.Y,
      this.W,
      this.H,
      DT_WORDBREAK | alignmentHex
    );
  };

  //  When a new song is played, we want to animate the old album art out
  //  and animate in the new album art.
  this.Refresh = function() {
    debugging.Trace('[INFOSTRING ' + this.Text + ' + ] Refresh');

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
    let shuffleIcons = new Array('➔', '', '');
    let currentShuffleIcon;

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
  let SidebarTitleArray = new Array(
    'SHUFFLE',
    'CODEC',
    'BITRATE',
    'SAMPRATE',
    'CHANNELS',
    'HEART'
  );
  let SidebarFormatArray = new Array(
    shuffleStatus,
    fb.TitleFormat('%codec%'),
    fb.TitleFormat(
      '$if($strcmp(%__encoding%,lossy),%bitrate% kbps,$if(%__bitspersample%,%__bitspersample% bit,interpreted))'
    ),
    fb.TitleFormat(
      '$div(%samplerate%,1000)$ifgreater($cut($mod(%samplerate%,1000),1),0,.$cut($mod(%samplerate%,1000),1),) kHz'
    ),
    fb.TitleFormat('%channels%'),
    fb.TitleFormat('$repeat(♥, %LASTFM_LOVED_DB%)')
  );
  let MetadataArray = new Array();

  //  Artist
  MetadataArray[0] = new InfoString(
    '',
    ARTIST_X,
    ARTIST_Y,
    1999,
    60,
    normalFont,
    30,
    0,
    C_ARTIST,
    newArtistAnimation,
    fb.TitleFormat('%artist%'),
    0
  );

  //  Album
  MetadataArray[1] = new InfoString(
    '',
    ALBUM_X,
    ALBUM_Y,
    1999,
    50,
    normalFont,
    24,
    0,
    C_ALBUM,
    newAlbumAnimation,
    fb.TitleFormat('%album%'),
    0
  );

  //  Title
  MetadataArray[2] = new InfoString(
    '',
    TITLE_X,
    TITLE_Y,
    1999,
    50,
    normalFont,
    24,
    0,
    C_TITLE,
    newTitleAnimation,
    fb.TitleFormat('%title%'),
    0
  );

  //  Time Elapsed
  MetadataArray[3] = new InfoString(
    '0:00',
    TIMEP_X,
    TIMEP_Y,
    150,
    50,
    normalFont,
    20,
    0,
    C_TIME,
    null,
    fb.TitleFormat('%playback_time%'),
    0
  );

  //  Total time
  MetadataArray[4] = new InfoString(
    '-:--',
    TIMET_X,
    TIMET_Y,
    150,
    50,
    normalFont,
    20,
    0,
    C_ACCENT,
    null,
    fb.TitleFormat('%length%'),
    2
  );
  //  Remaining time
  MetadataArray[13] = new InfoString(
    '-:--',
    TIMET_X - 110,
    TIMET_Y,
    150,
    50,
    normalFont,
    20,
    0,
    C_SUBTLE,
    null,
    fb.TitleFormat('-%playback_time_remaining%'),
    2
  );
  let sidebarIndex = 0;
  //  Shuffle status
  MetadataArray[5 + sidebarIndex] = new InfoString(
    shuffleStatus,
    META_X,
    META_STARTINGY + META_DELTA * sidebarIndex - 5,
    350,
    50,
    'Segoe UI Symbol',
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
  this.log = '';
  let lines = 0;
  let debugColor = RGBA(27, 161, 226, 255);
  let frameCounterColor = RGBA(255, 255, 255, 255);
  let framePos = 0;
  let enableTracing = false;

  this.Append = function(e) {
    this.log += e + '\n';
    lines++;
  };

  this.Paint = function(gr) {
    gr.FillSolidRect(0, 0, 300, 20 * lines, debugColor);
    gr.FillSolidRect(30 * framePos, 0, 30, 5, frameCounterColor);

    gr.GdiDrawText(
      this.log,
      gdi.Font('Consolas', 12, 0),
      C_TITLE,
      10,
      10,
      displayManager.width,
      15 * lines
    );

    framePos = ++framePos % 10;

    this.log = '';
    lines = 0;
  };

  this.Trace = function(input) {
    if (enableTracing) {
      let timestampDate = new Date();

      let timestampHour = timestampDate.getHours();
      let timestampMinute = timestampDate.getMinutes();
      let timestampSecond = timestampDate.getSeconds();
      let timestampMSecond = timestampDate.getMilliseconds();
      let timestamp =
        timestampHour +
        ':' +
        timestampMinute +
        ':' +
        timestampSecond +
        '.' +
        timestampMSecond;

      let coalesced = '[' + timestamp + '] ' + input;

      console.log(coalesced);
    }
  };
}

//  Callbacks

function on_paint(gr) {
  displayManager.height = window.Height;
  displayManager.width = window.Width;

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
  for (let index in MetadataArray) {
    let alignment = 0;

    MetadataArray[index].evaledInfo = MetadataArray[index].Eval();
  }

  albumArtManager.UpdateAlbumArt(metadb);
  CollectGarbage();
  window.Repaint();
}

function on_playback_order_changed(index) {}

function on_playback_pause(state) {}

function on_playback_stop() {
  window.Repaint();
}

function on_get_album_art_done(metadb, art_id, image, image_path) {
  albumArtManager.DoneUpdatingAlbumArt(metadb, art_id, image, image_path);
}

function on_mouse_wheel(delta) {
  if (plman.PlaybackOrder == 0 && delta == -1) {
    plman.PlaybackOrder = 6;
  }

  plman.PlaybackOrder += delta * 2;

  if (plman.PlaybackOrder > 4) {
    plman.PlaybackOrder = 0;
  }
}

function on_timer() {
  window.Repaint();
}

on_playback_new_track(fb.GetNowPlaying());
