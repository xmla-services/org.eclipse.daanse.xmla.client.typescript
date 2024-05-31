import { expect, test } from 'vitest'
// @ts-ignore
import {useDatasourceManager} from "@/composables/datasourceManager";
import { defineComponent } from 'vue'
import {mount} from "@vue/test-utils";
import RestDatasource from "@/dataSources/RestDatasource";
import EventBus from "@/plugins/EventBus";
import XMLADatasource from "@/dataSources/XmlaDatasource";

const TestComponent = defineComponent({

    setup (props) {
        const dsm = useDatasourceManager();
        dsm.registerDataSource(RestDatasource);
        dsm.registerDataSource(XMLADatasource);
        return dsm;
    },
    render(){}

})
const wrapper = mount(TestComponent,{
    global: {
        // to pass options to plugins, use the array syntax.
        plugins: [[EventBus]]
    },
})

let id;




test('check if XMLADataSources become available', () => {
    expect(XMLADatasource.TYPE in Object.keys(wrapper.vm.getDataSourceRegistry()))
})
test('check if RESTDataSources become available', () => {
    expect(RestDatasource.TYPE in Object.keys(wrapper.vm.getDataSourceRegistry()))
})
test('init RESTDataSources ', () => {
    id = wrapper.vm.initDatasource(RestDatasource.TYPE,'https://dummyjson.com/todos',"Test");
    expect( wrapper.vm.getDatasource(id).id).toBe(id)
})
test('check RESTDataSources request ',async () => {
     let rs:RestDatasource = wrapper.vm.getDatasource(id) as RestDatasource;
     expect(await rs.getData()).toHaveProperty('todos')
})
test('unregister ',async () => {
    wrapper.vm.unRegisterDataSource(XMLADatasource)
    expect(Object.keys(wrapper.vm.getDataSourceRegistry())).not.toContain(XMLADatasource.TYPE);
})
