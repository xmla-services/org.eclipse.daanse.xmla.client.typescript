import type { Attributes6 } from "./Attributes6";
import type { Translations12 } from "./Translations12";
import type { VisualizationProperties3 } from "./VisualizationProperties3";

/**
 * FromRelationshipEnd
 * @targetNSAlias `__tns__`
 * @targetNamespace `http://schemas.microsoft.com/analysisservices/2011/engine/300/300`
 */
export interface FromRelationshipEnd {
  /** xsd:string */
  Role?: string;
  /** xsd:string|One,Many */
  Multiplicity?: string;
  /** xsd:string */
  DimensionID?: string;
  /** Attributes */
  Attributes?: Attributes6;
  /** Translations */
  Translations?: Translations12;
  /** VisualizationProperties */
  VisualizationProperties?: VisualizationProperties3;
}
