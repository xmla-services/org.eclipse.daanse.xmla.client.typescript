/**
 * ImpersonationInfo
 * @targetNSAlias `eng`
 * @targetNamespace `http://schemas.microsoft.com/analysisservices/2003/engine`
 */
export interface ImpersonationInfo {
  /** xsd:string|Default,ImpersonateServiceAccount,ImpersonateAnonymous,ImpersonateCurrentUser,ImpersonateAccount */
  ImpersonationMode?: string;
  /** xsd:string */
  Account?: string;
  /** xsd:string */
  Password?: string;
  /** xsd:string|PasswordRemoved,Unchanged */
  ImpersonationInfoSecurity?: string;
}
