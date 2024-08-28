import { RenderFunction } from './types';

const density = [' ', '░', '▒', '▓', '█'];

export const main: RenderFunction = (coord, context, cursor) => {
  console.log({ coord, context, cursor });
  console.log(context.frame);

  const { frame } = context;

  const index = frame % density.length;

  return density[index];
};
