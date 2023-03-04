import type { ParentObject } from "./ParentObject";

/**
 * Subscribe
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Subscribe {
  /** Object */
  Object?: ParentObject;
  /** xsd:string */
  SubscriptionId?: string;
}
