import type { Attributes } from "./Attributes";
import type { Annotations1 } from "./Annotations1";

/**
 * Dimension
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Dimension {
  /** xsd:string */
  CubeDimensionID?: string;
  /** Attributes */
  Attributes?: Attributes;
  /** Annotations */
  Annotations?: Annotations1;
}
