import type { Annotations45 } from "./Annotations45";

/**
 * MiningStructurePermission
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface MiningStructurePermission {
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
  Annotations?: Annotations45;
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
  /** xsd:string|None */
  Write?: string;
}
