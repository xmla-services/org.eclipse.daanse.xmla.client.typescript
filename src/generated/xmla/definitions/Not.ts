import type { Or } from "./Or";
import type { Equal } from "./Equal";

/**
 * Not
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Not {
  /** Not */
  Not?: Not;
  /** Or */
  Or?: Or;
  /** And */
  And?: Or;
  /** Equal */
  Equal?: Equal;
  /** NotEqual */
  NotEqual?: Equal;
  /** Less */
  Less?: Equal;
  /** LessOrEqual */
  LessOrEqual?: Equal;
  /** Greater */
  Greater?: Equal;
  /** GreaterOrEqual */
  GreaterOrEqual?: Equal;
  /** Like */
  Like?: Equal;
  /** NotLike */
  NotLike?: Equal;
}
