declare module 'svg2ttf' {
  export default function svg2ttf(svgFont: string, options?: object): { buffer: ArrayBuffer };
}
declare module 'ttf2woff' {
  export default function ttf2woff(ttf: Uint8Array, options?: object): { buffer: ArrayBuffer };
}
