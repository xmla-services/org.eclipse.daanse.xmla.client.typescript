/**
 * ErrorConfiguration
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface ErrorConfiguration {
  /** xsd:long */
  KeyErrorLimit?: string;
  /** xsd:string */
  KeyErrorLogFile?: string;
  /** xsd:string|ConvertToUnknown,DiscardRecord */
  KeyErrorAction?: string;
  /** xsd:string|StopProcessing,StopLogging */
  KeyErrorLimitAction?: string;
  /** xsd:string|IgnoreError,ReportAndContinue,ReportAndStop */
  KeyNotFound?: string;
  /** xsd:string|IgnoreError,ReportAndContinue,ReportAndStop */
  KeyDuplicate?: string;
  /** xsd:string|IgnoreError,ReportAndContinue,ReportAndStop */
  NullKeyConvertedToUnknown?: string;
  /** xsd:string|IgnoreError,ReportAndContinue,ReportAndStop */
  NullKeyNotAllowed?: string;
  /** xsd:string|IgnoreError,ReportAndStop */
  CalculationError?: string;
}
