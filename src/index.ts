import * as legacy from './legacy';

callbacks.on_paint = (gr: GdiGraphics) => {
  legacy.handlePaint(gr);
};

callbacks.on_key_up = (key: any) => {
  // 0xC0 is the tilde key.
  if (key === 0xc0) {
    legacy.handleToggleConsole();
  }
};

callbacks.on_playback_starting = (cmd: any, paused: boolean) => {
  legacy.handleStarting();
};

callbacks.on_playback_new_track = (metadb: FbMetadbHandle) => {
  legacy.handleNewTrack(metadb);
};

callbacks.on_get_album_art_done = (
  metadb: FbMetadbHandle,
  art_id: any,
  image: any,
  image_path: any
) => {
  legacy.handleAlbumArtLoaded(metadb, art_id, image, image_path);
};

callbacks.on_mouse_wheel = (delta: number) => {
  legacy.handleMouseWheel(delta);
};

callbacks.on_playback_dynamic_info = () => {
  legacy.handleTrackInfoUpdated();
};

callbacks.on_playback_dynamic_info_track = () => {
  legacy.handleTrackInfoUpdated();
};

callbacks.on_playback_time = () => {
  legacy.handleTrackInfoUpdated();
};

callbacks.on_playback_new_track(fb.GetNowPlaying());
