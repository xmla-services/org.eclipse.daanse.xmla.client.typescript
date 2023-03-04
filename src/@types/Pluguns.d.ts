import "pinia";
import type XmlaClient from "@/XMLAClient";

declare module "pinia" {
  export interface PiniaCustomStateProperties {
    $soapClient: XmlaClient;
  }
}
