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
