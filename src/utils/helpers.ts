export class helpers {
  static times(n: number, block: (i: number) => string): string {
    let accum = "";
    for (let i = 0; i < n; i++) accum += block(i);
    return accum;
  }

  static for(from = 0, to = 0, incr = 1, block: (i: number) => string): string {
    let accum = "";
    for (let i = from; i < to; i += incr) accum += block(i);
    return accum;
  }
}
