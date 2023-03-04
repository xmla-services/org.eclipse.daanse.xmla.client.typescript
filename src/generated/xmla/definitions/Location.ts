import type { Start } from "./Start";
import type { End } from "./End";
import type { SourceObject } from "./SourceObject";

/**
 * Location
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis:exception`
 */
export interface Location {
  /** Start */
  Start?: Start;
  /** End */
  End?: End;
  /** xsd:int */
  LineOffset?: string;
  /** xsd:int */
  TextLength?: string;
  /** SourceObject */
  SourceObject?: SourceObject;
  /** DependsOnObject */
  DependsOnObject?: SourceObject;
  /** xsd:int */
  RowNumber?: string;
}
