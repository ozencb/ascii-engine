import { RenderFunction } from './types';

const density = [' ', '░', '▒', '▓', '█'];

export const main: RenderFunction = (coord, context, buffer, cursor) => {
  return density[Math.floor(Math.random() * density.length)];
};
