/**
 * Track the modal status
 * shown -> LOADED, showing -> LOADING
 * hidden -> UNLOADED, hiding -> UNLOADING
 */
export const ModalState = Object.freeze({
  LOADED: 'LOADED',
  LOADING: 'LOADING',
  UNLOADED: 'UNLOADED',
  UNLOADING: 'UNLOADING'
});
