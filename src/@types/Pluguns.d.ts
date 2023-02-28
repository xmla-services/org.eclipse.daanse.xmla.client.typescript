import type { Client } from "@/utils/browser-soap/client";
import "pinia";

declare module "pinia" {
  export interface PiniaCustomStateProperties {
    $soapClient: Client;
  }
}
