import type { Warning } from "./Warning";
import type { Error } from "./Error";

/**
 * Messages
 * @targetNSAlias `ana-x`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis:exception`
 */
export interface Messages {
  /** Warning */
  Warning?: Warning;
  /** Error */
  Error?: Error;
}
