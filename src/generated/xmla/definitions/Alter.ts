import type { ParentObject } from "./ParentObject";
import type { ObjectDefinition } from "./ObjectDefinition";

/**
 * Alter
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Alter {
  /** Object */
  Object?: ParentObject;
  /** ObjectDefinition */
  ObjectDefinition?: ObjectDefinition;
}
