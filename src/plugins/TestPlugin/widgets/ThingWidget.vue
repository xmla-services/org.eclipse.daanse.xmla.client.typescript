<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
import {LGeoJson, LMap, LTileLayer} from "@vue-leaflet/vue-leaflet";



interface IThingWidgetProps {
  baseMapUrl?: string;
  zoom?:number,
  center?:any,
  attribution?:string

}

import {computed, onMounted, ref, watch} from "vue";
import ThingWidgetSettings from "./ThingWidgetSettings.vue";
import { useSettings } from "@/composables/widgets/settings";
import { useStore } from "@/composables/widgets/store";
import { useSerialization } from "@/composables/widgets/serialization";
import type { Store } from "@/stores/Widgets/Store";

const settingsComponent = ThingWidgetSettings;

const props = withDefaults(defineProps<IThingWidgetProps>(), {
  baseMapUrl: "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
  zoom:14,
  attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  center: [50.93115286, 11.60392726],
});
const map = ref(null);
const { settings, setSetting } = useSettings<typeof props>(props);
const { store, data, setStore } = useStore<Store>();
const { getState } = useSerialization(settings);

defineExpose({
  setSetting,
  settings,
  settingsComponent,
  store,
  setStore,
  getState,
});
onMounted(()=>{

const mapDiv = document.getElementById("map");
const resizeObserver = new ResizeObserver(() => {
  console.log(map)
  map.invalidateSize();
});

resizeObserver.observe(mapDiv);
})
const locations = ref();
watch(data, (newVal, oldVal) => {

    console.log(data)
    try{
      //console.log(data[2].locations.map(loc=>loc.location));
      locations.value =  data.value[2].locations.map(loc=>loc.location);

    }catch(e){
      console.log(e);

    }

});
const rev= (arr: any)=> {
  return {
    lat: arr[0],
    lng: arr[1]
  }
}
</script>

<template>
  <div class="cmap_container">
    <l-map id="map" ref="map" :zoom="zoom" :center="center"  :max-zoom="21" style="height: 100%">
      <l-tile-layer :url="baseMapUrl" :attribution="attribution" :options="{maxNativeZoom:19,
        maxZoom:25}"></l-tile-layer>
      <l-geo-json  :geojson="location"  v-for="location in locations" ></l-geo-json>
    </l-map>



  </div>
</template>

<style scoped>
.text-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 1rem;
  align-items: stretch;
}

.component {
  overflow: hidden;
}
.cmap_container{
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
