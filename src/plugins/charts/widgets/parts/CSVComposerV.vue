<script setup lang="ts">

import type {Composer, CSVSelector, Selector} from "@/plugins/charts/widgets/api/ChartdataComposer";
import {computed} from "vue";


    const model = defineModel<Composer<Selector>>()
    model.value?.getSelectorX()

    const xSel = computed({get:()=> {
            return (model.value?.getSelectorX() as CSVSelector)?.header
        },set:(val)=>{
            model.value?.setSelectorX({header:val})
        }
    })

    const ySel = computed(()=>{
       return (model.value?.getSelectorsY() as CSVSelector[]).map(e=>e.header);
    })
    const headers = computed(()=>{
        return ['id','item',"model","bj","gender","markets"];
    })
    const updateSelectorY = (val,head)=>{
        let items = model.value?.getSelectorsY();
        if(items){
            const index = items!.findIndex((v:CSVSelector)=>v.header == head);
            if(index!=-1){
                items.splice(index,1);
                return
            }else {
                items.push({header:head})
            }
        }
    }
    const source = computed(()=>{
        return model.value?.getStore()?.caption||'';
    })

</script>

<template>
<div class="composer">

    {{source}}
    <br>

    xAxis:
    <br>
    <VaSelect
        v-model="xSel"
        :options="headers"
        placeholder="Select an header for X"
    />
    <br>
    <br>
    yAxis:
    <br>
    <template v-for="head in headers">


        <VaCheckbox :model-value="ySel.includes(head)" @update:modelValue="(ev)=>updateSelectorY(ev,head)" :label="head">

        </VaCheckbox>
        <!--<VaSelect

            @update:modelValue="(ev)=>updateSelectorY(ev,i)"
            :options="headers"
            placeholder="Select an header for y"
        />-->
    </template>

</div>
</template>

<style scoped lang="scss">

</style>
