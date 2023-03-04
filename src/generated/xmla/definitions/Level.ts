import type { Translations11 } from "./Translations11";
import type { Annotations41 } from "./Annotations41";

/**
 * Level
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Level {
  /** xsd:string */
  Name?: string;
  /** xsd:string */
  ID?: string;
  /** xsd:string */
  Description?: string;
  /** xsd:string */
  SourceAttributeID?: string;
  /** xsd:string|Never,OnlyChildWithNoName,OnlyChildWithParentName,NoName,ParentName */
  HideMemberIf?: string;
  /** Translations */
  Translations?: Translations11;
  /** Annotations */
  Annotations?: Annotations41;
}
