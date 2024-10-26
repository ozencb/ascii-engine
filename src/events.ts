import { bootElements, calculateCellMetrics } from './renderer';
import { AnimationContext, CursorContext, RenderOptions } from './types';

export const addPointerEvents = (
  target: HTMLElement,
  context: AnimationContext,
  cursor: CursorContext,
  bbox: DOMRectReadOnly,
) => {
  target.addEventListener('pointermove', (e: Event) => {
    if (!(e instanceof PointerEvent)) return;
    cursor.x = e.x - bbox.left;
    cursor.y = e.y - bbox.top;

    cursor.col = Math.floor(cursor.x / context.cellWidth);
    cursor.row = Math.floor(cursor.y / context.cellHeight);
  });

  target.addEventListener('pointerdown', (e: Event) => {
    if (!(e instanceof PointerEvent)) return;
    cursor.pressed = true;
  });

  target.addEventListener('pointerup', (e: Event) => {
    if (!(e instanceof PointerEvent)) return;
    cursor.pressed = false;
  });
};

export const addWindowEvents = (
  target: HTMLElement,
  context: AnimationContext,
  options: RenderOptions,
) => {
  window.addEventListener('resize', () => {
    const updatedCellMetrics = calculateCellMetrics(target, options.resolution);
    context.rows = updatedCellMetrics.rows;
    context.cols = updatedCellMetrics.cols;
    context.cellWidth = updatedCellMetrics.cellWidth;
    context.cellHeight = updatedCellMetrics.cellHeight;
    bootElements(target, context);
  });
};
