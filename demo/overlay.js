import { html } from 'lit-element';
import { DemoPage } from '@advanced-rest-client/arc-demo-helper';
import '@advanced-rest-client/arc-demo-helper/arc-interactive-demo.js';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';
import '@advanced-rest-client/arc-models/variables-model.js';
import '../variables-overlay.js';
import variables from './system-variables.js';

class ComponentDemoPage extends DemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'withSystemVariables',
    ]);
    this.componentName = 'Environment overlay';
    this.demoStates = ['Filled', 'Outlined', 'Anypoint'];
    this.demoState = 0;
    this.withSystemVariables = false;

    this._varsOpenHandler = this._varsOpenHandler.bind(this);
  }

  _demoStateHandler(e) {
    const state = e.detail.value;
    this.demoState = state;
    this.outlined = state === 1;
    this.compatibility = state === 2;
    this._updateCompatibility();
  }

  _varsOpenHandler(e) {
    const overlay = document.querySelector('variables-overlay');
    overlay.positionTarget = e.target;
    overlay.opened = true;
  }

  _demoTemplate() {
    const {
      demoStates,
      darkThemeActive,
      compatibility,
      outlined,
      demoState,
      withSystemVariables,
    } = this;
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
          <anypoint-button
            slot="content"
            @click="${this._varsOpenHandler}"
          >Open overlay</anypoint-button>

          <label slot="options" id="mainOptionsLabel">Options</label>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="withSystemVariables"
            @change="${this._toggleMainOption}"
          >System variables</anypoint-checkbox>
        </arc-interactive-demo>

        <variables-overlay 
          id="overlay" 
          verticalAlign="top" 
          withBackdrop 
          horizontalAlign="right"
          noCancelOnOutsideClick
          ?compatibility="${compatibility}"
          ?outlined="${outlined}"
          .systemVariablesEnabled="${withSystemVariables}"
          .systemVariables="${variables}"
        ></variables-overlay>
      </section>
    `;
  }

  contentTemplate() {
    return html`
      <h2>Environment overlay</h2>
      <variables-model></variables-model>
      ${this._demoTemplate()}
    `;
  }
}

const instance = new ComponentDemoPage();
instance.render();
