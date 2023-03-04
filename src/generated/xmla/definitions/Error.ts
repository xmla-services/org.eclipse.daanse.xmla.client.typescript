import type { Location } from "./Location";

/**
 * Error
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis:exception`
 */
export interface Error {
  /** Location */
  Location?: Location;
  /** xsd:string */
  Callstack?: string;
}
