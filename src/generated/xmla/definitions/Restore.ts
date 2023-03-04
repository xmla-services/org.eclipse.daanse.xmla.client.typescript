import type { Locations1 } from "./Locations1";

/**
 * Restore
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Restore {
  /** xsd:string */
  DatabaseName?: string;
  /** xsd:string */
  DatabaseID?: string;
  /** xsd:string */
  File?: string;
  /** xsd:string|SkipMembership,CopyAll,IgnoreSecurity */
  Security?: string;
  /** xsd:boolean */
  AllowOverwrite?: string;
  /** xsd:string */
  Password?: string;
  /** xsd:string */
  DbStorageLocation?: string;
  /** xsd:string|ReadWrite,ReadOnly,ReadOnlyExclusive */
  ReadWriteMode?: string;
  /** Locations */
  Locations?: Locations1;
}
