import type { Snippet } from 'svelte';

// ==================================================

export type Nullable<T> = T | null;

// ==================================================

export type SupportedImage = HTMLImageElement;

export interface BodyAttrs {
  overflow: string;
  width: string;
}

export interface ZoomProps {
  children: Snippet;
  dialog_class?: string;
  is_zoomed?: boolean;
  on_zoom_change?: (value: boolean) => void;
  wrap_element?: 'div' | 'span';
  zoom_margin?: number;
}
