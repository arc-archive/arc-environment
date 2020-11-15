import { VariablesOverlayElement } from './src/VariablesOverlayElement.js';

declare global {
  interface HTMLElementTagNameMap {
    "variables-overlay": VariablesOverlayElement;
  }
}
