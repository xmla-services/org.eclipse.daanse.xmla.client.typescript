import type { Translations1 } from "./Translations1";
import type { Attributes2 } from "./Attributes2";
import type { Hierarchies } from "./Hierarchies";
import type { Annotations10 } from "./Annotations10";

/**
 * Dimension
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Dimension2 {
  /** xsd:string */
  ID?: string;
  /** xsd:string */
  Name?: string;
  /** xsd:string */
  Description?: string;
  /** Translations */
  Translations?: Translations1;
  /** xsd:string */
  DimensionID?: string;
  /** xsd:boolean */
  Visible?: string;
  /** xsd:string|Full,None,Unrestricted,Default */
  AllMemberAggregationUsage?: string;
  /** xsd:string|IncludeDimensionName,ExcludeDimensionName */
  HierarchyUniqueNameStyle?: string;
  /** xsd:string|Native,NamePath */
  MemberUniqueNameStyle?: string;
  /** Attributes */
  Attributes?: Attributes2;
  /** Hierarchies */
  Hierarchies?: Hierarchies;
  /** Annotations */
  Annotations?: Annotations10;
}
