import type { Not } from "./Not";
import type { Or } from "./Or";
import type { Equal } from "./Equal";

/**
 * Filter
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Filter {
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
