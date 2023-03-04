import type { Translations6 } from "./Translations6";
import type { Annotations30 } from "./Annotations30";

/**
 * Kpi
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Kpi1 {
  /** xsd:string */
  Name?: string;
  /** xsd:string */
  ID?: string;
  /** xsd:string */
  Description?: string;
  /** Translations */
  Translations?: Translations6;
  /** xsd:string */
  DisplayFolder?: string;
  /** xsd:string */
  AssociatedMeasureGroupID?: string;
  /** xsd:string */
  Value?: string;
  /** xsd:string */
  Goal?: string;
  /** xsd:string */
  Status?: string;
  /** xsd:string */
  Trend?: string;
  /** xsd:string */
  Weight?: string;
  /** xsd:string */
  TrendGraphic?: string;
  /** xsd:string */
  StatusGraphic?: string;
  /** xsd:string */
  CurrentTimeMember?: string;
  /** xsd:string */
  ParentKpiID?: string;
  /** Annotations */
  Annotations?: Annotations30;
}
