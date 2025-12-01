declare module 'culori' {
  type CuloriColor = Record<string, unknown> | undefined;

  interface CuloriRgb {
    r: number;
    g: number;
    b: number;
    alpha?: number;
  }

  export function parse(color: string): CuloriColor;
  export function converter(mode: 'rgb'): (color: CuloriColor) => CuloriRgb | undefined;
}
