import { Resolution } from './constants';
import { addPointerEvents, addWindowEvents } from './events';
import {
  Animation,
  AnimationContext,
  CursorContext,
  FrameBuffer,
  RenderOptions,
} from './types';

const createSpanElement = (targetHeight: number, rows: number) => {
  const calculatedHeight = Math.floor(targetHeight / rows);

  const span = document.createElement('span');
  span.style.display = 'block';
  span.style.height = calculatedHeight + 'px';
  span.style.fontFamily = 'monospace';
  span.style.fontSize = calculatedHeight + 'px';
  span.style.userSelect = 'none';
  span.style.overflow = 'hidden';
  span.style.lineHeight = '1';
  span.innerHTML = '&nbsp;';

  return span;
};

export const calculateCellMetrics = (
  target: Element,
  resolution: Resolution,
): { rows: number; cols: number; cellHeight: number; cellWidth: number } => {
  const { height: targetHeight, width: targetWidth } =
    target.getBoundingClientRect();

  // temp element for getting real block height
  const tempEl = createSpanElement(targetHeight, resolution);

  tempEl.style.visibility = 'hidden';
  tempEl.style.display = 'inline';
  target.appendChild(tempEl);
  const { height: textHeight, width: textWidth } =
    tempEl.getBoundingClientRect();
  target.removeChild(tempEl);

  return {
    rows: targetHeight > 0 ? Math.ceil(targetHeight / textHeight) : 0,
    cols: targetWidth > 0 ? Math.ceil(targetWidth / textWidth) : 0,
    cellHeight: textHeight,
    cellWidth: textWidth,
  };
};

const bootCursor = (
  target: Element,
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

export const bootElements = (target: Element, context: AnimationContext) => {
  const { height: targetHeight } = target.getBoundingClientRect();
  // reset first
  target.innerHTML = '';

  for (let i = 0; i < context.rows; i++) {
    target.appendChild(createSpanElement(targetHeight, context.rows));
  }
};

const bootContext = (target: Element, options: RenderOptions) => {
  const cellMetrics = calculateCellMetrics(target, options.resolution);

  const context = {
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

const getRowElement = (target: Element, row: number) => {
  return target.children[row] as HTMLSpanElement;
};

const processFrameBuffer = (
  target: Element,
  context: AnimationContext,
  frameBuffer: FrameBuffer,
) => {
  for (let i = 0; i < context.rows; i++) {
    const rowElement = getRowElement(target, i);
    if (!rowElement) continue;

    const rowContent = rowElement.innerHTML.split('');
    frameBuffer[i].forEach((char, j) => {
      if (rowContent[j] !== char) {
        rowContent[j] = char;
      }
    });

    rowElement.innerHTML = rowContent.join('');
  }
};

const runAnimationLoop = (
  target: Element,
  context: AnimationContext,
  animation: Animation,
  cursor: CursorContext,
) => {
  let previousTimestamp = 0;
  const frameBuffer: FrameBuffer = [];

  function loop(timestamp: number) {
    //if (context.frame > 1) return;
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
        let char = animation.main(coords, context, frameBuffer, cursor);

        if (!char || char === ' ') char = '&nbsp;';

        frameBuffer[i][j] = char;
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
  target: Element | null,
  animation: Animation,
  options: RenderOptions = {
    resolution: Resolution.Maximum,
  },
): void => {
  if (!target) throw new Error('Target element cannot be null');

  const context = bootContext(target, options);

  bootElements(target, context);
  const cursor = bootCursor(target, context);

  runAnimationLoop(target, context, animation, cursor);
};
