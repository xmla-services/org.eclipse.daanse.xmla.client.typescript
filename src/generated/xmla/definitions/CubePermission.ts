import type { Annotations11 } from "./Annotations11";
import type { DimensionPermissions } from "./DimensionPermissions";
import type { CellPermissions } from "./CellPermissions";

/**
 * CubePermission
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface CubePermission {
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
  Annotations?: Annotations11;
  /** xsd:string */
  RoleID?: string;
  /** xsd:boolean */
  Process?: string;
  /** xsd:string|None,Basic,Allowed */
  ReadDefinition?: string;
  /** xsd:string|None,Allowed */
  Read?: string;
  /** xsd:string|None,Allowed */
  ReadSourceData?: string;
  /** DimensionPermissions */
  DimensionPermissions?: DimensionPermissions;
  /** CellPermissions */
  CellPermissions?: CellPermissions;
  /** xsd:string|None,Allowed */
  Write?: string;
}
