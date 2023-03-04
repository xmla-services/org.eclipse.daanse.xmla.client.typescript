import type { Columns3 } from "./Columns3";

/**
 * Event
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Event {
  /** xsd:string */
  EventID?: string;
  /** Columns */
  Columns?: Columns3;
}
