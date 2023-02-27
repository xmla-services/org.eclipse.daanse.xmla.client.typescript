import type { PiniaPluginContext } from "pinia";
import { createClient } from "../../eMondrianUtils/SOAPInBrowser/src/soap";

export default async function ({ store }: PiniaPluginContext) {
  store.$state.$soapClient = await createClient("def/xmla.wsdl");
}
