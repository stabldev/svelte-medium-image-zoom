import type { Component, Snippet } from 'svelte';
import type { HTMLImgAttributes } from 'svelte/elements';

export type SupportedImage = HTMLImageElement;

export interface ControlledProps {
  a11yNameButtonUnzoom?: string;
  a11yNameButtonZoom?: string;
  children: Snippet;
  dialogClass?: string;
  IconUnzoom?: Component;
  IconZoom?: Component;
  isZoomed?: boolean;
  onZoomChange?: (value: boolean) => void;
  wrapElement?: 'div' | 'span';
  zoomImg?: HTMLImgAttributes;
  zoomMargin?: number;
}
