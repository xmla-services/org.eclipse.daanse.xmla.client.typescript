import type { Annotations12 } from "./Annotations12";

/**
 * AttributePermission
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface AttributePermission {
  /** xsd:string */
  AttributeID?: string;
  /** xsd:string */
  Description?: string;
  /** xsd:string */
  DefaultMember?: string;
  /** xsd:string */
  VisualTotals?: string;
  /** xsd:string */
  AllowedSet?: string;
  /** xsd:string */
  DeniedSet?: string;
  /** Annotations */
  Annotations?: Annotations12;
}
