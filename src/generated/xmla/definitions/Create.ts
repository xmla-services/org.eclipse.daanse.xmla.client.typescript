import type { ParentObject } from "./ParentObject";
import type { ObjectDefinition } from "./ObjectDefinition";

/**
 * Create
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Create {
  /** ParentObject */
  ParentObject?: ParentObject;
  /** ObjectDefinition */
  ObjectDefinition?: ObjectDefinition;
}
