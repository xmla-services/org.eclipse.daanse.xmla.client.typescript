/**
 * Attach
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Attach {
  /** xsd:string */
  Folder?: string;
  /** xsd:string */
  Password?: string;
  /** xsd:boolean */
  AllowOverwrite?: string;
  /** xsd:string|ReadWrite,ReadOnly,ReadOnlyExclusive */
  ReadWriteMode?: string;
}
