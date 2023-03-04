import type { FromRelationshipEnd } from "./FromRelationshipEnd";

/**
 * Relationship
 * @targetNSAlias `__tns__`
 * @targetNamespace `http://schemas.microsoft.com/analysisservices/2011/engine/300/300`
 */
export interface Relationship {
  /** xsd:string */
  ID?: string;
  /** xsd:boolean */
  Visible?: string;
  /** FromRelationshipEnd */
  FromRelationshipEnd?: FromRelationshipEnd;
  /** ToRelationshipEnd */
  ToRelationshipEnd?: FromRelationshipEnd;
}
