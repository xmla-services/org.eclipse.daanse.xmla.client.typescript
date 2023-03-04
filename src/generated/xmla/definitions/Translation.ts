import type { Annotations7 } from "./Annotations7";

/**
 * Translation
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Translation {
  /** xsd:unsignedInt */
  Language?: string;
  /** xsd:string */
  Caption?: string;
  /** xsd:string */
  Description?: string;
  /** xsd:string */
  DisplayFolder?: string;
  /** Annotations */
  Annotations?: Annotations7;
}
