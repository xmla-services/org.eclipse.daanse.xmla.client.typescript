import type { Annotations9 } from "./Annotations9";

/**
 * Hierarchy
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Hierarchy {
  /** xsd:string */
  HierarchyID?: string;
  /** xsd:string|FullyOptimized,NotOptimized */
  OptimizedState?: string;
  /** xsd:boolean */
  Visible?: string;
  /** xsd:boolean */
  Enabled?: string;
  /** Annotations */
  Annotations?: Annotations9;
}
