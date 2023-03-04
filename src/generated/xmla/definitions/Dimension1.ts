import type { Attributes1 } from "./Attributes1";
import type { Annotations3 } from "./Annotations3";

/**
 * Dimension
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Dimension1 {
  /** xsd:string */
  CubeDimensionID?: string;
  /** Attributes */
  Attributes?: Attributes1;
  /** Annotations */
  Annotations?: Annotations3;
}
