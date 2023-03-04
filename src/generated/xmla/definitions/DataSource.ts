import type { Annotations33 } from "./Annotations33";
import type { ImpersonationInfo } from "./ImpersonationInfo";
import type { DataSourcePermissions } from "./DataSourcePermissions";

/**
 * DataSource
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface DataSource {
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
  Annotations?: Annotations33;
  /** xsd:string */
  ManagedProvider?: string;
  /** xsd:string */
  ConnectionString?: string;
  /** xsd:string|PasswordRemoved,Unchanged */
  ConnectionStringSecurity?: string;
  /** ImpersonationInfo */
  ImpersonationInfo?: ImpersonationInfo;
  /** xsd:string|ReadCommitted,Snapshot */
  Isolation?: string;
  /** xsd:integer */
  MaxActiveConnections?: string;
  /** xsd:duration */
  Timeout?: string;
  /** DataSourcePermissions */
  DataSourcePermissions?: DataSourcePermissions;
  /** QueryImpersonationInfo */
  QueryImpersonationInfo?: ImpersonationInfo;
  /** xsd:string */
  QueryHints?: string;
}
