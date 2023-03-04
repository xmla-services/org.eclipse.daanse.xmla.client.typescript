import type { ParentObject } from "./ParentObject";

/**
 * Lock
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Lock {
  /** xsd:token|pattern */
  ID?: string;
  /** Object */
  Object?: ParentObject;
  /** xsd:string|CommitShared,CommitExclusive */
  Mode?: string;
}
