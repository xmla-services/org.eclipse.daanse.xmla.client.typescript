import BarChartWidget  from './widgets/BarChartWidget.vue';

import {enabledWidgets, widgetNames} from "@/components/Widgets";

export default {

    install: (app) => {
        app.component(BarChartWidget);
        enabledWidgets['BarChartWidget']= BarChartWidget;  //ToDo add register Method on widget registery
        widgetNames.push( { name: "BarChartWidget", label: "BarChartWidget"});

        //const storemanger = container.get<StoreManagerI>(cid.UseStoreManager); // injection via inverserify
        //console.log(storemanger.register(...)) //register Store





    }
};
