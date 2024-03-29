import { LitElement, TemplateResult, CSSResult } from 'lit-element';
import { ARCVariable } from '@advanced-rest-client/arc-models';
import { ArcResizableMixin } from '@advanced-rest-client/arc-resizable-mixin';

export declare const variableEditorTemplate: unique symbol
export declare const varAddHandler: unique symbol
export declare const editedVariable: unique symbol
export declare const editVariableHandler: unique symbol
export declare const toggleVariableHandler: unique symbol
export declare const variableInputHandler: unique symbol
export declare const variableEditorCloseHandler: unique symbol
export declare const visibilityToggleHandler: unique symbol
export declare const deleteVariableHandler: unique symbol
export declare const variablesListTemplate: unique symbol
export declare const variablesItemTemplate: unique symbol
export declare const listActionsTemplate: unique symbol

/**
 * @deprecated Use `@advanced-rest-client/app` instead.
 */
export class VariablesListElement extends ArcResizableMixin(LitElement) {
  static get styles(): CSSResult[];

  /** 
   * The list of variables to render.
   */
  variables: ARCVariable[];
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
  /** 
   * When set it renders the real values for the variables instead of masked values.
   * @attribute
   */
  renderValues: boolean
  /** 
   * The name of the environment that these variables belongs to.
   * @attribute
   */
  environment: string;
  /**
   * The ID of the variable in the edit mode.
   */
  [editedVariable]: string;

  /** 
   * When set it renders a list of system variables.
   * @attribute
   */
  system: boolean;

  get titleValue(): string;

  constructor();

  /**
   * A handler for the variable add button click
   */
  [varAddHandler](): Promise<void>;

  /**
   * Toggles visibility of the variable values.
   */
  [visibilityToggleHandler](): void;

  /**
   * A handler for the click event on the variable edit icon.
   * Sets state to edit this variable
   */
  [editVariableHandler](e: PointerEvent): Promise<void>;

  /**
   * Handler for the variable toggle change
   */
  [toggleVariableHandler](e: CustomEvent): void;

  /**
   * Handler for one of the variable inputs value change
   */
  [variableInputHandler](e: Event): void;

  /**
   * Removes the variable from the environment
   */
  [deleteVariableHandler](e: PointerEvent): Promise<void>;

  /**
   * A handler for the variable editor close button click.
   */
  [variableEditorCloseHandler](): Promise<void>;

  render(): TemplateResult;

  /**
   * @returns The template for the variables list.
   */
  [variablesListTemplate](): TemplateResult;

  /**
   * @param item The variable to render.
   * @returns The template for the variable line or variable editor
   */
  [variablesItemTemplate](item: ARCVariable): TemplateResult;
  [listActionsTemplate](item: ARCVariable): TemplateResult|string;

  /**
   * @param item The variable to render.
   * @returns The template for the variables editor
   */
  [variableEditorTemplate](item: ARCVariable): TemplateResult;
}
