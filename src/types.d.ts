export declare type VariablesMap = {[key: string]: string};
import { Variable } from '@advanced-rest-client/arc-types';

export declare interface EvaluateOptions {
  /**
   * A list of variables to override in created context.
   */
  override?: Variable.SystemVariables;
  /**
   * The execution context to use instead of creating the context≥
   */
  context?: VariablesMap;
  /**
   * The list of properties to evaluate. If not set then it scans for all keys in the object.
   * This is used when evaluating objects.
   */
  names?: string[];
}
