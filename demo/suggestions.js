import { html } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map.js'
import { DemoPage } from '@advanced-rest-client/arc-demo-helper';
import { ContextMenu } from '@api-client/context-menu';
import { ArcMock } from '@advanced-rest-client/arc-data-generator';
import { ArcModelEvents, ImportEvents } from '@advanced-rest-client/arc-events';
import '@advanced-rest-client/arc-demo-helper/arc-interactive-demo.js';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';
import '@advanced-rest-client/arc-models/variables-model.js';
import '@anypoint-web-components/anypoint-input/anypoint-input.js';
import '../variables-suggestions.js';
import sourceSystemVariables from './system-variables.js';
import { VariablesProcessor } from '../index.js';

/* global ArcVariables */

/** @typedef {import('@advanced-rest-client/arc-models').ARCVariable} ARCVariable */

const ContextMenuCommands = [
  {
    target: "anypoint-input.main-input",
    label: "Insert a variable",
    title: 'Inserts a variable in the current position',
    id: 'insert-var',
  },
];

class ComponentDemoPage extends DemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'withSystemVariables',
      'listX', 'listY', 'listTarget', 'listOpened',
      'mainOutput'
    ]);
    this.componentName = 'Variables suggestions';
    this.demoStates = ['Filled', 'Anypoint'];
    this.demoState = 0;
    this.withSystemVariables = false;
    this.generator = new ArcMock();
    /**
     * @type {HTMLInputElement}
     */
    this.listTarget = undefined;
    this.listX = 0;
    this.listY = 0;
    this.listOpened = false;
    this.mainOutput = undefined;
  }

  firstRender() {
    super.firstRender();
    this.contextMenu = new ContextMenu(document.body.querySelector('.documentation-section'), { cancelNativeWhenHandled: true });
    this.contextMenu.connect();
    this.contextMenu.registerCommands(ContextMenuCommands);
    this.contextMenu.addEventListener('execute', this.contextHandler.bind(this));
    this.render();
  }

  async generateData() {
    await this.generator.store.insertVariablesAndEnvironments(20, { defaultEnv: true });
    ImportEvents.dataImported(document.body);
  }

  async deleteData() {
    await this.generator.store.destroyVariables();
    ArcModelEvents.destroyed(document.body, 'all');
  }

  /**
   * @param {CustomEvent} e 
   */
  contextHandler(e) {
    const { id, clickPoint, target } = e.detail;
    if (id !== 'insert-var' || target.localName !== 'anypoint-input') {
      return;
    }
    this.listX = clickPoint.x;
    this.listY = clickPoint.y;
    this.listTarget = target.inputElement;
    this.listOpened = true;
  }

  listClosedHandler() {
    this.listTarget = undefined;
    this.listOpened = false;
  }

  /**
   * @param {Event} e 
   */
  async evaluateHandler(e) {
    const record = await ArcModelEvents.Environment.current(document.body);
    const { variables=[], systemVariables } = record;
    if (this.withSystemVariables) {
      Object.keys(systemVariables).forEach((key) => {
        const item = /** @type ARCVariable */ ({
          name: key,
          value: systemVariables[key],
          enabled: true,
          environment: 'any',
        });
        variables.push(item);
      });
    }

    const input = /** @type HTMLInputElement */ (e.target);
    // @ts-ignore
    const jexl = ArcVariables.JexlDev;
    const instance = new VariablesProcessor(jexl, variables);
    instance.clearCache();
    try {
      const result = await instance.evaluateVariable(input.value);
      this.mainOutput = result;
    } catch (cause) {
      this.mainOutput = cause.message;
      console.error(cause);
    }
  }

  _demoStateHandler(e) {
    const state = e.detail.value;
    this.demoState = state;
    this.compatibility = state === 1;
    this._updateCompatibility();
  }

  _demoTemplate() {
    const {
      demoStates,
      darkThemeActive,
      compatibility,
      demoState,
      withSystemVariables,
      listTarget,
      listX,
      listY,
      listOpened,
      mainOutput,
    } = this;
    const listStyles = {
      left: `${listX}px`,
      top: `${listY}px`,
    };
    return html`
      <section class="documentation-section">
        <h3>Interactive demo</h3>
        <p>
          This demo lets you preview the environment overlay element with various
          configuration options.
        </p>
        <arc-interactive-demo
          .states="${demoStates}"
          .selectedState="${demoState}"
          @state-changed="${this._demoStateHandler}"
          ?dark="${darkThemeActive}"
        >
          <div class="demo-content" slot="content">
            <anypoint-input 
              type="text" 
              name="variableValue" 
              class="main-input"
              @change="${this.evaluateHandler}"
            >
              <label slot="label">Input</label>
            </anypoint-input>
            <variables-suggestions
              style="${styleMap(listStyles)}"
              ?compatibility="${compatibility}"
              .systemVariablesEnabled="${withSystemVariables}"
              .input="${listTarget}"
              .opened="${listOpened}"
              @closed="${this.listClosedHandler}"
            ></variables-suggestions>
          </div>

          <label slot="options" id="mainOptionsLabel">Options</label>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="withSystemVariables"
            @change="${this._toggleMainOption}"
          >System variables</anypoint-checkbox>
        </arc-interactive-demo>

        ${mainOutput ? html`
        <div>
          <label>Processed input</label>
          <output>${mainOutput}</output>
        </div>
        ` : ''}
      </section>
    `;
  }

  _dataControlsTemplate() {
    return html`
    <section class="documentation-section">
      <h3>Data control</h3>
      <p>
        This section allows you to control demo data
      </p>
      <anypoint-button @click="${this.generateData}">Generate data</anypoint-button>
      <anypoint-button @click="${this.deleteData}">Clear list</anypoint-button>
    </section>`;
  }


  contentTemplate() {
    return html`
      <h2>Environment overlay</h2>
      <variables-model .systemVariables="${sourceSystemVariables}"></variables-model>
      ${this._demoTemplate()}
      ${this._dataControlsTemplate()}
    `;
  }
}

const instance = new ComponentDemoPage();
instance.render();
