import { Resolution } from './constants';
import { Animation, RenderOptions } from './types';

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
  span.innerHTML = '&nbsp;';

  return span;
};

const calculateRowAndColumnNumber = (
  target: Element,
  resolution: Resolution,
): { rows: number; columns: number } => {
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
    columns: Math.ceil(targetWidth / textWidth),
  };
};

export const render = (
  target: Element | null,
  animation: Animation,
  options: RenderOptions = {
    resolution: Resolution.Low,
  },
): void => {
  if (!target) throw new Error('Target element cannot be null');

  const { rows: amountOfRows, columns: amountOfColumns } =
    calculateRowAndColumnNumber(target, options.resolution);

  console.log({ amountOfRows, amountOfColumns });

  // create span elements
  for (let i = 0; i < amountOfRows; i++) {
    const span = createSpanElement(options.resolution);

    target.appendChild(span);
  }

  animation?.pre?.();
};
