export type RenderFunction = () => void;
export type Animation = {
  main: RenderFunction;
  pre?: RenderFunction;
  post?: RenderFunction;
};
export type RenderOptions = {
  resolution: number;
};
