import { VariablesListElement } from './src/VariablesListElement.js';

declare global {
  interface HTMLElementTagNameMap {
    "variables-list": VariablesListElement;
  }
}
