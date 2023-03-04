import type { Source3 } from "./Source3";

/**
 * ProactiveCaching
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface ProactiveCaching {
  /** xsd:string|Immediate,OnCacheComplete */
  OnlineMode?: string;
  /** xsd:string|Regular,MolapOnly */
  AggregationStorage?: string;
  /** Source */
  Source?: Source3;
  /** xsd:duration */
  SilenceInterval?: string;
  /** xsd:duration */
  Latency?: string;
  /** xsd:duration */
  SilenceOverrideInterval?: string;
  /** xsd:duration */
  ForceRebuildInterval?: string;
  /** xsd:boolean */
  Enabled?: string;
}
