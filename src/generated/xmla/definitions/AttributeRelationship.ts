import type { Annotations39 } from "./Annotations39";
import type { Translations9 } from "./Translations9";

/**
 * AttributeRelationship
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface AttributeRelationship {
  /** xsd:string */
  AttributeID?: string;
  /** xsd:string|Rigid,Flexible */
  RelationshipType?: string;
  /** xsd:string|Many,One */
  Cardinality?: string;
  /** xsd:string|Mandatory,Optional */
  Optionality?: string;
  /** xsd:string|None,Strong */
  OverrideBehavior?: string;
  /** Annotations */
  Annotations?: Annotations39;
  /** xsd:string */
  Name?: string;
  /** xsd:boolean */
  Visible?: string;
  /** Translations */
  Translations?: Translations9;
}
