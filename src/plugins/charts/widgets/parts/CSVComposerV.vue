<script setup lang="ts">
import type {
    Composer,
    CSVSelector,
    Selector,
} from "@/plugins/charts/widgets/api/ChartdataComposer";
import { type Component, computed, ref, watch } from "vue";
import type { AxisSettings } from "@/plugins/charts/widgets/BarChartWidgetSettings.vue";
import { v4 as uuidv4 } from "uuid";
import type { IChartComponent } from "chart.js/dist/core/core.typedRegistry";
import { deepUnref } from "vue-deepunref";
import { isEqual } from "lodash";
import type CSVStore from "@/plugins/charts/stores/CSVStore";

const model = defineModel<Composer<Selector>>();
model.value?.getSelectorX();

//const axisAssignment = defineModel('axisAssignment', { required: true })

const props = defineProps<{
    axes: { [key: string]: AxisSettings };
    component: IChartComponent;
}>();
const xSel = computed({
    get: () => {
        return (model.value?.getSelectorX() as CSVSelector)?.header;
    },
    set: (val) => {
        model.value?.setSelectorX(val as CSVSelector);
    },
});
const axisAssignment = ref({});
watch(
    () => props.component.settings.axisAssignment,
    (vaxisAssignment) => {
        if (
            !isEqual(
                deepUnref(axisAssignment.value),
                deepUnref(vaxisAssignment),
            )
        ) {
            axisAssignment.value = { ...deepUnref(vaxisAssignment as any) };
        }
    },
    { immediate: true, deep: true },
);
watch(
    axisAssignment,
    (newaxisAssignment, oldValue) => {
        props.component.setSetting("axisAssignment", axisAssignment);
    },
    { deep: true },
);
const ySel = computed(() => {
    return (model.value?.getSelectorsY() as CSVSelector[]).map((e) => e.header);
});
const headers = computed(() => {
    return (model.value?.getStore() as CSVStore).getHeader().map((head) => {
        return { header: head, id: uuidv4() };
    });
});
//[{header:'id',id:uuidv4()},{header:'item',id:uuidv4()},{header:"model",id:uuidv4()},{header:"bj",id:uuidv4()},{header:"gender",id:uuidv4()},{header:"markets",id:uuidv4()}];
const updateSelectorY = (val, head, name) => {
    if (!Object.keys(axisAssignment.value).includes(name)) {
        axisAssignment.value[name] = [];
    }
    let items = model.value?.getSelectorsY();
    if (items) {
        const index = items!.findIndex((v: CSVSelector) => v.id == head.id);
        if (index != -1) {
            if (!val) {
                items.splice(index, 1);
            }
        } else {
            //let selector = {header:head,id:uuidv4()}as CSVSelector;
            items.push(head);
        }
    }
    if (val) {
        //false => true
        const searchkeys = Object.keys(axisAssignment.value).filter(
            (k) => k !== name,
        );
        for (const akey of searchkeys) {
            const index = axisAssignment.value[akey].findIndex(
                (v: CSVSelector) => v.id == head.id,
            );
            if (index != -1) {
                axisAssignment.value[akey].splice(index, 1);
            }
        }
        axisAssignment.value[name].push(head);
    } else {
        const index = axisAssignment.value[name].findIndex(
            (v: CSVSelector) => v.id == head.id,
        );
        if (index != -1) {
            axisAssignment.value[name].splice(index, 1);
        }
    }
};
const source = computed(() => {
    return model.value?.getStore()?.caption || "";
});
const axis_names = computed((e) => {
    return Object.keys(props.axes).filter((name) => name != "x");
});
</script>

<template>
    <div class="composer">
        <br />

        xAxis:
        <br />
        <VaSelect
            v-model="xSel"
            :options="headers"
            text-by="header"
            placeholder="Select an header for X"
        />
        <br />
        <br />
        yAxis:
        <br />
        <div v-for="name in axis_names" :key="name">
            {{ name }}
            <template v-for="head in headers" :key="head">
                <VaCheckbox
                    :model-value="
                        axisAssignment[name]
                            ? !!axisAssignment[name].find(
                                  (e) => e.id == head.id,
                              )
                            : false
                    "
                    @update:modelValue="(ev) => updateSelectorY(ev, head, name)"
                    :label="head.header"
                >
                </VaCheckbox>

                <!--<VaSelect

            @update:modelValue="(ev)=>updateSelectorY(ev,i)"
            :options="headers"
            placeholder="Select an header for y"
        />-->
            </template>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
