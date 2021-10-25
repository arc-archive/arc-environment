import { LitElement, CSSResult, TemplateResult } from 'lit-element';
import { ArcOverlayMixin } from '@advanced-rest-client/arc-overlay-mixin';
import { VariablesConsumerMixin } from './VariablesConsumerMixin.js';

export declare const infoTemplate: unique symbol;
export declare const selectorTemplate: unique symbol;
export declare const listTemplate: unique symbol;
export declare const systemListTemplate: unique symbol;
export declare const footerTemplate: unique symbol;
export declare const systemVariablesToggleTemplate: unique symbol;
export declare const closeHandler: unique symbol;
export declare const systemVarsToggleHandler: unique symbol;

/**
 * `Renders an overlay with variables information.
 * @fires ready Dispatched when refreshed the list of environments and the current environment
 * @deprecated Use `@advanced-rest-client/app` instead.
 */
export class VariablesOverlayElement extends VariablesConsumerMixin(ArcOverlayMixin(LitElement)) {
  static get styles(): CSSResult;

  /** 
   * When set it renders the real values for the variables instead of masked values.
   * @attribute
   */
  renderValues?: boolean;
  /**
   * Enables compatibility with Anypoint platform
   * @attribute
   */
  compatibility?: boolean;
  /**
   * Enables Material Design Outlined inputs
   * @attribute
   */
  outlined?: boolean;

  constructor();
  
  connectedCallback(): void;

  /**
   * Refreshes the current environment and list of available environments
   */
  reset(): Promise<void>;

  [systemVarsToggleHandler](e: Event): Promise<void>;

  [closeHandler](): void;

  /**
   * @returns The main template.
   */
  render(): TemplateResult;

  /**
   * @returns The template for the introduction message.
   */
  [infoTemplate](): TemplateResult;


  /**
   * @returns The template for the environment selector
   */
  [selectorTemplate](): TemplateResult;

  /**
   * @returns The template for the variables list
   */
  [listTemplate](): TemplateResult;

  /**
   * @returns The template for the system variables list
   */
  [systemListTemplate](): TemplateResult|string;

  [footerTemplate](): TemplateResult;

  [systemVariablesToggleTemplate](): TemplateResult;
}
