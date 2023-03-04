import type { Annotations } from "./Annotations";
import type { Dimensions } from "./Dimensions";
import type { Aggregations } from "./Aggregations";

/**
 * AggregationDesign
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface AggregationDesign {
  /** xsd:string */
  Name?: string;
  /** xsd:string */
  ID?: string;
  /** xsd:dateTime */
  CreatedTimestamp?: string;
  /** xsd:dateTime */
  LastSchemaUpdate?: string;
  /** xsd:string */
  Description?: string;
  /** Annotations */
  Annotations?: Annotations;
  /** xsd:long */
  EstimatedRows?: string;
  /** Dimensions */
  Dimensions?: Dimensions;
  /** Aggregations */
  Aggregations?: Aggregations;
  /** xsd:integer */
  EstimatedPerformanceGain?: string;
}
