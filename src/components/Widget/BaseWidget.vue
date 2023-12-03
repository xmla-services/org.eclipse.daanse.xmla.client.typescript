<template>
  <div class="widget">
    <div class="w_header">
      <slot name="header">
        <div class="icon">
          <slot name="icon"></slot>
        </div>
        <div class="title">
          <slot name="title"></slot>
        </div>
        <div class="actions">
          <slot name="actions"></slot>
        </div>
      </slot>
    </div>
    <div class="w_content">
      <slot></slot>
    </div>
    <div class="w_bottom">
      <slot name="bottom"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, withDefaults } from 'vue';



export interface WidgetProps {
  borderRadius: Number ,
  editMode: Boolean,
  moveable: Boolean,
  scaleable: Boolean,
  scaleableInEditMode:Boolean,
  width:Number,
  height:Number,
  background:String,
  backgroundTransparentcy:Number
}


const props = withDefaults(defineProps<WidgetProps>(), {
  borderRadius: 5,
  editMode: false,
  moveable: false,
  scaleable: false,
  scaleableInEditMode:true,
  width:100,
  height:100,
  background:'#ccc',
  backgroundTransparentcy:1

})


</script>

<style scoped lang="scss">

.widget{
  background-color: #ccc;
  box-shadow:1px 1px 4px #000;
  padding: 5px;
  border-radius: 5px;
}
</style>
