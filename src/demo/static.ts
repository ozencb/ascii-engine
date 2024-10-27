import { Animation } from '../types';

const density = [' ', '░', '▒', '▓', '█'];

export const Static: Animation = () => {
  return density[Math.floor(Math.random() * density.length)];
};
