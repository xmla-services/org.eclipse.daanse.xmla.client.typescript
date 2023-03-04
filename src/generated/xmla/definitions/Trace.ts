import type { Annotations53 } from "./Annotations53";
import type { Filter } from "./Filter";
import type { EventType } from "./EventType";

/**
 * Trace
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Trace {
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
  Annotations?: Annotations53;
  /** xsd:string */
  LogFileName?: string;
  /** xsd:boolean */
  LogFileAppend?: string;
  /** xsd:long */
  LogFileSize?: string;
  /** xsd:boolean */
  Audit?: string;
  /** xsd:boolean */
  LogFileRollover?: string;
  /** xsd:boolean */
  AutoRestart?: string;
  /** xsd:dateTime */
  StopTime?: string;
  /** Filter */
  Filter?: Filter;
  /** EventType */
  EventType?: EventType;
}
