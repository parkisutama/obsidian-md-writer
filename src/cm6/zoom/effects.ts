import { StateEffect as SE, type StateEffect } from "@codemirror/state";

export interface ZoomRange {
  from: number;
  to: number;
}

export type ZoomInEffect = StateEffect<ZoomRange>;

export const zoomInEffect = SE.define<ZoomRange>();
export const zoomOutEffect = SE.define<void>();

export function isZoomInEffect(e: StateEffect<unknown>): e is ZoomInEffect {
  return e.is(zoomInEffect);
}
