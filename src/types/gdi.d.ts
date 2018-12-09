declare interface GdiFont {
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

declare interface GdiBitmap {
  Height: number;
  Width: number;
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
  Resize(w: number, h: number, mode?: InterpolationMode): GdiBitmap;
  // mode: default 0. See flags.txt > InterpolationMode
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

declare enum InterpolationMode {
  Invalid = -1,
  Default = 0,
  LowQuality = 1,
  HighQuality = 2,
  Bilinear = 3,
  Bicubic = 4,
  NearestNeighbor = 5,
  HighQualityBilinear = 6,
  HighQualityBicubic = 7,
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

interface GdiGraphics {
  /*
  Typically used inside on_paint(gr)
  There are many different ways to get colours.
  Use window.GetColourDUI/window.GetColourCUI,
  RGB function from helpers.txt, utils.ColourPicker,
  etc.
  */
  // CalcTextHeight(str, IGdiFont); (uint)
  // // This will only calulate the text height of one line.
  // CalcTextWidth(str, IGdiFont); (uint)
  // DrawEllipse(x, y, w, h, line_width, colour); (void)
  // DrawImage(IGdiBitmap, dstX, dstY, dstW, dstH, srcX, srcY, srcW, srcH[, angle][, alpha]); (void)
  // /*
  // angle: default 0
  // alpha: default 255. Valid values 0-255.
  // */
  // DrawLine(x1, y1, x2, y2, line_width, colour); (void)
  // DrawPolygon(colour, line_width, points); (void)
  // // points: An array.
  // DrawString(str, IGdiFont, colour, x, y, w, h[, flags]); (void)
  // // flags: default 0. See flags.txt > StringFormatFlags
  // DrawRect(x, y, w, h, line_width, colour); (void)
  // DrawRoundRect(x, y, w, h, arc_width, arc_height, line_width, colour); (void)
  // EstimateLineWrap(str, IGdiFont, max_width); (VBArray)
  // /*
  // returns a VBArray so you need to use .toArray() on the result.
  // index | meaning
  // [0] text line 1
  // [1] width of text line 1 (in pixel)
  // [2] text line 2
  // [3] width of text line 2 (in pixel)
  // ...
  // [2n + 2] text line n
  // [2n + 3] width of text line n (px)
  // */
  // FillEllipse(x, y, w, h, colour); (void)
  // FillGradRect(x, y, w, h, angle, colour1, colour2[, focus]); (void)
  // /*
  // focus: default 1. Valid values between 0 and 1.
  // Specify where the centred colour will be at its highest intensity.
  // NOTE: This may appear buggy depending on rectangle size. The easiest fix is
  // to adjust the "angle" by a degree or two.
  // */
  // FillPolygon(colour, fillmode, points); (void)
  // // fillmode: 0 alternate, 1 winding.
  // // points: An array.
  // FillRoundRect(x, y, w, h, arc_width, arc_height, colour); (void)
  // FillSolidRect(x, y, w, h, colour); (void)
  // GdiAlphaBlend(IGdiRawBitmap, dstX, dstY, dstW, dstH, srcX, srcY, srcW, srcH[, alpha]); (void)
  // // alpha: default 255. Valid values 0-255.
  // GdiDrawBitmap(IGdiRawBitmap, dstX, dstY, dstW, dstH, srcX, srcY, srcW, srcH); (void)
  // // Always faster than DrawImage, does not support alpha channel.
  // GdiDrawText(str, IGdiFont, colour, x, y, w, h[, format]); (VBArray)
  // /*
  // format: default 0. See flags.txt > DT_*
  // Returns a VBArray so you need to use .toArray() on the result.
  // index | meaning
  // [0] left   (DT_CALCRECT)
  // [1] top    (DT_CALCRECT)
  // [2] right  (DT_CALCRECT)
  // [3] bottom (DT_CALCRECT)
  // [4] characters drawn
  // */
  // MeasureString(str, IGdiFont, x, y, w, h[, flags]); (IMeasureStringInfo)
  // // flags: default 0. See flags.txt > StringFormatFlags
  //   interface IMeasureStringInfo {
  //     Properties:
  //       chars; (int) (read)
  //       Height; (float) (read)
  //       lines; (int) (read)
  //       x; (float) (read)
  //       y; (float) (read)
  //       Width; (float) (read)
  //       /*
  //       Example:
  //       // ==PREPROCESSOR==
  //       // @import "%fb2k_component_path%docs\flags.txt"
  //       // @import "%fb2k_component_path%docs\helpers.txt"
  //       // ==/PREPROCESSOR==
  //       var sf = StringFormat(StringAlignment.Near, StringAlignment.Near);
  //       var text = utils.ReadTextFile("z:\\info.txt");
  //       var font = window.GetFontDUI(0);
  //       function on_paint(gr) {
  //         gr.DrawString(text, font, RGB(255, 0, 0), 0, 0, window.Width, window.Height, sf);
  //         var temp = gr.MeasureString(text, font, 0, 0, window.Width, 10000, sf);
  //         // If we want to calculate height, we must set the height to be far larger than what
  //         // the text could possibly be.
  //         console.log(temp.Height); // 2761.2421875 // far larger than my panel height!
  //         console.log(temp.Chars); // 7967
  //       }
  //       */
  //   }
  // SetInterpolationMode(mode); (void)
  // // mode: default 0. See flags.txt > InterpolationMode
  // SetSmoothingMode(mode); (void)
  // // mode: default 0. See flags.txt > SmoothingMode
  // SetTextRenderingHint(mode); (void)
  // // mode: default 0. See flags.txt > TextRenderingHint
}
