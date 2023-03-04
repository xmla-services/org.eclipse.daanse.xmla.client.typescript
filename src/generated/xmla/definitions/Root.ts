import type { Row } from "./Row";
import type { Exception } from "./Exception";
import type { Messages } from "./Messages";

/**
 * root
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis:rowset`
 */
export interface Root {
  /** row[] */
  row?: Array<Row>;
  /** Exception */
  Exception?: Exception;
  /** Messages */
  Messages?: Messages;
}
