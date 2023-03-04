import type { Annotations5 } from "./Annotations5";
import type { ImpersonationInfo } from "./ImpersonationInfo";

/**
 * Assembly
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Assembly {
  /** xsd:string */
  ID?: string;
  /** xsd:string */
  Name?: string;
  /** xsd:dateTime */
  CreatedTimestamp?: string;
  /** xsd:dateTime */
  LastSchemaUpdate?: string;
  /** xsd:string */
  Description?: string;
  /** Annotations */
  Annotations?: Annotations5;
  /** ImpersonationInfo */
  ImpersonationInfo?: ImpersonationInfo;
}
