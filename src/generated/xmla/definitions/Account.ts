import type { Aliases } from "./Aliases";
import type { Annotations32 } from "./Annotations32";

/**
 * Account
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Account {
  /** xsd:string */
  AccountType?: string;
  /** xsd:string|Sum,Count,Min,Max,DistinctCount,None,AverageOfChildren,FirstChild,LastChild,FirstNonEmpty,LastNonEmpty */
  AggregationFunction?: string;
  /** Aliases */
  Aliases?: Aliases;
  /** Annotations */
  Annotations?: Annotations32;
}
