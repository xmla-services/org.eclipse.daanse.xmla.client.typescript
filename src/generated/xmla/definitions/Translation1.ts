import type { Annotations38 } from "./Annotations38";
import type { Source } from "./Source";

/**
 * Translation
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Translation1 {
  /** xsd:unsignedInt */
  Language?: string;
  /** xsd:string */
  Caption?: string;
  /** xsd:string */
  Description?: string;
  /** xsd:string */
  DisplayFolder?: string;
  /** Annotations */
  Annotations?: Annotations38;
  /** CaptionColumn */
  CaptionColumn?: Source;
  /** xsd:string */
  MembersWithDataCaption?: string;
}
