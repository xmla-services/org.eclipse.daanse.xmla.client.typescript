/*
 * Copyright (c) 2023 Contributors to the Eclipse Foundation.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 */

import {useDatasourceManager} from "@/composables/datasourceManager";
import type {IStore} from "mqtt";
import EventBus from "@/plugins/EventBus";

export default abstract class BaseStore {

    public caption: string;
    public events: IStoreEvents[] = [];
    public static TYPE = "BASE";
    public type = BaseStore.TYPE;
    public id: string;

    constructor(id: string, caption: string, eventBus: EventBus) {
        this.id = id;
        this.caption = caption;
    }



}
