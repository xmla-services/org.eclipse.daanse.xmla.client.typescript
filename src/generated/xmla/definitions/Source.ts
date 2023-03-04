import type { Source1 } from "./Source1";
import type { Annotations26 } from "./Annotations26";

/**
 * Source
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Source {
  /** xsd:string|WChar,Integer,BigInt,Single,Double,Date,Currency,UnsignedTinyInt,UnsignedSmallInt,UnsignedInt,UnsignedBigInt,Bool,Smallint,Tinyint,Binary */
  DataType?: string;
  /** xsd:integer */
  DataSize?: string;
  /** xsd:string */
  MimeType?: string;
  /** xsd:string|Preserve,Error,UnknownMember,ZeroOrBlank,Automatic */
  NullProcessing?: string;
  /** xsd:string|Left,Right,LeftRight,None */
  Trimming?: string;
  /** xsd:string|Preserve,Remove,Replace */
  InvalidXmlCharacters?: string;
  /** xsd:string */
  Collation?: string;
  /** xsd:string|TrimRight,TrimLeft,TrimAll,TrimNone */
  Format?: string;
  /** Source */
  Source?: Source1;
  /** Annotations */
  Annotations?: Annotations26;
}
