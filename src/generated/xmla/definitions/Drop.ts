import type { Object } from "./Object";
import type { Where } from "./Where";

/**
 * Drop
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Drop {
  /** Object */
  Object?: Object;
  /** xsd:boolean */
  DeleteWithDescendants?: string;
  /** Where */
  Where?: Where;
}
