import type { Measures } from "./Measures";
import type { Annotations21 } from "./Annotations21";

/**
 * MeasureGroup
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface MeasureGroup {
  /** xsd:string */
  MeasureGroupID?: string;
  /** Measures */
  Measures?: Measures;
  /** Annotations */
  Annotations?: Annotations21;
}
