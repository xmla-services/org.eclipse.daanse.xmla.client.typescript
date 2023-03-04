import type { Translations2 } from "./Translations2";
import type { VisualizationProperties } from "./VisualizationProperties";

/**
 * CalculationProperty
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface CalculationProperty {
  /** xsd:string */
  CalculationReference?: string;
  /** xsd:string|Member,Set,Cells */
  CalculationType?: string;
  /** Translations */
  Translations?: Translations2;
  /** xsd:string */
  Description?: string;
  /** xsd:boolean */
  Visible?: string;
  /** xsd:integer */
  SolveOrder?: string;
  /** xsd:string */
  FormatString?: string;
  /** xsd:string */
  ForeColor?: string;
  /** xsd:string */
  BackColor?: string;
  /** xsd:string */
  FontName?: string;
  /** xsd:string */
  FontSize?: string;
  /** xsd:string */
  FontFlags?: string;
  /** xsd:string */
  NonEmptyBehavior?: string;
  /** xsd:string */
  AssociatedMeasureGroupID?: string;
  /** xsd:string */
  DisplayFolder?: string;
  /** xsd:integer */
  Language?: string;
  /** VisualizationProperties */
  VisualizationProperties?: VisualizationProperties;
}
