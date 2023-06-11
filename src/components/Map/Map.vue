<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts">
import { usePivotTableStore } from "@/stores/PivotTable";
import {optionalArrayToArray, transposeArray} from "@/utils/helpers";
import {onMounted, provide, ref, watch, type Ref, inject} from "vue";
import DrillthroughModal from "../Modals/DrillthroughModal.vue";
import { useAppSettingsStore } from "@/stores/AppSettings";
import { storeToRefs } from "pinia";
import { useElementSize } from "@vueuse/core";
import { useQueryDesignerStore } from "@/stores/QueryDesigner";
import {debounce} from "lodash";
import {LGeoJson, LMap, LTileLayer} from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";


const DEFAULT_COLUMN_WIDTH = 150;
const DEFAULT_ROW_HEIGHT = 30;




const DEFAULT_ROW_HEIGHT_CSS = `${DEFAULT_ROW_HEIGHT}px`;
import L,{ Icon} from 'leaflet';
import {useChartStore} from "@/stores/Chart";



type D = Icon.Default & {
  _getIconUrl?: string;
};

delete (Icon.Default.prototype as D)._getIconUrl;

export default {

  setup() {
    const pivotTableStore = usePivotTableStore();
    const chartStore = useChartStore();
    const { mdx } = storeToRefs(pivotTableStore);
    const appSettings = useAppSettingsStore();
    const api = appSettings.getApi();
    const queryDesignerState = useQueryDesignerStore();
    const rowsContainer = ref(null) as Ref<any>;
    const { width: rowsWidth } = useElementSize(rowsContainer);

    const colStyles = ref([...pivotTableStore.state.styles.columns] as any[]);
    const rowsStyles = ref([...pivotTableStore.state.styles.rows] as any[]);
    const geosStoredinCols = ref(false);


    const MapContainerReference = ref(null);
    const map = ref(null);
    const { width, height } = useElementSize(MapContainerReference)

    const geoRef = ref(null);

    const rows = ref([] as any[]);
    const zoom = ref(2);
    const columns = ref([] as any[]);
    const cells = ref([] as any[]);
    const propertiesRows = ref([] as any[]);
    const propertiesCols = ref([] as any[]);



    const getPivotTableData = debounce(async () => {
      const loadingId = appSettings.setLoadingState();
      const mdx = pivotTableStore.mdx;

      const mdxResponce = await api.getMDX(mdx);
      const axis0 = optionalArrayToArray(
          optionalArrayToArray(
              mdxResponce.Body.ExecuteResponse.return.root.Axes?.Axis
          )?.[0]?.Tuples?.Tuple
      );
      let axis1 = [] as any[];
      if (
          mdxResponce.Body.ExecuteResponse.return.root.Axes?.Axis?.[1]?.__attrs
              .name === "Axis1"
      ) {
        axis1 = optionalArrayToArray(
            mdxResponce.Body.ExecuteResponse.return.root.Axes?.Axis?.[1]?.Tuples
                ?.Tuple
        );
      }
      const cellsArray = optionalArrayToArray(
          mdxResponce.Body.ExecuteResponse.return.root.CellData?.Cell
      );

      if (!queryDesignerState.columns.length) {
        columns.value = axis1.map((e: { Member: any }) => {
          return optionalArrayToArray(e.Member);
        });
        rows.value = axis0.map((e: { Member: any }) => {
          return optionalArrayToArray(e.Member);
        });
        geosStoredinCols.value = columns.value.filter(col=>'GeoJson' in col[0]).length>0
        if(geosStoredinCols){
          cells.value = transposeArray(parseCells(cellsArray,rows.value, columns.value));
        }else {
          cells.value = parseCells(cellsArray,columns.value ,rows.value );
        }
      } else {
        columns.value = axis0.map((e: { Member: any }) => {
          return optionalArrayToArray(e.Member);
        });
        rows.value = axis1.map((e: { Member: any }) => {
          return optionalArrayToArray(e.Member);
        });
        geosStoredinCols.value = columns.value.filter(col=>'GeoJson' in col[0]).length>0
        if(geosStoredinCols){
          cells.value = transposeArray(parseCells(cellsArray,columns.value ,rows.value ));
        }else {
          cells.value = parseCells(cellsArray,columns.value ,rows.value );
        }
      }


      const propertiesCells = propertiesRows.value.map((prop) => {
        return columns.value.map((col) => {
          const propsOrigin = col.find(
              (e) => e.HIERARCHY_UNIQUE_NAME === prop.HIERARCHY_UNIQUE_NAME
          );

          const colHierarchyIndex = col.indexOf(propsOrigin);
          const desc = colPropertiesDescription[colHierarchyIndex];
          const propName = `${prop.HIERARCHY_UNIQUE_NAME}.[${prop.PROPERTY_NAME}]`;

          const objPropName = Object.entries(desc).find((keyValue: any) => {
            if(Array.isArray(keyValue[1])){
              const att = keyValue[1].find(entry=>{
                return entry.__attrs?.name === propName;
              })
              if(att) return att;
            }else {
              return keyValue[1]?.__attrs?.name === propName;
            }
          });

          if (objPropName) {
            return {
              Value: propsOrigin[objPropName[0]],
            };
          }

          return {
            Value: "",
          };
        });
      });


      appSettings.removeLoadingState(loadingId);
    }, 100);

    function parseCells(cells: any[], columns: any[], rows: any[]) {
      if (!cells.length) return [];
      if (!rows.length) {
        return [cells];
      } else if (!columns.length) {
        return cells.map((e) => [e]);
      }
      const cp = [...cells] as any[];

      const columnsArray = [] as any[];
      const count = columns.length;
      while (cp.length) {
        columnsArray.push(cp.splice(0, count));
      }
      return columnsArray;
    }

    watch(mdx, async () => {
      await getPivotTableData();
    });

    watch(pivotTableStore.state.membersWithProps, async () => {
      await getPivotTableData();
    });

    onMounted(async () => {
      await getPivotTableData();
    });

    watch(
        () => queryDesignerState.rows,
        async () => {
          await getPivotTableData();
        }
    );

    watch(
        () => queryDesignerState.columns,
        async () => {
          await getPivotTableData();
        }
    );
    watch(()=>height.value,()=>{
      (map.value as any).leafletObject.invalidateSize();
    })



    return {
      pivotTableStore,
      chartStore,
      colStyles,
      rowsStyles,
      DEFAULT_ROW_HEIGHT_CSS,
      cells,
      rows,
      columns,
      rowsContainer,
      rowsWidth,
      DrillthroughModal,
      propertiesRows,
      propertiesCols,
      zoom,
      geosStoredinCols,
      map,
      height,
      MapContainerReference,
      geoRef
    };
  },
  computed: {
      geos(){
        let geos = []
        if(this.geosStoredinCols) {
          let index = -1;
           geos = this.columns?.reduce((acc, el) => {
            index++;
            try {
              const json = JSON.parse(el[0]['GeoJson'][0])
              acc.push(
                  {
                          type: 'Feature',
                          member: el,
                          data: this.cells[index],
                          geometry: json
                        }
                  )
              return acc;
            } catch (e) {
              return acc;
            }
          }, [])
        }else {
          let index = -1;

           geos = this.rows?.reduce((acc, el) => {
            try {
              const json = JSON.parse(el[0]['GeoJson'][0])
              index++;
              acc.push(
                 {
                          type: 'Feature',
                          member:el,
                          data: this.cells[index],
                          geometry:json
            })

              //acc.push(json)
              return acc;
            } catch (e) {
              return acc;
            }

          }, [])
        }

        //return [...geos,...geos2]
        return {
          type: "FeatureCollection", features:geos
        }
         //{


      }
  },
  methods: {
    onResize(e: MouseEvent) {

    },
    onStopResize() {

    },
    drillthrough(cell) {

    },
    drilldown(event){
      //event.originalEvent.stopImmediatePropagation()
      //console.log(event)

      const member = event.layer.feature.member[0];
      if(this.geosStoredinCols){
        this.pivotTableStore.expandOnColumns(member);
        this.chartStore.expandOnColumns(member);
      }else {
        this.pivotTableStore.expandOnRows(member);
        this.chartStore.expandOnRows(member);
      }
      //if (area === "rows") {
      //  this.pivotTableStore.drilldownOnRows(member);
      //  this.chartStore.drilldownOnRows(member);
      //} else if (area === "columns") {

      //}
    },
    getStyle(){
      return {
        "color": "#0061a4",
        "weight": 2,
        "opacity": 1,
        "fillColor":'#0061a4',
        fillOpacity: 0.4
      }
    },
    onEachFeature(feature:any, layer:any) {

      layer.bindTooltip(feature.data.reduce((acc,e,index)=>{
        try{
        if(index == 0){
            acc+='<b>'+feature.member[0].Caption+'</b><br>';


        }
        if(this.geosStoredinCols){
          acc+='<b>'+this.rows[index][0].Caption+'</b>';
        }else{
          acc+='<b>'+this.columns[index][0].Caption+'</b>';
        }
         return acc+=' :'+e.Value+ '<br>' ;
        }catch (e){
          return '';
        }
      },''));

      layer.on('mouseover',()=> {
        layer.setStyle({
            "color": "#7db9fa",
            "weight": 2,
            "opacity": 1,
            "fillColor":'#137cc5',
            fillOpacity: 0.8
          })

        });
      layer.on('mouseout',()=> {
        layer.setStyle({
          "color": "#0061a4",
          "weight": 2,
          "opacity": 1,
          "fillColor":'#0061a4',
          fillOpacity: 0.4
          })
        });
      }
  },
  components: {
    LMap,
    LTileLayer,
    LGeoJson
  },
  watch:{
    geos(geos){
        console.log('reloaded')
        try{
          const bbox = L.geoJson(geos).getBounds();

          this.map.leafletObject.fitBounds(bbox)


        }catch (e){

        }

        //console.log(this.geoRef)
      }

  }
};
</script>

<template>
  <div
      class="map_container" ref="MapContainerReference"
   >
    <div style="height:100%; width:100%">
      <l-map ref="map" :zoom="2" :center="[47.41322, -1.219482]">

        <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
        ></l-tile-layer>
        <l-geo-json  :geojson="geos"  @dblclick="drilldown" ref="geoRef" :optionsStyle="getStyle" :options="{onEachFeature:onEachFeature}"/>


      </l-map>
    </div>

  </div>
</template>

<style lang="scss">
.map_container {
  padding: 5px;
  height: 100%;
}
.map {
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.vertical-scroll {
  height: 100%;
}
</style>
