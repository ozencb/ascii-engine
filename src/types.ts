export type AnimationContext = {
  rows: number;
  cols: number;
  cellWidth: number;
  cellHeight: number;
  frame: number;
  deltaTime: number;
  elapsedTime: number;
  options: RenderOptions;
};

export type CursorContext = {
  x: number;
  y: number;
  col: number;
  row: number;
  pressed: boolean;
};

export type Coordinates = {
  x: number;
  y: number;
  idx: number; // buffer index
};

export type RenderFunction = (
  coords: Coordinates,
  ctx: AnimationContext,
  cursor: CursorContext,
) => string | null;

export type Animation = {
  main: RenderFunction;
  pre?: RenderFunction;
  post?: RenderFunction;
};
export type RenderOptions = {
  resolution: number;
};
