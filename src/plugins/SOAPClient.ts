/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/
import { createClientAsync, type XmlaClient } from "@/XMLAClient";
import type { PiniaPluginContext } from "pinia";

let client: XmlaClient;
let clientResolveFn;
let inited = false;
const clientPromise: Promise<XmlaClient> = new Promise((res) => {
  clientResolveFn = res;
});

const initClient = async (url) => {
  if (!inited) {
    inited = true;
    client = await createClientAsync(url);
    clientResolveFn(client);
  }

  return clientPromise;
};

export default async function ({ store }: PiniaPluginContext) {
  store.$state.$soapClient = initClient("def/xmla.wsdl");
}
