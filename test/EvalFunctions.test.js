import { assert } from '@open-wc/testing';
import { EvalFunctions } from '../src/runner/EvalFunctions.js';

describe('EvalFunctions', () => {
  describe('EncodeURIComponent()', () => {
    it('throws when no argument', () => {
      assert.throws(() => {
        EvalFunctions.EncodeURIComponent(undefined);
      });
    });

    it('encodes first argument', () => {
      const result = EvalFunctions.EncodeURIComponent(['+']);
      assert.equal(result, '%2B');
    });

    it('ignores other arguments', () => {
      const result = EvalFunctions.EncodeURIComponent(['+', '+']);
      assert.equal(result, '%2B');
    });
  });

  describe('DecodeURIComponent()', () => {
    it('throws when no argument', () => {
      assert.throws(() => {
        EvalFunctions.DecodeURIComponent(undefined);
      });
    });

    it('decodes first argument', () => {
      const result = EvalFunctions.DecodeURIComponent(['%2B']);
      assert.equal(result, '+');
    });

    it('ignores other arguments', () => {
      const result = EvalFunctions.DecodeURIComponent(['%2B', '%2B']);
      assert.equal(result, '+');
    });
  });
});
