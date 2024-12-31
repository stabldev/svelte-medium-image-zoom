import type { Component, Snippet } from 'svelte';
import type { HTMLImgAttributes } from 'svelte/elements';

export type SupportedImage = HTMLImageElement | HTMLDivElement | HTMLSpanElement;

export interface ControlledProps {
  a11yNameButtonUnzoom?: string;
  a11yNameButtonZoom?: string;
  children: Snippet;
  dialogClass?: string;
  IconUnzoom?: Component;
  IconZoom?: Component;
  isZoomed?: boolean;
  onZoomChange?: (value: boolean) => void;
  zoomImg?: HTMLImgAttributes;
  zoomMargin?: number;
  wrapElement?: 'div' | 'span';
}
