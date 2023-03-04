import type { Annotations50 } from "./Annotations50";

/**
 * DatabasePermission
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface DatabasePermission {
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
  Annotations?: Annotations50;
  /** xsd:string */
  RoleID?: string;
  /** xsd:boolean */
  Process?: string;
  /** xsd:string|None,Basic,Allowed */
  ReadDefinition?: string;
  /** xsd:string|None,Allowed */
  Read?: string;
  /** xsd:boolean */
  Administer?: string;
  /** xsd:string|None */
  Write?: string;
}
