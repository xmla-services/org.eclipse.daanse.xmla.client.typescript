import type { Annotations14 } from "./Annotations14";

/**
 * CellPermission
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface CellPermission {
  /** xsd:string|Read,ReadContingent,ReadWrite */
  Access?: string;
  /** xsd:string */
  Description?: string;
  /** xsd:string */
  Expression?: string;
  /** Annotations */
  Annotations?: Annotations14;
}
