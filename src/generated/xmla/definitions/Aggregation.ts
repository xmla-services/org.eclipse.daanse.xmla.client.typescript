import type { Dimensions1 } from "./Dimensions1";
import type { Annotations4 } from "./Annotations4";

/**
 * Aggregation
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Aggregation {
  /** xsd:string */
  ID?: string;
  /** xsd:string */
  Name?: string;
  /** Dimensions */
  Dimensions?: Dimensions1;
  /** Annotations */
  Annotations?: Annotations4;
  /** xsd:string */
  Description?: string;
}
