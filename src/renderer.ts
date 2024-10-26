import { Resolution, Nbsp, ScaleFactor } from './constants';
import { addPointerEvents, addWindowEvents } from './events';
import {
  Animation,
  AnimationContext,
  CursorContext,
  FrameBuffer,
  RenderOptions,
} from './types';

const createBaseSpanElement = () => {
  const span = document.createElement('span');
  span.style.display = 'block';
  span.style.fontFamily = 'monospace';
  span.style.fontSize = '16px';
  span.style.userSelect = 'none';
  span.style.overflow = 'hidden';
  span.style.lineHeight = '1';
  span.innerHTML = Nbsp;

  return span;
};

const createSpanElement = (context: AnimationContext) => {
  const { cellHeight } = context;

  const span = createBaseSpanElement();

  span.style.height = `${cellHeight}px`;
  span.style.fontSize = `${cellHeight}px`;
  span.innerHTML = Nbsp;

  return span;
};

export const calculateCellMetrics = (
  target: HTMLElement,
  resolution: Resolution,
): { rows: number; cols: number; cellHeight: number; cellWidth: number } => {
  const { height: targetHeight, width: targetWidth } =
    target.getBoundingClientRect();

  const tempEl = createBaseSpanElement();

  tempEl.style.visibility = 'hidden';
  tempEl.style.display = 'inline';
  target.appendChild(tempEl);

  const { height: baseHeight, width: baseWidth } =
    tempEl.getBoundingClientRect();
  target.removeChild(tempEl);

  const scale = resolution * ScaleFactor;

  const cellHeight = baseHeight / scale;
  const cellWidth = baseWidth / scale;

  const rows = targetHeight > 0 ? Math.floor(targetHeight / cellHeight) : 0;
  const cols = targetWidth > 0 ? Math.floor(targetWidth / cellWidth) : 0;

  return {
    rows,
    cols,
    cellHeight,
    cellWidth,
  };
};

const bootCursor = (
  target: HTMLElement,
  context: AnimationContext,
): CursorContext => {
  const cursor: CursorContext = {
    x: 0,
    y: 0,
    col: 0,
    row: 0,
    pressed: false,
  };

  addPointerEvents(target, context, cursor, target.getBoundingClientRect());

  return cursor;
};

export const bootElements = (
  target: HTMLElement,
  context: AnimationContext,
) => {
  // Reset target content
  target.innerHTML = '';

  for (let i = 0; i < context.rows; i++) {
    target.appendChild(createSpanElement(context));
  }
};

const bootContext = (target: HTMLElement, options: RenderOptions) => {
  const cellMetrics = calculateCellMetrics(target, options.resolution);

  const context: AnimationContext = {
    rows: cellMetrics.rows,
    cols: cellMetrics.cols,
    cellWidth: cellMetrics.cellWidth,
    cellHeight: cellMetrics.cellHeight,
    frame: 0,
    deltaTime: 0,
    elapsedTime: 0,
    options,
  };

  addWindowEvents(target, context, options);

  return context;
};

const getRowElement = (target: HTMLElement, row: number) => {
  return target.children[row] as HTMLSpanElement;
};

const processFrameBuffer = (
  target: HTMLElement,
  context: AnimationContext,
  frameBuffer: FrameBuffer,
) => {
  for (let i = 0; i < context.rows; i++) {
    const rowElement = getRowElement(target, i);
    if (!rowElement) continue;

    const rowContent: string[] = [];
    frameBuffer[i].forEach((char, j) => {
      rowContent[j] = char;
    });

    rowElement.innerHTML = rowContent.join('');
  }
};

const runAnimationLoop = (
  target: HTMLElement,
  context: AnimationContext,
  animation: Animation,
  cursor: CursorContext,
) => {
  let previousTimestamp = 0;
  const frameBuffer: FrameBuffer = [];

  function loop(timestamp: number) {
    context.deltaTime = (timestamp - previousTimestamp) / 1000;
    context.elapsedTime += context.deltaTime;
    previousTimestamp = timestamp;

    for (let i = 0; i < context.rows; i++) {
      if (!frameBuffer[i]) {
        frameBuffer[i] = Array(context.cols).fill(null);
      }
    }

    for (let i = 0; i < context.rows; i++) {
      for (let j = 0; j < context.cols; j++) {
        const coords = { x: j, y: i };
        const char = animation.main(coords, context, frameBuffer, cursor);

        frameBuffer[i][j] = !char || char === ' ' ? Nbsp : char;
      }
    }

    processFrameBuffer(target, context, [...frameBuffer]);
    frameBuffer.length = 0;
    context.frame++;

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
};

export const render = (
  target: HTMLElement | null,
  animation: Animation,
  options: RenderOptions = {
    resolution: Resolution.High,
  },
): void => {
  if (!target) throw new Error('Target element cannot be null');

  const context = bootContext(target, options);

  bootElements(target, context);
  const cursor = bootCursor(target, context);

  runAnimationLoop(target, context, animation, cursor);
};
