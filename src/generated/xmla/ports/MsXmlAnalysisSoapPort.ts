import type { Authenticate } from "../definitions/Authenticate";
import type { AuthenticateResponse } from "../definitions/AuthenticateResponse";
import type { Discover } from "../definitions/Discover";
import type { DiscoverResponse } from "../definitions/DiscoverResponse";
import type { Execute } from "../definitions/Execute";
import type { ExecuteResponse } from "../definitions/ExecuteResponse";

export interface MsXmlAnalysisSoapPort {
  Authenticate(
    authenticate: Authenticate,
    callback: (
      err: any,
      result: AuthenticateResponse,
      rawResponse: any,
      soapHeader: any,
      rawRequest: any
    ) => void
  ): void;
  Discover(
    discover: Discover,
    callback: (
      err: any,
      result: DiscoverResponse,
      rawResponse: any,
      soapHeader: any,
      rawRequest: any
    ) => void
  ): void;
  Execute(
    execute: Execute,
    callback: (
      err: any,
      result: ExecuteResponse,
      rawResponse: any,
      soapHeader: any,
      rawRequest: any
    ) => void
  ): void;
}
