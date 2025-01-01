import type { Component, Snippet } from 'svelte';

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
  zoomMargin?: number;
}

export interface UncontrolledProps
  extends Omit<ControlledProps, 'isZoomed' | 'onZoomChange'> {}
