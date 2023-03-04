/**
 * Cancel
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Cancel {
  /** xsd:integer */
  ConnectionID?: string;
  /** xsd:string */
  SessionID?: string;
  /** xsd:integer */
  SPID?: string;
  /** xsd:boolean */
  CancelAssociated?: string;
}
