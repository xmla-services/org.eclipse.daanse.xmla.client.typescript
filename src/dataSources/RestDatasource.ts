/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/
export default class RESTDatasource {
  public url = null;
  public id = null as unknown as string;
  public caption = null;
  public type = "REST";

  constructor(id, url, caption) {
    this.id = id;
    this.url = url;
    this.caption = caption;
  }

  async getData(url) {
    const req = await fetch(`${this.url}${url}`);
    return await req.json();
  }

  getState() {
    return {
      id: this.id,
      url: this.url,
      caption: this.caption,
      type: this.type,
    };
  }
}
