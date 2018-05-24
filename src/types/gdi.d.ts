interface GdiFont {
  /*
  This will be used in the examples below:
  var my_font = window.GetFontDUI(0);
  See flags.txt > FontTypeDUI
  */
  // Height (int) (read)
  // /*
  // Example:
  // console.log(my_font.Height); // 15
  // */
  // Name (string) (read)
  // /*
  // Example:
  // console.log(my_font.Name); // Segoe UI
  // */
  // Size (float) (read)
  // /*
  // Example:
  // console.log(my_font.Size); // 12
  // */
  // Style (int) (read)
  // /*
  // Example:
  // console.log(my_font.Style);
  // See flags.txt > FontStyle
  // */
  // Dispose(); (void)
  // /*
  // Example:
  // my_font.Dispose();
  // */
}

interface GdiBitmap {
  // Height (int) (read)
  // Width (int) (read)
  // ApplyAlpha(alpha); (IGdiBitmap)
  // // alpha: Valid values 0-255.
  // ApplyMask(img); (boolean)
  // // Changes will be saved in the current bitmap. See samples\basic\Apply Mask.txt
  // Clone(x, y, w, h); (IGdiBitmap)
  // CreateRawBitmap(); (IGdiRawBitmap)
  // // Create a DDB bitmap from IGdiBitmap, which is used in GdiDrawBitmap()
  //   interface IGdiRawBitmap {
  //     Properties:
  //       Width; (int) (read)
  //       Height; (int) (read)
  //     Methods:
  //       Dispose(); (void)
  //   }
  // Dispose(); (void)
  // GetColourScheme(max_count); (VBArray)
  // // Returns a VBArray so you need to use .toArray() on the result.
  // GetColourSchemeJSON(max_count); (string)
  // /*
  // Returns a JSON array in string form so you need to use JSON.parse() on the result.
  // Each entry in the array is an object which contains colour and frequency values.
  // Uses a different method for calculating colours than GetColourScheme.
  // Image is automatically resized during processing for performance reasons so there's no
  // need to resize before calling the method.
  // Example:
  // img = ... // use utils.GetAlbumArtV2 / gdi.Image / etc
  // colours = JSON.parse(img.GetColourSchemeJSON(5));
  // console.log(colours[0].col); // -4194304
  // console.log(colours[0].freq); // 0.34
  // console.log(toRGB(colours[0].col)); // [192, 0, 0]
  // See docs\helpers.txt for "toRGB" function.
  // */
  // GetGraphics();
  // // Don't forget to use ReleaseGraphics() after operations on IGdiGraphics interface is done.
  // ReleaseGraphics(IGdiGraphics); (IGdiGraphics)
  // Resize(w, h[, mode]); (IGdiBitmap)
  // // mode: default 0. See flags.txt > InterpolationMode
  // RotateFlip(mode); (void)
  // // mode. See flags.txt > RotateFlipType
  // SaveAs(path[, format]); (boolean)
  // /*
  // path: Full path including file extension. The parent folder must already exist.
  // format:
  // "image/png" (default if omitted)
  // "image/bmp"
  // "image/jpeg"
  // "image/gif"
  // "image/tiff"
  // Example:
  // var img = utils.GetAlbumArtEmbedded(fb.GetFocusItem().RawPath, 0);
  // if (img)
  //   img.SaveAs("D:\\export.jpg", "image/jpeg");
  // */
  // StackBlur(radius); (void)
  // // radius: Valid values 2-254. See samples\basic\StackBlur (image).txt, samples\basic\StackBlur (text).txt
}

declare enum FontStyleFlags {
  Regular = 0,
  Bold = 1,
  Italic = 2,
  BoldItalic = 3,
  Underline = 4,
  Strikeout = 8,
}

declare namespace gdi {
  // gdi.CreateImage(w, h); (IGdiBitmap)

  function Font(name: string, sizeInPx: number, style: FontStyleFlags): GdiFont;
  /*
    size_px: See helpers.txt > Point2Pixel function for conversions.
    style: default 0. See flags.txt > FontStyle
    Returns null if font not present.
    */

  function Image(path: string): GdiBitmap;
  /*
    Example:
    var img = gdi.Image("e:\\images folder\\my_image.png");
    Returns null if path doesn't exist/image fails to load.
    */

  //   gdi.LoadImageAsync(window_id, path); (uint)
  //   /*
  //   window_id: window.ID
  //   Returns a unique id.
  //   */
}
