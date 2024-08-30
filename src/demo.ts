import { RenderFunction } from './types';

const density = [' ', '░', '▒', '▓', '█'];

export const main: RenderFunction = (coord, context, cursor) => {
  const { frame } = context;

  const index = frame % density.length;

  console.log(cursor.col, coord.x);

  if (coord.y === cursor.row && coord.x === cursor.col) return density[4];

  return density[0];

  //  return density[Math.floor(Math.random() * density.length)];
};
