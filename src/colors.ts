export function rgb(r: number, g: number, b: number): number {
  return 0xff000000 | (r << 16) | (g << 8) | b;
}

export function rgba(r: number, g: number, b: number, a: number): number {
  return (a << 24) | (r << 16) | (g << 8) | b;
}

export function getAlpha(color: number): number {
  return (color >> 24) & 0xff;
}

export function getRed(color: number): number {
  return (color >> 16) & 0xff;
}

export function getGreen(color: number): number {
  return (color >> 8) & 0xff;
}

export function getBlue(color: number): number {
  return color & 0xff;
}

export function setAlpha(color: number, a: number): number {
  return (color & 0x00ffffff) | (a << 24);
}

export function setRed(color: number, r: number): number {
  return (color & 0xff00ffff) | (r << 16);
}

export function setGreen(color: number, g: number): number {
  return (color & 0xffff00ff) | (g << 8);
}

export function setBlue(color: number, b: number): number {
  return (color & 0xffffff00) | b;
}
