import { LitElement, CSSResult, TemplateResult } from 'lit-element';
import { VariablesConsumerMixin } from './VariablesConsumerMixin.js';

export declare const envSelectorKeydownHandler: unique symbol
export declare const envSelectorClickHandler: unique symbol
export declare const labelTemplate: unique symbol
export declare const dropdownTemplate: unique symbol
export declare const envSelectorOpened: unique symbol
export declare const envSelectorClosed: unique symbol
export declare const envActivateHandler: unique symbol
export declare const envActionHandler: unique symbol
export declare const envAddEditor: unique symbol
export declare const envInputTemplate: unique symbol
export declare const envInputKeydownTemplate: unique symbol
export declare const envAddClickHandler: unique symbol
export declare const envAddCancelHandler: unique symbol
export declare const listOptionsTemplate: unique symbol

/**
 * @deprecated Use `@advanced-rest-client/app` instead.
 */
export declare class EnvironmentSelectorElement extends VariablesConsumerMixin(LitElement) {
  static get styles(): CSSResult[];

  /**
   * Enables compatibility with Anypoint platform
   * @attribute
   */
  compatibility: boolean;
  /**
   * Enables Material Design Outlined inputs
   * @attribute
   */
  outlined: boolean;
  [envSelectorOpened]: boolean;
  [envAddEditor]: boolean;

  constructor();

  [envSelectorKeydownHandler](e: KeyboardEvent): void;

  [envSelectorClickHandler](): void;

  /**
   * Handler for the drop down list close event.
   */
  [envSelectorClosed](): void;

  [envActivateHandler](e: CustomEvent): void;

  /**
   * @param action The action to perform
   */
  [envActionHandler](action: string): void;

  /**
   * The handler for the cancel adding new environment button.
   */
  [envAddCancelHandler](): void;

  [envInputKeydownTemplate](e: KeyboardEvent): void;

  [envAddClickHandler](): void;

  /**
   * @returns The main template
   */
  render(): TemplateResult;

  /**
   * @returns The template for the drop down label.
   */
  [labelTemplate](): TemplateResult;

  /**
   * @returns The template for the drop down menu with environment options.
   */
  [dropdownTemplate](): TemplateResult;
  
  /**
   * @returns The template for the drop down list options
   */
  [listOptionsTemplate](): TemplateResult;

  /**
   * @returns The template for the new environment name input.
   */
  [envInputTemplate](): TemplateResult|string;
}
