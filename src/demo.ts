import {
  AnimationContext,
  Coordinates,
  CursorContext,
  FrameBuffer,
  RenderFunction,
} from './types';

const density = [' ', '░', '▒', '▓', '█'];

export const main: RenderFunction = (
  coord: Coordinates,
  context: AnimationContext,
  buffer: FrameBuffer,
  cursor: CursorContext,
) => {
  if (coord.x === cursor.col && coord.y === cursor.row) {
    return 'X';
  }
  return density[Math.floor(Math.random() * density.length)];
};
