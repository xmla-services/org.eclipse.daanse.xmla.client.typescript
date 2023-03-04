import type { Annotations35 } from "./Annotations35";

/**
 * DataSourceView
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface DataSourceView {
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
  Annotations?: Annotations35;
  /** xsd:string */
  DataSourceID?: string;
}
