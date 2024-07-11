/*
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

*/

import { useDatasourceManager } from "@/composables/datasourceManager";
import { getMdxRequest } from "@/utils/MdxRequests/MdxRequestConstructor";
import { useErrorHandler } from "@/composables/dashboard/errorToast";
interface EventBus {
    emit: (string, any?) => void;
    on: (string, Function) => void;
    off: (string, Function) => void;
}

export class XMLAStore implements IStore {
    public caption = "";
    public id = "";
    public datasourceId: string | null = null;
    private datasourceManager: any;
    public data = null;
    private eventBus = null as unknown as EventBus;
    public events = [] as Array<{ name: string; action: string }>;
    public initedEvents = [] as Array<{ name: string; cb: Function }>;
    public type = "XMLA" as const;

    private errorToast: any;

    constructor(id, caption, eventBus: EventBus) {
        this.id = id;
        this.caption = caption;
        this.datasourceManager = useDatasourceManager();
        this.eventBus = eventBus;
        this.errorToast = useErrorHandler();
    }

    setDatasource(datasourceIds) {
        this.datasourceId = datasourceIds;
        this.eventBus.emit(`UPDATE:${this.id}`);
    }

    async getData({
        rows,
        columns,
        measures,
        rowsExpandedMembers,
        rowsDrilldownMembers,
        columnsExpandedMembers,
        columnsDrilldownMembers,
    }) {
        try {
            const datasource = this.datasourceManager.getDatasource(
                this.datasourceId,
            );

            // this.flushDrilldowns(columns, rows);
            // this.flushExpands(columns, rows);

            const measuresMapped = measures.map((e) => {
                return { originalItem: e };
            });

            const body = await this.getMDXRequest(
                rows,
                columns,
                measuresMapped,
                rowsExpandedMembers,
                rowsDrilldownMembers,
                columnsExpandedMembers,
                columnsDrilldownMembers,
                {
                    showEmpty: true,
                    alignContent: "right",
                },
            );

            const responce = await datasource.getData(body);
            return responce;
        } catch (e) {
            return this.errorToast.handleErrorToast(e);
        }
    }

    setOptions({ caption }) {
        this.caption = caption || this.caption;
        this.eventBus.emit(`UPDATE:${this.id}`);
    }

    getDatasource() {
        return this.datasourceManager.getDatasource(this.datasourceId);
    }

    getState() {
        return {
            caption: this.caption,
            id: this.id,
            events: this.events,
            datasourceId: this.datasourceId,
            type: this.type,
        };
    }

    loadState(state) {
        this.caption = state.caption;
        this.id = state.id;
        this.events = state.events;
        this.datasourceId = state.datasourceId;
    }

    async getMDXRequest(
        rows,
        columns,
        measures,
        rowsExpandedMembers,
        rowsDrilldownMembers,
        columnsExpandedMembers,
        columnsDrilldownMembers,
        pivotTableSettings,
    ) {
        const datasource = this.datasourceManager.getDatasource(
            this.datasourceId,
        );

        const mdxRequest = await getMdxRequest(
            datasource.cube.CUBE_NAME,
            rowsDrilldownMembers,
            columnsDrilldownMembers,
            rowsExpandedMembers,
            columnsExpandedMembers,
            rows,
            columns,
            measures,
            pivotTableSettings,
            datasource.getProperties(),
            [],
            datasource.getLevels(),
        );

        return mdxRequest;
    }
}
