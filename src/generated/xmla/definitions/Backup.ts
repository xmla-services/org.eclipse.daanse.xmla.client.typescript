import type { ParentObject } from "./ParentObject";
import type { Locations } from "./Locations";

/**
 * Backup
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Backup {
  /** Object */
  Object?: ParentObject;
  /** xsd:string */
  File?: string;
  /** xsd:string|SkipMembership,CopyAll,IgnoreSecurity */
  Security?: string;
  /** xsd:boolean */
  ApplyCompression?: string;
  /** xsd:boolean */
  AllowOverwrite?: string;
  /** xsd:string */
  Password?: string;
  /** xsd:boolean */
  BackupRemotePartitions?: string;
  /** Locations */
  Locations?: Locations;
}
