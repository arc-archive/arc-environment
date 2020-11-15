/**
 * Processes string value tokens.
 */
declare class EvalFunctions {
  /**
   * Calls `encodeURIComponent()` function on the first item of arguments array
   * @param args List of expression arguments
   * @return Encoded value
   * @throws {Error} When input has no value.
   */
  static EncodeURIComponent(args: string[]): string;

  /**
   * Calls `decodeURIComponent()` function on the first item of arguments array
   * @param args List of expression arguments
   * @return Decoded value
   * @throws {Error} When input has no value.
   */
  static DecodeURIComponent(args: string[]): string;
}

export { EvalFunctions };
