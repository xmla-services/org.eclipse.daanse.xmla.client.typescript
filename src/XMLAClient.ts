import type { Client } from "../eMondrianUtils/SOAPInBrowser/src/client";
import type { Authenticate } from "./generated/xmla/definitions/Authenticate";
import type { AuthenticateResponse } from "./generated/xmla/definitions/AuthenticateResponse";
import type { Discover } from "./generated/xmla/definitions/Discover";
import type { DiscoverResponse } from "./generated/xmla/definitions/DiscoverResponse";
import type { Execute } from "./generated/xmla/definitions/Execute";
import type { ExecuteResponse } from "./generated/xmla/definitions/ExecuteResponse";
import type { MsXmlAnalysisService } from "./generated/xmla/services/MsXmlAnalysisService";
import { createClient } from "../eMondrianUtils/SOAPInBrowser/src/soap";

export interface XmlaClient extends Client {
  MsXmlAnalysisService: MsXmlAnalysisService;
  AuthenticateAsync(
    authenticate: Authenticate
  ): Promise<
    [
      result: AuthenticateResponse,
      rawResponse: any,
      soapHeader: any,
      rawRequest: any
    ]
  >;
  DiscoverAsync(
    discover: Discover
  ): Promise<
    [
      result: DiscoverResponse,
      rawResponse: any,
      soapHeader: any,
      rawRequest: any
    ]
  >;
  ExecuteAsync(
    execute: Execute
  ): Promise<
    [
      result: ExecuteResponse,
      rawResponse: any,
      soapHeader: any,
      rawRequest: any
    ]
  >;
}

/** Create XmlaClient */
export function createClientAsync(
  ...args: Parameters<typeof createClient>
): Promise<XmlaClient> {
  return createClient(args[0], args[1]) as any;
}
