import type { Annotations48 } from "./Annotations48";

/**
 * MiningModelPermission
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface MiningModelPermission {
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
  Annotations?: Annotations48;
  /** xsd:string */
  RoleID?: string;
  /** xsd:boolean */
  Process?: string;
  /** xsd:string|None,Basic,Allowed */
  ReadDefinition?: string;
  /** xsd:string|None,Allowed */
  Read?: string;
  /** xsd:boolean */
  AllowDrillThrough?: string;
  /** xsd:boolean */
  AllowBrowsing?: string;
  /** xsd:string|None,Allowed */
  Write?: string;
}
