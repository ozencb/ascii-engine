import { Resolution } from './constants';
import { Animation, AnimationContext, CellMetrics, RenderOptions } from './types';
export declare const calculateCellMetrics: (target: HTMLElement, resolution: Resolution) => CellMetrics;
export declare const bootElements: (target: HTMLElement, context: AnimationContext) => void;
export declare const render: (target: HTMLElement | null, animation: Animation, options?: RenderOptions) => void;
