//
//  Metropanel
//
//  A foobar2000 playback information panel for foo_wsh_panel_mod
//  inspired by the Metro Design Language.
//
//  Derrick Liu, 2011-2015, CC-BY

import { getAlpha, rgb, rgba, setAlpha } from './colors';
import { DT_WORDBREAK } from './types/flags';

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

const ALBUMART_MAX_DIM = 180;

//  Color Information
const C_BACKGROUND = rgb(240, 240, 240);
const C_FOREGROUND = rgb(10, 10, 10);
const C_ACCENT = rgb(0, 174, 255);
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
let timerInterval: number | null = null;
const TIMER_INTERVAL_ANIM = 1000 / 60;
let justStarted = true;

//  foobar Specific Variables
const stubImagePath = `${fb.ProfilePath}\\images\\metropanel\\stub.png`;

//  DEBUGGING VARIABLES

class Debugging {
  private log = '';
  private lines = 0;
  private debugColor = rgba(27, 161, 226, 255);
  private frameCounterColor = rgba(255, 255, 255, 255);
  private framePos = 0;
  private enableTracing = false;
  private frameCounter = 0;

  public Append(e: string) {
    this.log += `${e}\n`;
    // tslint:disable-next-line:no-increment-decrement
    this.lines++;
  }

  public Paint(gr: any) {
    const fps = timerInterval != null ? 1000 / timerInterval : 1;

    this.frameCounter++;

    const width = timerInterval != null ? 300 / fps : 300;
    gr.FillSolidRect(0, 0, 300, 20 * this.lines + 20, this.debugColor);
    gr.FillSolidRect(
      width * this.framePos,
      0,
      width,
      5,
      this.frameCounterColor
    );

    gr.GdiDrawText(
      fps,
      gdi.Font('Consolas', 8, 0),
      C_TITLE,
      5,
      10,
      displayManager.width,
      15 * this.lines
    );

    gr.GdiDrawText(
      this.frameCounter,
      gdi.Font('Consolas', 8, 0),
      C_TITLE,
      5,
      270,
      displayManager.width,
      15 * this.lines
    );

    gr.GdiDrawText(
      this.log,
      gdi.Font('Consolas', 12, 0),
      C_TITLE,
      10,
      10,
      displayManager.width,
      15 * this.lines
    );

    // tslint:disable-next-line:no-increment-decrement
    this.framePos = ++this.framePos % fps;

    this.log = '';
    this.lines = 0;
  }

  public Trace(input: string) {
    if (this.enableTracing) {
      const timestampDate = new Date();
      const coalesced = `[${timestampDate.toISOString()}] ${input}`;

      console.log(coalesced);
    }
  }
}

let consoleEnabled = false;
const debugging = new Debugging();

class ShuffleStatus {
  // This method is to emulate functionality for the Eval() method used within InfoString to get
  // foobar dynamic info. We pass the shuffle icon in our Eval() method.

  public Eval() {
    // Shuffle icons to be used:
    //  0: Sequential
    //  1: Repeat
    //  2: Shuffle
    const shuffleIcons = ['➔', '', ''];
    let currentShuffleIcon;

    switch (plman.PlaybackOrder) {
      case 2:
        currentShuffleIcon = shuffleIcons[1];
        break; // Repeat playback
      case 4:
        currentShuffleIcon = shuffleIcons[2];
        break; // Shuffle playback
      default:
        currentShuffleIcon = shuffleIcons[0];
      // Sequential playback
    }

    return currentShuffleIcon;
  }
}

// Lingering consts
const shuffleStatus = new ShuffleStatus();

//  Display Manager

class DisplayManager {
  public width: number;
  public height: number;
  private animationsInProgress: number;

  constructor() {
    this.width = window.Width;
    this.height = window.Height;
    this.animationsInProgress = 0;
  }

  public Paint(gr: any) {
    gr.SetTextRenderingHint(3);
    gr.SetSmoothingMode(4);

    // Background fill
    gr.FillSolidRect(0, 0, this.width, this.height, C_BACKGROUND);

    // Draw metadata.
    if (MetadataArray) {
      //debugging.Trace("[DISPLAY SUBSYSTEM] Drawing MetadataArray: " + MetadataArray);
      MetadataArray.forEach((elem, index) => elem.Paint(gr));
    }

    // Draw progress bar.
    if (fb.PlaybackTime > 0 && fb.PlaybackLength !== 0) {
      gr.FillSolidRect(
        0,
        this.height - 5,
        (fb.PlaybackTime / fb.PlaybackLength) * this.width,
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
      debugging.Append(`${this.animationsInProgress > 0 ? '60' : '10'} FPS`);
      debugging.Append(
        `PlaybackOrder: ${
          plman.PlaybackOrder
        }, CurrentShuffleIcon: ${shuffleStatus.Eval()}`
      );

      debugging.Paint(gr);
    }
  }

  public StartAnimation() {
    if (this.animationsInProgress === 0) {
      debugging.Trace('[DISPLAY] Started isAnimating latch...');

      if (timer != null) {
        window.ClearInterval(timer);
      }

      timer = window.SetInterval(on_timer, TIMER_INTERVAL_ANIM);
      timerInterval = TIMER_INTERVAL_ANIM;
    }

    this.animationsInProgress++;
  }

  public EndAnimation() {
    this.animationsInProgress--;

    if (this.animationsInProgress === 0) {
      debugging.Trace('[DISPLAY] Stopped isAnimating latch...');

      if (timer != null) {
        window.ClearInterval(timer);
      }
    }
  }
}

const displayManager = new DisplayManager();

interface AnimationOptions {
  startX?: number;
  startY?: number;
  x: number;
  y: number;
  startA?: number;
  endA?: number;
  fade?: boolean;
  ease?: boolean;
  duration?: number;
  delay?: number;
}

//  Animations
class Animation {
  private startX: number;
  private startY: number;
  private x: number;
  private y: number;
  private startA: number;
  private endA: number;
  private shouldFade: boolean;
  private shouldEase: boolean;
  private timer: number;
  private duration: number;
  private delay: number;
  private tick: number;

  constructor({
    x,
    y,
    startX = x,
    startY = y,
    startA = 0,
    endA = 255,
    fade = false,
    ease = true,
    duration = 500,
    delay = 0,
  }: AnimationOptions) {
    this.startX = startX;
    this.startY = startY;
    this.x = x;
    this.y = y;
    this.shouldFade = fade;
    this.startA = startA;
    this.endA = endA;
    this.shouldEase = ease;

    this.duration = Math.floor(duration / TIMER_INTERVAL_ANIM);
    this.delay = Math.floor(delay / TIMER_INTERVAL_ANIM);
    this.timer = 0 - this.delay;
    this.tick = 0;
    this.reset();
  }

  public reset() {
    this.timer = 0 - this.delay;
    this.tick = 0.0;
  }

  public X() {
    return this.x - (this.x - this.startX) * (1 - this.tick);
  }

  public Y() {
    return this.y - (this.y - this.startY) * (1 - this.tick);
  }

  public A() {
    return this.endA - (this.endA - this.startA) * (1 - this.tick);
  }

  private Ease(
    timerCount: number,
    start: number,
    rate: number,
    duration: number
  ) {
    if (timerCount >= 0) {
      const updatedTick = timerCount / duration - 1;
      return rate * (updatedTick * updatedTick * updatedTick + 1) + start;
    } else {
      // delayed
      return 0;
    }
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

const newArtistAnimation = new Animation({
  startX: 150,
  startY: ARTIST_Y,
  x: ARTIST_X,
  y: ARTIST_Y,
  fade: true,
});

const newAlbumAnimation = new Animation({
  startX: 150,
  startY: ALBUM_Y,
  x: ALBUM_X,
  y: ALBUM_Y,
  fade: true,
  delay: 75,
});

const newAlbumArtAnimationIn = new Animation({
  startX: 150,
  startY: ALBUMART_Y,
  x: ALBUMART_X,
  y: ALBUMART_Y,
  startA: 0,
  endA: 255,
  fade: true,
  delay: 150,
});

const newAlbumArtAnimationOut = new Animation({
  startX: ALBUMART_X,
  startY: ALBUMART_Y,
  x: -150,
  y: ALBUMART_Y,
  startA: 255,
  endA: 0,
  fade: true,
  delay: 150,
});

const newTitleAnimation = new Animation({
  startX: 150,
  startY: TITLE_Y,
  x: TITLE_X,
  y: TITLE_Y,
  fade: true,
  delay: 225,
});

class AlbumArtImage {
  private albumArt: GdiBitmap | null = null;

  public alpha = 255;
  public X = ALBUMART_X;
  public Y = ALBUMART_Y;

  public animateIn = false;
  public animateOut = false;

  private scaleW: number = 1;
  private scaleH: number = 1;
  private scale = 0;

  public Paint(gr: any) {
    if (this.albumArt != null) {
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
          `${Math.floor(this.X)} ${Math.floor(this.Y)}`,
          gdi.Font('Consolas', 18, 0),
          C_TITLE,
          this.X + 10,
          this.Y + 150,
          this.albumArt.Width,
          this.albumArt.Height
        );
      }
    }
  }

  public Load(metadb: FbMetadbHandle) {
    debugging.Trace('[ALBUM ART IMAGE] Load');
    // GetAlbumArtAsync will run in the background
    // When it's finished, on_get_album_art_done() will get called.
    if (metadb) {
      utils.GetAlbumArtAsync(window.ID, metadb, AlbumArtId.front);
    }
    this.albumArt = gdi.Image(`${fb.FoobarPath}\\images\\metropanel\\stub.png`);
  }

  public UpdateAlbumArt(
    metadb: FbMetadbHandle,
    art_id: any,
    image: any,
    image_path: any
  ) {
    debugging.Trace(`[ALBUM ART IMAGE] Received, ImagePath: ${image_path}`);
    if (image_path.length > 0) {
      debugging.Trace('[ALBUM ART IMAGE] Image Loaded');
      this.albumArt = image;
    } else {
      debugging.Trace(
        `[ALBUM ART IMAGE] IMAGE MISSING, STUB AT ${stubImagePath}`
      );
      this.albumArt = gdi.Image(stubImagePath);
    }

    //  Keep aspect ratio
    if (this.albumArt) {
      this.scaleW = ALBUMART_MAX_DIM / this.albumArt.Width;
      this.scaleH = ALBUMART_MAX_DIM / this.albumArt.Height;
      this.scale = Math.min(this.scaleW, this.scaleH);

      debugging.Trace('[ALBUM ART IMAGE] Processed');
      debugging.Trace(
        `[ALBUM ART IMAGE]\tWidth: ${this.albumArt.Width}, Height: ${
          this.albumArt.Height
        }`
      );
      debugging.Trace(
        `[ALBUM ART IMAGE]\tScaleW: ${this.scaleW}, ScaleH: ${
          this.scaleH
        }, Scale: ${this.scale}`
      );
      debugging.Trace(
        `[ALBUM ART IMAGE]\tWidth *: ${this.albumArt.Width *
          this.scale}, Height *: ${this.albumArt.Height * this.scale}`
      );
      debugging.Trace(`[ALBUM ART IMAGE]\tAlpha: ${this.alpha}`);

      this.albumArt = this.albumArt.Resize(
        this.albumArt.Width * this.scale,
        this.albumArt.Height * this.scale
      );
    }
  }

  public Clone() {
    const out = new AlbumArtImage();

    out.albumArt = this.albumArt;
    out.alpha = this.alpha;
    out.X = this.X;
    out.Y = this.Y;
    out.scale = this.scale;

    return out;
  }

  public Dispose() {
    if (this.albumArt) {
      this.albumArt.Dispose();
    }
  }
}

//  Module Managers

class AlbumArtManager {
  private currentAlbumArt = new AlbumArtImage();
  private previousAlbumArt: AlbumArtImage | null = null;

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
  public UpdateAlbumArt(metadb: FbMetadbHandle) {
    debugging.Trace('[ALBUM ART MANAGER] Update Album Art');
    //  Let's clone the AlbumArtImage object for the old song
    //  and place it in a buffer.
    this.previousAlbumArt = this.currentAlbumArt.Clone();

    if (this.previousAlbumArt != null) {
      debugging.Trace('[ALBUM ART MANAGER] Previous album art cloned.');

      this.isAnimating = true;
      displayManager.StartAnimation();
      this.animationIn.reset();
      this.animationOut.reset();
    }

    //  Now, load the AlbumArtImage for the current song. It will be
    //  updated asynchronously.
    this.currentAlbumArt.Load(metadb);
  }

  public DoneUpdatingAlbumArt(
    metadb: FbMetadbHandle,
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
        this.currentAlbumArt.Y = this.animationIn.Y();
        this.currentAlbumArt.alpha = this.animationIn.A();
      }

      if (this.previousAlbumArt) {
        this.previousAlbumArt.X = this.animationOut.X();
        this.previousAlbumArt.Y = this.animationOut.Y();
        this.previousAlbumArt.alpha = this.animationOut.A();
      }
    }
  }

  public Animate() {
    if (this.isAnimating) {
      const inAnimating = this.animationIn.Update();
      const outAnimating = this.animationOut.Update();

      if (!inAnimating && !outAnimating && this.previousAlbumArt) {
        // finished animating
        this.previousAlbumArt.Dispose();
        this.isAnimating = false;
        displayManager.EndAnimation();
      }
    }

    if (this.previousAlbumArt && this.currentAlbumArt) {
      this.currentAlbumArt.animateIn = this.isAnimating;
      this.previousAlbumArt.animateOut = this.isAnimating;
    }

    this.Update();
  }
}

const albumArtManager = new AlbumArtManager();

class InfoString {
  private isAnimating: boolean;
  private Text: string;
  private X: number;
  private Y: number;
  private W: number;
  private H: number;
  private FontFace: string;
  private FontSize: number;
  private FontStyle: FontStyleFlags;
  private Color: number;
  private dynamicInfo: Pick<FbTitleFormat, 'Eval'>;
  private Animation: Animation | null;
  private alignment: number;
  private alignmentHex: number = 0;

  constructor(
    _text: string,
    _initX: number,
    _initY: number,
    _initW: number,
    _initH: number,
    _fontFace: string,
    _fontSize: number,
    _fontStyle: FontStyleFlags,
    _color: number,
    _animation: Animation | null,
    _dynamicInformation: Pick<FbTitleFormat, 'Eval'>,
    _alignment: number
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

    this.Color = _color;
    this.dynamicInfo = _dynamicInformation;
    this.Animation = _animation;
    this.alignment = _alignment;

    switch (this.alignment) {
      case 0:
        this.alignmentHex = 0x01000000;
        break;
      case 1:
        this.alignmentHex = 0x11000000;
        break;
      case 2:
        this.alignmentHex = 0x21000000;
        break;
      default:
        this.alignmentHex = 0;
    }
  }
  private Font() {
    return gdi.Font(this.FontFace, this.FontSize, this.FontStyle);
  }

  public evaledInfo: string | null = null;
  public Eval() {
    if (this.dynamicInfo != null) {
      return this.dynamicInfo.Eval();
    } else {
      return null;
    }
  }

  public Paint(gr: any) {
    this.Animate();

    gr.DrawString(
      this.Text,
      this.Font(),
      this.Color,
      this.X,
      this.Y,
      this.W,
      this.H,
      DT_WORDBREAK | this.alignmentHex
    );
  }

  public ResetAnimation() {
    if (this.Animation != null) {
      debugging.Trace(`[INFOSTRING ${this.Text}] Refresh`);

      //  Move the album art off frame to be animated in.
      this.X = -380;

      this.isAnimating = true;
      displayManager.StartAnimation();

      this.Animation.reset();
    }
  }

  public Update() {
    if (this.Animation) {
      if (this.X !== this.Animation.X()) {
        this.X = this.Animation.X();
      }

      if (this.Y !== this.Animation.Y()) {
        this.Y = this.Animation.Y();
      }

      if (getAlpha(this.Color) !== this.Animation.A()) {
        this.Color = setAlpha(this.Color, this.Animation.A());
      }
    }

    if (this.evaledInfo != null) {
      this.Text = this.evaledInfo;
    }
  }

  public Animate() {
    if (this.isAnimating && this.Animation != null) {
      this.isAnimating = this.Animation.Update();

      if (!this.isAnimating) {
        displayManager.EndAnimation();
      }
    }

    this.Update();
  }
}

// tslint:disable-next-line:no-any
const MetadataArray: InfoString[] = MetadataInitialize();

function MetadataInitialize() {
  const SidebarTitleArray = [
    'SHUFFLE',
    'CODEC',
    'BITRATE',
    'SAMPRATE',
    'CHANNELS',
    'HEART',
  ];

  const SidebarFormatArray = [
    shuffleStatus,
    fb.TitleFormat('%codec%'),
    fb.TitleFormat(
      '$if($strcmp(%__encoding%,lossy),%bitrate% kbps,$if(%__bitspersample%,%__bitspersample% bit,interpreted))'
    ),
    fb.TitleFormat(
      '$div(%samplerate%,1000)$ifgreater($cut($mod(%samplerate%,1000),1),0,.$cut($mod(%samplerate%,1000),1),) kHz'
    ),
    fb.TitleFormat('%channels%'),
    fb.TitleFormat('$repeat(♥, %LASTFM_LOVED_DB%)'),
  ];

  // tslint:disable-next-line:no-unnecessary-local-variable
  const metadataArray = [
    new InfoString(
      'artist',
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
    ),
    new InfoString(
      'album',
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
    ),
    new InfoString(
      'title',
      TITLE_X,
      TITLE_Y,
      1999,
      50,
      semiboldFont,
      24,
      0,
      C_TITLE,
      newTitleAnimation,
      fb.TitleFormat('%title%'),
      0
    ),
    new InfoString(
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
    ),
    new InfoString(
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
    ),
    new InfoString(
      '',
      META_X,
      META_STARTINGY - 5,
      350,
      50,
      'Segoe UI Symbol',
      18,
      0,
      C_ACCENT,
      null,
      SidebarFormatArray[0],
      0
    ),
    new InfoString(
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
    ),
  ];

  // tslint:disable-next-line:no-increment-decrement
  for (let sidebarIndex = 1; sidebarIndex < 7; sidebarIndex++) {
    metadataArray.push(
      new InfoString(
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
      )
    );
  }

  return metadataArray;
}

function updateMetadata() {
  for (let i = 0; i < MetadataArray.length; i++) {
    MetadataArray[i].evaledInfo = MetadataArray[i].Eval();
  }
}

function trackInfoUpdated() {
  if (MetadataArray) {
    updateMetadata();
  }

  window.Repaint();
}

function on_timer() {
  window.Repaint();
}

function handlePaint(gr: GdiGraphics) {
  displayManager.height = window.Height;
  displayManager.width = window.Width;

  displayManager.Paint(gr);
}

function handleToggleConsole() {
  consoleEnabled = !consoleEnabled;
}

function handleStarting() {
  if (justStarted) {
    justStarted = false;
  }
}

function handleNewTrack(metadb: FbMetadbHandle) {
  albumArtManager.UpdateAlbumArt(metadb);
  MetadataArray.forEach(elem => elem.ResetAnimation());

  trackInfoUpdated();

  window.Repaint();
}

function handleAlbumArtLoaded(
  metadb: FbMetadbHandle,
  art_id: any,
  image: any,
  image_path: any
) {
  albumArtManager.DoneUpdatingAlbumArt(metadb, art_id, image, image_path);
}

function handleMouseWheel(delta: number) {
  if (plman.PlaybackOrder === 0 && delta === -1) {
    plman.PlaybackOrder = 6;
  }

  plman.PlaybackOrder += delta * 2;

  if (plman.PlaybackOrder > 4) {
    plman.PlaybackOrder = 0;
  }

  window.Repaint();
}

function handleTrackInfoUpdated() {
  trackInfoUpdated();
}

function handleKeyUp(key: number) {
  if (key === 0xc0) {
    handleToggleConsole();
  }
}

export const router: Partial<Callbacks> = {
  on_paint: handlePaint,
  on_key_up: handleKeyUp,
  on_playback_starting: handleStarting,
  on_playback_new_track: handleNewTrack,
  on_get_album_art_done: handleAlbumArtLoaded,
  on_mouse_wheel: handleMouseWheel,
  on_playback_dynamic_info: handleTrackInfoUpdated,
  on_playback_dynamic_info_track: handleTrackInfoUpdated,
  on_playback_time: handleTrackInfoUpdated,
};
