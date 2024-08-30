import { AnimationContext, CursorContext } from './types';

export const addPointerEvents = (
  target: Element,
  cursor: CursorContext,
  context: AnimationContext,
  bbox: DOMRectReadOnly,
) => {
  console.log(target);

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
