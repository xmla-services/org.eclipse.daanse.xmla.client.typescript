import type { Annotations15 } from "./Annotations15";
import type { Commands } from "./Commands";
import type { CalculationProperties } from "./CalculationProperties";

/**
 * MdxScript
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface MdxScript {
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
  Annotations?: Annotations15;
  /** Commands */
  Commands?: Commands;
  /** xsd:boolean */
  DefaultScript?: string;
  /** CalculationProperties */
  CalculationProperties?: CalculationProperties;
}
