<script setup lang="ts">
// @ts-nocheck
import Plotly from 'plotly.js-dist-min'
import { computed, watch } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  labels: Array,
  title: String,
  type: String,
  showscale: Boolean,
  showlegend: Boolean,
  autosize: Boolean,
  width: Number,
  height: Number,
})

const layout = computed(() => {
  return ({
    scene: {
      aspectratio: { 
      "x": 2,
      "y": 4,
      "z": 1
      },
      // xaxis: {
      //   rangemode: 'tozero',
      // },
      // yaxis: {
      //   rangemode: 'tozero',
      // },
      zaxis: {
        rangemode: 'tozero',
      }
    },
    title: props.title,
    showlegend: props.showlegend ?? true,
    autosize: props.autosize ?? true,
    width: props.width,
    height: props.height,
  })
});

const graphsData = computed(() => {
  const data = [];

  props.data.forEach((graph, x) => {
    const xArr = []
    const yArr = []
    const zArr = []

    // NOTE: for nested graps value by index 0 is accumulated result of all next values, that's why it shoup be skipped
    graph.data.forEach((z, y, arr) => {

    if (y !== 0 || arr.length === 1) {
        xArr.push(x)
        yArr.push(y)
        zArr.push(z)

        // NOTE: adding syntetic markers below for better line visability in graph
        // NOTE: v1: use step for each second value
        // xArr.push((x*2)+(y%2))
        //

        // NOTE: v2: dupliucating for mesh3d 
        xArr.push(x)
        yArr.push(y)
        zArr.push(0)

          // NOTE: extended v2 (v2 should be uncomented too) with lined markers at the top
          xArr.push(x)
          yArr.push(y)
          zArr.push(z)
          //
        //
      }
    })

    data.push({
      x: xArr,
      y: yArr,
      z: zArr,
      // mode: 'markers',
      // mode: 'lines',
      mode: 'lines+markers',
      // TODO: why surface axis not working
      // surfaceaxis: '2',
      // surfacecolor: 'red',
      marker: {
        size: 3,
        opacity: 0.6
      },
      type: 'scatter3d'
    });

    // data.push({
    //   // alphahull: 5,
    //   opacity: 0.1,
    //   type: 'mesh3d',
    //   x: xArr,
    //   y: yArr,
    //   z: zArr,
    // });
  });

  return data;
})

watch(
  [graphsData, layout],
  () => {
    console.log('### @@@ ###')
    console.log('graphsData', graphsData.value)

    const graph = Plotly.react('graph-root', graphsData.value, layout.value)
    console.log('react', graph)
  }
)

// TODO: Is it working from watch react ??
// To render it after wrapper rendering
setTimeout(() => {
  const graph = Plotly.react('graph-root', graphsData.value, layout.value)
  console.log('graph', graph)
})
</script>

<template>
    <div id="graph-root">
    </div>
</template>

<style lang="scss" scoped>

</style>