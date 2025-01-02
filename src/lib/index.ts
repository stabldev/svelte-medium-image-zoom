import UnControlled from './components/un-controlled.svelte';
import Controlled from './components/controlled.svelte';
import Zoom from './components/zoom.svelte';

export default UnControlled;
export const ControlledZoom = Controlled;
export const Zoomable = Zoom;
export type { ControlledProps, UncontrolledProps } from './types.js';
