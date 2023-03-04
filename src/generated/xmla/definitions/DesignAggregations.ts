import type { ParentObject } from "./ParentObject";
import type { Queries } from "./Queries";

/**
 * DesignAggregations
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface DesignAggregations {
  /** Object */
  Object?: ParentObject;
  /** xsd:duration */
  Time?: string;
  /** xsd:integer */
  Steps?: string;
  /** xsd:double */
  Optimization?: string;
  /** xsd:long */
  Storage?: string;
  /** xsd:boolean */
  Materialize?: string;
  /** Queries */
  Queries?: Queries;
}
