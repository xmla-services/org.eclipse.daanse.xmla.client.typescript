import { createClientAsync } from "@/XMLAClient";
import type { PiniaPluginContext } from "pinia";

export default async function ({ store }: PiniaPluginContext) {
  store.$state.$soapClient = await createClientAsync("def/xmla.wsdl");
}
