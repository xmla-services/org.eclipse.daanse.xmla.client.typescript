/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/

import mqtt from "mqtt";
import DataSource from "@/dataSources/DataSource";

export default class MQTTDatasource extends DataSource implements IDatasource {
  public static TYPE = "MQTT";
  public url: string;
  public id: string;
  public caption: string;
  public type = MQTTDatasource.TYPE;

  private _msg_parsed: any = {};
  private eventBus: any;

  constructor(id, url, caption, eventBus) {
    super();
    console.log(eventBus);
    this.id = id;
    this.url = url;
    this.caption = caption;
    this.eventBus = eventBus;

    try {
      const client = mqtt.connect(this.url, {
        port: 8081,
        username: "iwoms",
        password: "b2952fa553ad3ac2",
      });
      client.on("connect", () => {
        console.log("connected");
        client.subscribe("5g/data/test/tram/#", (err) => {
          if (!err) {
            client.on("message", (toptic, msg) => {
              console.log("message");
              this._msg_parsed = JSON.parse(msg.toString());
              console.log(this._msg_parsed);
              if (this.eventBus) {
                console.log(`UPDATE:${this.id}`);
                this.eventBus.emit(`UPDATE:${this.id}`);
              }
            });
          }
        });
      });
    } catch (e) {
      console.log(e);
    }
  }

  async getData() {
    return this._msg_parsed;
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
