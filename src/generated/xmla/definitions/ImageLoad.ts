import type { Data } from "./Data";

/**
 * ImageLoad
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface ImageLoad {
  /** xsd:string */
  ImagePath?: string;
  /** xsd:string */
  ImageUrl?: string;
  /** xsd:string */
  ImageUniqueID?: string;
  /** xsd:string */
  ImageVersion?: string;
  /** xsd:string|ReadWrite,ReadOnly,ReadOnlyExclusive */
  ReadWriteMode?: string;
  /** xsd:string */
  DbStorageLocation?: string;
  /** xsd:string */
  DatabaseName?: string;
  /** xsd:string */
  DatabaseID?: string;
  /** Data */
  Data?: Data;
}
