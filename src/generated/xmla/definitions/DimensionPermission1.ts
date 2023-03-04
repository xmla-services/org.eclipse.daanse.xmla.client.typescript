import type { Annotations37 } from "./Annotations37";
import type { AttributePermissions1 } from "./AttributePermissions1";

/**
 * DimensionPermission
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface DimensionPermission1 {
  /** xsd:string */
  Name?: string;
  /** xsd:string */
  ID?: string;
  /** xsd:dateTime */
  CreatedTimestamp?: string;
  /** xsd:dateTime */
  LastSchemaUpdate?: string;
  /** xsd:string */
  Description?: string;
  /** Annotations */
  Annotations?: Annotations37;
  /** xsd:string */
  RoleID?: string;
  /** xsd:boolean */
  Process?: string;
  /** xsd:string|None,Basic,Allowed */
  ReadDefinition?: string;
  /** xsd:string|None,Allowed */
  Read?: string;
  /** AttributePermissions */
  AttributePermissions?: AttributePermissions1;
  /** xsd:string|None,Allowed */
  Write?: string;
  /** xsd:string */
  AllowedRowsExpression?: string;
}
