import { RenderFunction } from './types';

const density = [' ', '░', '▒', '▓', '█'];

export const main: RenderFunction = (coord, context, cursor) => {
  if (coord.y === cursor.row && coord.x === cursor.col)
    return density[Math.floor(Math.random() * density.length)];

  return density[0];
};
