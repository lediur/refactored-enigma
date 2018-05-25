export function clamp(num: number, low: number, high: number): number {
  if (num < low) {
    return low;
  } else if (num > high) {
    return high;
  } else {
    return num;
  }
}
