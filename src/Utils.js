/**
 * Computes value for a variable label depending on value of `maskedValues`.
 *
 * @param {string} value Variable value
 * @param {boolean} maskedValues True to masks the value.
 * @return {string} When `maskedValues` is true then it returns series of `•`.
 * The input otherwise.
 */
export const variableValueLabel = (value, maskedValues) => {
  if (!value) {
    return '(empty)';
  }
  if (maskedValues) {
    const len = value.length;
    const arr = new Array(len);
    return arr.fill('•', 0, len).join('');
  }
  return value;
};
