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
  a11y_name_button_unzoom?: string;
  a11y_name_button_zoom?: string;
  children: Snippet;
  dialog_class?: string;
  icon_unzoom?: Snippet;
  icon_zoom?: Snippet;
  is_zoomed?: boolean;
  on_zoom_change?: (value: boolean) => void;
  wrap_element?: 'div' | 'span';
  zoom_margin?: number;
}
