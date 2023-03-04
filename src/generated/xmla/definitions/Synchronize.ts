import type { Source6 } from "./Source6";
import type { Locations2 } from "./Locations2";

/**
 * Synchronize
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Synchronize {
  /** Source */
  Source?: Source6;
  /** xsd:string|SkipMembership,CopyAll,IgnoreSecurity */
  SynchronizeSecurity?: string;
  /** xsd:boolean */
  ApplyCompression?: string;
  /** xsd:string */
  DbStorageLocation?: string;
  /** Locations */
  Locations?: Locations2;
}
