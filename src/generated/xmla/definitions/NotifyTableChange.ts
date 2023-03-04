import type { ParentObject } from "./ParentObject";
import type { TableNotifications } from "./TableNotifications";

/**
 * NotifyTableChange
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface NotifyTableChange {
  /** Object */
  Object?: ParentObject;
  /** TableNotifications */
  TableNotifications?: TableNotifications;
}
