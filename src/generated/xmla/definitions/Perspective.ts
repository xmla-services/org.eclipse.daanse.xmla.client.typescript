import type { Annotations16 } from "./Annotations16";
import type { Translations3 } from "./Translations3";
import type { Dimensions3 } from "./Dimensions3";
import type { MeasureGroups } from "./MeasureGroups";
import type { Calculations } from "./Calculations";
import type { Kpis } from "./Kpis";
import type { Actions } from "./Actions";

/**
 * Perspective
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Perspective {
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
  Annotations?: Annotations16;
  /** Translations */
  Translations?: Translations3;
  /** xsd:string */
  DefaultMeasure?: string;
  /** Dimensions */
  Dimensions?: Dimensions3;
  /** MeasureGroups */
  MeasureGroups?: MeasureGroups;
  /** Calculations */
  Calculations?: Calculations;
  /** Kpis */
  Kpis?: Kpis;
  /** Actions */
  Actions?: Actions;
}
