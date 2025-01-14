import type { Snippet } from 'svelte';
import { ModalState } from './ui_states.js';

export type Nullable<T> = T | null;

export type IModalState = (typeof ModalState)[keyof typeof ModalState];

export type SupportedImage = HTMLImageElement | HTMLDivElement | HTMLSpanElement;

export interface ZoomProps {
  a11y_name_button_unzoom?: string;
  a11y_name_button_zoom?: string;
  children: Snippet<[]>;
  class_button?: string;
  class_dialog?: string;
  duration?: string | number;
  icon_unzoom?: Snippet<[]>;
  icon_zoom?: Snippet<[]>;
  is_zoomed?: boolean;
  on_zoom_change?: (value: boolean) => void;
  wrap_element?: 'div' | 'span';
  // prettier-ignore
  zoom_content?: Snippet<[{
    img: Snippet<[]>;
    button_unzoom: Snippet<[]>;
    modal_state: IModalState;
    handle_unzoom: () => void;
  }]>;
  zoom_margin?: number;
}
