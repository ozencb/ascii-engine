import { Resolution } from './constants';
import { addPointerEvents } from './events';
import {
  Animation,
  AnimationContext,
  CursorContext,
  RenderOptions,
} from './types';

const createSpanElement = (resolution: Resolution) => {
  const maxHeight = 128;
  const minHeight = 8;
  const calculatedHeight =
    maxHeight -
    ((resolution - 1) * (maxHeight - minHeight)) /
      (Object.keys(Resolution).length / 2 - 1);

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

const calculateCellMetrics = (
  target: Element,
  resolution: Resolution,
): { rows: number; cols: number; cellHeight: number; cellWidth: number } => {
  const { height: targetHeight, width: targetWidth } =
    target.getBoundingClientRect();

  // temp element for getting real block height
  const tempEl = createSpanElement(resolution);

  tempEl.style.visibility = 'hidden';
  tempEl.style.display = 'inline';
  target.appendChild(tempEl);
  const { height: textHeight, width: textWidth } =
    tempEl.getBoundingClientRect();
  target.removeChild(tempEl);

  return {
    rows: Math.ceil(targetHeight / textHeight),
    cols: Math.ceil(targetWidth / textWidth),
    cellHeight: textHeight,
    cellWidth: textWidth,
  };
};

const getContext = (
  options: RenderOptions,
  rows: number,
  cols: number,
): AnimationContext => {
  return {
    rows,
    cols,
    cellWidth: 1,
    cellHeight: 1,
    frame: 0,
    deltaTime: 0,
    elapsedTime: 0,
    options,
  };
};

const calculateCursor = (target: Element): CursorContext => {
  const cursor: CursorContext = {
    x: 0,
    y: 0,
    pressed: false,
  };

  addPointerEvents(target, cursor);

  return cursor;
};

const runAnimationLoop = (
  target: Element,
  context: AnimationContext,
  animation: Animation,
  options: RenderOptions,
  cursor: CursorContext,
) => {
  function loop(frame: number) {
    // clear dom
    target.innerHTML = '';

    context.frame = frame;

    // create span elements
    for (let i = 0; i < context.rows; i++) {
      const offs = i * context.cols;
      const span = createSpanElement(options.resolution);
      for (let j = 0; j < context.cols; j++) {
        const idx = offs + j;

        const char = animation.main({ x: j, y: i, idx }, context, cursor);

        if (char) {
          const { innerText } = span;
          const newText = innerText.slice(0, j) + char + innerText.slice(j + 1);
          span.innerText = newText;
        }
      }
      target.appendChild(span);
    }

    requestAnimationFrame(loop);
  }
  loop(0);
};

export const render = (
  target: Element | null,
  animation: Animation,
  options: RenderOptions = {
    resolution: Resolution.Low,
  },
): void => {
  if (!target) throw new Error('Target element cannot be null');

  const { rows: amountOfRows, cols: amountOfColumns } = calculateCellMetrics(
    target,
    options.resolution,
  );

  const context = getContext(options, amountOfRows, amountOfColumns);

  const cursor = calculateCursor(target);
  // TEMP
  const coords = { x: 0, y: 0, idx: 3 };
  const buffer = [];

  runAnimationLoop(target, context, animation, options, cursor);
};
