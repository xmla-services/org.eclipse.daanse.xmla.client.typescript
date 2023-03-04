import type { AttributePermissions } from "./AttributePermissions";
import type { Annotations13 } from "./Annotations13";

/**
 * DimensionPermission
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface DimensionPermission {
  /** xsd:string */
  CubeDimensionID?: string;
  /** xsd:string */
  Description?: string;
  /** xsd:string|None,Allowed */
  Read?: string;
  /** xsd:string|None,Allowed */
  Write?: string;
  /** AttributePermissions */
  AttributePermissions?: AttributePermissions;
  /** Annotations */
  Annotations?: Annotations13;
}
