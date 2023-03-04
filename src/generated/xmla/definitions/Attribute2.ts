import type { Annotations8 } from "./Annotations8";

/**
 * Attribute
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Attribute2 {
  /** xsd:string */
  AttributeID?: string;
  /** xsd:string|Full,None,Unrestricted,Default */
  AggregationUsage?: string;
  /** xsd:string|FullyOptimized,NotOptimized */
  AttributeHierarchyOptimizedState?: string;
  /** xsd:boolean */
  AttributeHierarchyEnabled?: string;
  /** xsd:boolean */
  AttributeHierarchyVisible?: string;
  /** Annotations */
  Annotations?: Annotations8;
}
