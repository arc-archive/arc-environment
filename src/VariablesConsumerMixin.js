/* eslint-disable class-methods-use-this */
import { ArcModelEvents, ArcModelEventTypes } from '@advanced-rest-client/arc-models';
import { ConfigEvents, ConfigEventTypes } from '@advanced-rest-client/arc-events';
import { dedupeMixin } from '@open-wc/dedupe-mixin';
// eslint-disable-next-line no-unused-vars
import { LitElement } from 'lit-element';

/** @typedef {import('@advanced-rest-client/arc-models').ARCEnvironment} ARCEnvironment */
/** @typedef {import('@advanced-rest-client/arc-models').ARCVariable} ARCVariable */
/** @typedef {import('@advanced-rest-client/arc-models').ARCEnvironmentDeletedEvent} ARCEnvironmentDeletedEvent */
/** @typedef {import('@advanced-rest-client/arc-models').ARCEnvironmentUpdatedEvent} ARCEnvironmentUpdatedEvent */
/** @typedef {import('@advanced-rest-client/arc-models').ARCEnvironmentStateSelectEvent} ARCEnvironmentStateSelectEvent */
/** @typedef {import('@advanced-rest-client/arc-models').ARCVariableDeletedEvent} ARCVariableDeletedEvent */
/** @typedef {import('@advanced-rest-client/arc-models').ARCVariableUpdatedEvent} ARCVariableUpdatedEvent */
/** @typedef {import('@advanced-rest-client/arc-models').ARCModelStateDeleteEvent} ARCModelStateDeleteEvent */
/** @typedef {import('@advanced-rest-client/arc-events').ConfigStateUpdateEvent} ConfigStateUpdateEvent */
/** @typedef {import('./VariablesConsumerMixin').SystemVariables} SystemVariables */

export const environmentValue = Symbol('environmentValue');
export const environmentDeleteHandler = Symbol('environmentDeleteHandler');
export const environmentUpdateHandler = Symbol('environmentUpdateHandler');
export const environmentSelectHandler = Symbol('environmentSelectHandler');
export const variableDeleteHandler = Symbol('variableDeleteHandler');
export const variableUpdateHandler = Symbol('variableUpdateHandler');
export const datastoreDestroyedHandler = Symbol('datastoreDestroyedHandler');
export const configChangeHandler = Symbol('configChangeHandler');
export const systemVariablesValue = Symbol('systemVariablesValue');
export const systemVariablesModel = Symbol('systemVariablesModel');
export const processSystemVariables = Symbol('processSystemVariables');

export const defaultEnvironmentLabel = 'Default';

/**
 * @param {typeof LitElement} base
 */
const mxFunction = (base) => {
  class VariablesConsumerMixin extends base {
    /**
     * @returns {string} The label to be used as the environment name.
     */
    get environmentLabel() {
      const { environment } = this;
      if (!environment) {
        return defaultEnvironmentLabel;
      }
      return environment.name;
    }

    /**
     * @returns {string} The value to be used in a variable environment
     */
    get environmentNameValue() {
      const { environment } = this;
      if (!environment) {
        return defaultEnvironmentLabel.toLocaleLowerCase();
      }
      return environment.name;
    }

    get systemVariables() {
      return this[systemVariablesValue];
    }

    set systemVariables(value) {
      const old = this[systemVariablesValue];
      if (value === old) {
        return;
      }
      this[systemVariablesValue] = value;
      this[systemVariablesModel] = this[processSystemVariables](value);
      this.requestUpdate();
    }

    static get properties() {
      return {
        /**
         * The currently selected environment. When `null` the default environment is selected.
         * Note, changing this value programmatically has no global effect.
         */
        environment: { type: Object },
        /**
         * List of available variables for the current environment.
         * It may be `undefined` when no environment information has been read.
         */
        variables: { type: Array },

        /**
         * List of available variables for the current environment.
         * It may be `undefined` when no environment information has been read.
         */
        environments: { type: Array },
        /** 
         * Whether or not the system variables are enabled in the application configuration.
         */
        systemVariablesEnabled: { type: Boolean },
        /** 
         * The list of system variables to process. This is a regular key-value map of variables.
         */
        systemVariables: { type: Object },
      };
    }

    constructor() {
      super();
      /**
       * @type {ARCEnvironment|null}
       */
      this.environment = undefined;
      /**
       * @type {ARCEnvironment[]}
       */
      this.environments = undefined;
      /**
       * @type {ARCVariable[]}
       */
      this.variables = undefined;

      this.systemVariablesEnabled = false;
      /** 
       * @type {SystemVariables}
       */
      this.systemVariables = undefined;
      /**
       * @type {ARCVariable[]}
       */
      this[systemVariablesModel] = [];

      this[environmentDeleteHandler] = this[environmentDeleteHandler].bind(this);
      this[environmentUpdateHandler] = this[environmentUpdateHandler].bind(this);
      this[environmentSelectHandler] = this[environmentSelectHandler].bind(this);
      this[variableDeleteHandler] = this[variableDeleteHandler].bind(this);
      this[variableUpdateHandler] = this[variableUpdateHandler].bind(this);
      this[datastoreDestroyedHandler] = this[datastoreDestroyedHandler].bind(this);
      this[configChangeHandler] = this[configChangeHandler].bind(this);
    }

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      window.addEventListener(ArcModelEventTypes.Environment.State.select, this[environmentSelectHandler]);
      window.addEventListener(ArcModelEventTypes.Environment.State.delete, this[environmentDeleteHandler]);
      window.addEventListener(ArcModelEventTypes.Environment.State.update, this[environmentUpdateHandler]);
      window.addEventListener(ArcModelEventTypes.Variable.State.delete, this[variableDeleteHandler]);
      window.addEventListener(ArcModelEventTypes.Variable.State.update, this[variableUpdateHandler]);
      window.addEventListener(ArcModelEventTypes.destroyed, this[datastoreDestroyedHandler]);
      window.addEventListener(ConfigEventTypes.State.update, this[configChangeHandler]);
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
      window.removeEventListener(ArcModelEventTypes.Environment.State.select, this[environmentSelectHandler]);
      window.removeEventListener(ArcModelEventTypes.Environment.State.delete, this[environmentDeleteHandler]);
      window.removeEventListener(ArcModelEventTypes.Environment.State.update, this[environmentUpdateHandler]);
      window.removeEventListener(ArcModelEventTypes.Variable.State.delete, this[variableDeleteHandler]);
      window.removeEventListener(ArcModelEventTypes.Variable.State.update, this[variableUpdateHandler]);
      window.removeEventListener(ArcModelEventTypes.destroyed, this[datastoreDestroyedHandler]);
      window.removeEventListener(ConfigEventTypes.State.update, this[configChangeHandler]);
    }

    /**
     * Refreshes information about the current environment.
     * 
     * @returns {Promise<void>} Resolved when the environment information is refreshed and update is complete.
     */
    async refreshEnvironment() {
      const record = await ArcModelEvents.Environment.current(this);
      const { environment, variables } = record;
      if (environment) {
        this.environment = environment;
      } else {
        this.environment = null;
      }
      this.variables = variables;
      await this.requestUpdate();
    }

    /**
     * Refreshes information about all environments.
     * 
     * @returns {Promise<void>} Resolved when the environments are refreshed and update is complete.
     */
    async refreshEnvironments() {
      const record = await ArcModelEvents.Environment.list(this, { readall: true });
      this.environments = record.items;
      await this.requestUpdate();
    }

    /**
     * @param {string|null=} id THe id of the environment to select. `null` for the default environment
     */
    selectEnvironment(id=null) {
      const { environment } = this;
      if (!environment && !id) {
        return;
      }
      if (environment && environment._id === id) {
        return;
      }
      ArcModelEvents.Environment.select(this, id);
    }

    /**
     * @param {string} name Adds a new environment to the system
     */
    async addEnvironment(name) {
      if (!name) {
        throw new TypeError('Argument expected');
      }
      const record = await ArcModelEvents.Environment.update(this, {
        name,
      });
      this.selectEnvironment(record.id);
    }

    /**
     * @param {string} id The id of the environment to be removed.
     */
    async removeEnvironment(id) {
      if (!id) {
        throw new TypeError('Argument expected');
      }
      await ArcModelEvents.Environment.delete(this, id);
    }

    /**
     * Toggles the use of the system variables in this component and globally in the application
     * @param {boolean=} force When set it forces this value.
     */
    async toggleSystemVariables(force) {
      if (typeof force === 'boolean') {
        this.systemVariablesEnabled = force;
      } else {
        this.systemVariablesEnabled = !this.systemVariablesEnabled;
      }
      await ConfigEvents.update(this, 'request.useSystemVariables', this.systemVariablesEnabled);
    }

    /**
     * @param {Readonly<{[key: string]: string}>} vars THe variables to process
     * @returns {ARCVariable[]} Processed variables model
     */
    [processSystemVariables](vars) {
      if (!vars) {
        return [];
      }
      return Object.keys(vars).map((key) => {
        const item = /** @type ARCVariable */ ({
          name: key,
          value: vars[key],
          enabled: true,
          environment: 'any',
        });
        return item;
      });
    }

    /**
     * @param {ARCEnvironmentDeletedEvent} e
     */
    async [environmentDeleteHandler](e) {
      const { environments } = this;
      if (!Array.isArray(environments) || !environments.length) {
        return;
      }
      const { id } = e;
      const index = environments.findIndex((item) => item._id === id);
      if (index !== -1) {
        environments.splice(index, 1);
        this.requestUpdate();
      }
      const { environment } = this;
      if (environment && environment._id === id) {
        this.selectEnvironment(null);
      }
    }

    /**
     * @param {ARCEnvironmentUpdatedEvent} e
     */
    [environmentUpdateHandler](e) {
      const { changeRecord } = e;
      const { id, item } = changeRecord;
      if (!item) {
        return;
      }
      if (!this.environments) {
        this.environments = [];
      }
      const { environments } = this;
      const index = environments.findIndex((env) => env._id === id);
      if (index === -1) {
        environments.push(item);
      } else {
        environments[index] = item;
      }
      this.requestUpdate();
    }

    /**
     * @param {ARCEnvironmentStateSelectEvent} e
     */
    [environmentSelectHandler](e) {
      const { environment, variables } = e.detail;
      this.environment = environment || null;
      this.variables = Array.from(variables);
    }

    /**
     * @param {ARCVariableDeletedEvent} e
     */
    [variableDeleteHandler](e) {
      const { id } = e;
      const { variables } = this;
      if (!Array.isArray(variables) || !variables.length) {
        return;
      }
      const index = variables.findIndex((item) => item._id === id);
      if (index !== -1) {
        variables.splice(index, 1);
        this.requestUpdate();
      }
    }

    /**
     * @param {ARCVariableUpdatedEvent} e
     */
    [variableUpdateHandler](e) {
      const { changeRecord } = e;
      const { id, item } = changeRecord;
      if (!item) {
        return;
      }
      const { environment } = this;
      if (!environment && item.environment !== 'default') {
        return;
      }
      if (!this.variables) {
        this.variables = [];
      }
      const { variables } = this;
      const index = variables.findIndex((variable) => variable._id === id);
      if (index === -1) {
        variables.push(item);
      } else {
        variables[index] = item;
      }
      this.requestUpdate();
    }
    
    /**
     * @param {ARCModelStateDeleteEvent} e
     */
    [datastoreDestroyedHandler](e) {
      const { store } = e;
      if (['variables', 'variables-environments'].includes(store)) {
        this.refreshEnvironment();
        this.refreshEnvironments();
      }
    }

    /**
     * @param {ConfigStateUpdateEvent} e
     */
    [configChangeHandler](e) {
      const { key, value } = e.detail;
      if (key === 'request.useSystemVariables') {
        this.systemVariablesEnabled = value;
      }
    }
  }
  return VariablesConsumerMixin;
}

/**
 * A mixin to be used with elements that consumes variables 
 * and environments. 
 *
 * @mixin
 */
export const VariablesConsumerMixin = dedupeMixin(mxFunction);
