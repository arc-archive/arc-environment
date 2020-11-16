/* eslint-disable prefer-destructuring */
import { assert, html, fixture, nextFrame } from '@open-wc/testing';
import { DataGenerator } from '@advanced-rest-client/arc-data-generator';
import sinon from 'sinon';
import '../variables-list.js';
import { ArcModelEventTypes } from '@advanced-rest-client/arc-models';
import { varAddHandler, editedVariable } from '../src/VariablesListElement.js';

/** @typedef {import('@advanced-rest-client/arc-types').Variable.ARCVariable} ARCVariable */
/** @typedef {import('@advanced-rest-client/arc-types').Variable.ARCEnvironment} ARCEnvironment */
/** @typedef {import('../index').VariablesListElement} VariablesListElement */

describe('VariablesListElement', () => {
  const generator = new DataGenerator();

  /**
   * @param {array=} vars
   * @returns {Promise<VariablesListElement>}
   */
  async function basicFixture(vars) {
    return fixture(html`<variables-list environment="default" .variables="${vars}"></variables-list>`);
  }

  /**
   * @param {array=} vars
   * @returns {Promise<VariablesListElement>}
   */
  async function systemFixture(vars) {
    return fixture(html`<variables-list system .variables="${vars}"></variables-list>`);
  }

  describe('Empty default list', () => {
    let element = /** @type VariablesListElement */ (null);
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('renders the title', () => {
      const node = element.shadowRoot.querySelector('.section-title');
      assert.ok(node);
    });

    it('renders the add variable button', () => {
      const node = element.shadowRoot.querySelector('[data-action="add-variables"]');
      assert.ok(node);
    });

    it('renders the toggle visibility button', () => {
      const node = element.shadowRoot.querySelector('[data-action="toggle-visibility"]');
      assert.ok(node);
    });

    it('has default toggle icon', () => {
      const node = element.shadowRoot.querySelector('[data-action="toggle-visibility"] arc-icon');
      assert.equal(node.getAttribute('icon'), 'visibility');
    });

    it('changes the toggle icon', async () => {
      element.renderValues = true;
      await nextFrame();
      const node = element.shadowRoot.querySelector('[data-action="toggle-visibility"] arc-icon');
      assert.equal(node.getAttribute('icon'), 'visibilityOff');
    });

    it('has the "titleValue" set', () => {
      assert.equal(element.titleValue, 'Variables');
    });

    it('renders the empty list info', () => {
      const node = element.shadowRoot.querySelector('.empty-info');
      assert.ok(node);
    });
  });

  describe('Empty system variables list', () => {
    let element = /** @type VariablesListElement */ (null);
    beforeEach(async () => {
      element = await systemFixture();
    });

    it('renders the title', () => {
      const node = element.shadowRoot.querySelector('.section-title');
      assert.ok(node);
    });

    it('does not render the add variable button for system variables', async () => {
      element.system = true;
      await nextFrame();
      const node = element.shadowRoot.querySelector('[data-action="add-variables"]');
      assert.notOk(node);
    });

    it('has the "titleValue" set', () => {
      assert.equal(element.titleValue, 'System variables');
    });
  });

  describe('Adding a variable', () => {
    let element = /** @type VariablesListElement */ (null);
    beforeEach(async () => {
      element = await basicFixture();
    });

    after(async () => {
      await generator.destroyVariablesData();
    });

    it('dispatches the update event', async () => {
      const spy = sinon.spy();
      element.addEventListener(ArcModelEventTypes.Variable.update, spy);
      await element[varAddHandler]();
      assert.isTrue(spy.called);
    });

    it('sets the [editedVariable] property', async () => {
      await element[varAddHandler]();
      assert.typeOf(element[editedVariable], 'string');
    });
  });
});
