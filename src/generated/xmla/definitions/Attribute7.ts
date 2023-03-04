import type { Keys } from "./Keys";
import type { Translations18 } from "./Translations18";

/**
 * Attribute
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Attribute7 {
  /** xsd:string */
  AttributeName?: string;
  /** xsd:string */
  Name?: string;
  /** Keys */
  Keys?: Keys;
  /** Translations */
  Translations?: Translations18;
  /** xsd:string */
  Value?: string;
  /** xsd:string */
  CUSTOM_ROLLUP?: string;
  /** xsd:string */
  CUSTOM_ROLLUP_PROPERTIES?: string;
  /** xsd:string */
  UNARY_OPERATOR?: string;
  /** xsd:integer */
  SKIPPED_LEVELS?: string;
}
