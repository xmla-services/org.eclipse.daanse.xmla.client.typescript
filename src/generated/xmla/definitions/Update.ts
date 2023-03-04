import type { Object } from "./Object";
import type { Attributes8 } from "./Attributes8";
import type { Where } from "./Where";

/**
 * Update
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Update {
  /** Object */
  Object?: Object;
  /** Attributes */
  Attributes?: Attributes8;
  /** xsd:boolean */
  MoveWithDescendants?: string;
  /** xsd:boolean */
  MoveToRoot?: string;
  /** Where */
  Where?: Where;
}
