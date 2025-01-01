import type { Component, Snippet } from 'svelte';
import type { HTMLImgAttributes } from 'svelte/elements';

// ==================================================

export type Nullable<T> = T | null;

// ==================================================

export type SupportedImage = HTMLImageElement;

export interface BodyAttrs {
  overflow: string;
  width: string;
}

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
