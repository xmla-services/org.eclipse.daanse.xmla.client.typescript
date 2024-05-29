import ThingWidget  from './TestPlugin/widgets/ThingWidget.vue';

import {enabledWidgets, widgetNames} from "@/components/Widgets";
import {cid, container, inject, injectable} from 'inversify-props';
import {type StoreManagerI, useStoreManager} from "@/composables/storeManager";
import {useDatasourceManager} from "@/composables/datasourceManager";
import STADataSource from "@/plugins/TestPlugin/dataSources/STADataSource";
import StaStore from "@/plugins/TestPlugin/stores/StaStore";



export default {

    install: (app) => {
        app.component(ThingWidget);
        enabledWidgets['ThingWidget']= ThingWidget;  //ToDo add register Method on widget registery
        widgetNames.push( { name: "ThingWidget", label: "ThingWidget"});

        const storemanger = container.get<StoreManagerI>(cid.UseStoreManager); // injection via inverserify
        //console.log(storemanger.register(...)) //register Store

        const storeMgr = useStoreManager();
        const dataSourceMgr = useDatasourceManager();

        dataSourceMgr.registerDataSource(STADataSource);
        storeMgr.registerStoreType(StaStore);

    }
};
