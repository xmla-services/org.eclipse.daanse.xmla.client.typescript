import {useDatasourceManager} from "@/composables/datasourceManager";

export default class BaseStore implements IStore {

    public caption: string;
    public events: IStoreEvents[] = [];
    public static TYPE = "BASE";
    public type = BaseStore.TYPE;
    public id: string;

    constructor(id: string, caption: string, eventBus: EventBus) {
        this.id = id;
        this.caption = caption;
    }

    getData(): Promise<any> {
        return Promise.resolve(undefined);
    }
}
