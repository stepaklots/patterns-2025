export enum PaddingAlign {
  left,
  right,
}

export type PaddingConfig = {
  name: string,
  length: number,
  align: PaddingAlign,
}

export const config: PaddingConfig[] = [
  {
    name: 'city',
    length: 18,
    align: PaddingAlign.left,
  },
  {
    name: 'population',
    length: 10,
    align: PaddingAlign.right,
  },
  {
    name: 'area',
    length: 8,
    align: PaddingAlign.right,
  },
  {
    name: 'density',
    length: 8,
    align: PaddingAlign.right,
  },
  {
    name: 'country',
    length: 18,
    align: PaddingAlign.right,
  },
  {
    name: '% max area',
    length: 6,
    align: PaddingAlign.right,
  },
];
