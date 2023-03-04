import type { Attributes3 } from "./Attributes3";
import type { Hierarchies1 } from "./Hierarchies1";
import type { Annotations19 } from "./Annotations19";

/**
 * Dimension
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Dimension3 {
  /** xsd:string */
  CubeDimensionID?: string;
  /** Attributes */
  Attributes?: Attributes3;
  /** Hierarchies */
  Hierarchies?: Hierarchies1;
  /** Annotations */
  Annotations?: Annotations19;
}
