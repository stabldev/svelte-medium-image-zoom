import UnControlled from './components/un-controlled.svelte';
import Controlled from './components/controlled.svelte';

export default UnControlled;
export const ControlledZoom = Controlled;
export type { ControlledProps, UncontrolledProps } from './types.js';
