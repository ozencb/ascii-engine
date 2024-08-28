import { CursorContext } from './types';

export const addPointerEvents = (target: Element, cursor: CursorContext) => {
  target.addEventListener('pointermove', (e: Event) => {
    if (!(e instanceof PointerEvent)) return;
    const rect = target.getBoundingClientRect();
    cursor.x = e.offsetX - rect.left;
    cursor.y = e.offsetY - rect.top;
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
