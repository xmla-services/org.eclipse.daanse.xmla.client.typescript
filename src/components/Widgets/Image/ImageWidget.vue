<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import ImageWidgetSettings from "./ImageWidgetSettings.vue";
const settings = ImageWidgetSettings;

const props = defineProps({
  initialState: {
    type: Object,
    required: false,
  },
  imgSrc: {
    type: String,
    required: false,
    default: "",
  },
});
const { initialState, imgSrc } = props;

const innerImgSrc = ref(initialState?.imgSrc || imgSrc || "");
let interval = null as any;

const images = ref([] as any[]);
const currentImage = ref(0);
const imageSettings = ref({
  fit: "None",
  diashowInterval: 0,
});

const toNext = () => {
  if (currentImage.value < images.value.length - 1) {
    currentImage.value++;
  }
};

const toPrev = () => {
  if (currentImage.value > 0) {
    currentImage.value--;
  }
};

const getState = () => {
  return {
    imgSrc: innerImgSrc.value,
  };
};

watch(
  () => props.imgSrc,
  (newVal) => {
    innerImgSrc.value = newVal;
  },
);

const setState = (state) => {
  console.log(state)
  images.value = state.images;
};

const initInterval = () => {
  if (interval) {
    clearInterval(interval);
  }
  if (imageSettings.value.diashowInterval > 0) {
    interval = setInterval(() => {
      if (currentImage.value === images.value.length - 1) {
        currentImage.value = 0;
        return;
      }
      toNext();
    }, imageSettings.value.diashowInterval * 1000);
  }
};

onMounted(() => {
  initInterval();
});

watch(() => imageSettings.value.diashowInterval, initInterval);

defineExpose({
  imgSrc: innerImgSrc,
  settings,
  getState,
  setState,
  images,
  imageSettings,
});
</script>

<template>
  <template v-if="images.length <= 1">
    <img class="image" :src="images[0]?.url" />
  </template>
  <template v-else>
    <div class="galery-container">
      <div class="button-prev">
        <va-button
          @click="toPrev()"
          icon="chevron_left"
          preset="plain"
          text-color="#ffffff"
          :disabled="currentImage === 0"
        ></va-button>
      </div>
      <div
        class="galery-viewport"
        :style="`transform: translateX(-${100 * currentImage}%)`"
      >
        <div
          v-for="(image, i) in images"
          :key="image.id"
          class="galery-image"
          :style="`transform: translateX(${100 * i}%)`"
        >
          <!-- {{ image.url }} -->
          <img class="image" :src="image.url" />
        </div>
      </div>

      <div class="button-next">
        <va-button
          @click="toNext()"
          icon="chevron_right"
          text-color="#ffffff"
          :disabled="currentImage === images.length - 1"
          preset="plain"
        ></va-button>
      </div>
    </div>
  </template>
</template>

<style scoped>
.image {
  width: 100%;
  height: 100%;
  object-fit: v-bind(imageSettings.fit);
}

.galery-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.galery-container .galery-viewport {
  width: 100%;
  height: 100%;
  overflow: visible;
  position: relative;
  transition: transform 0.3s ease-in-out;
}

.galery-container .galery-image {
  width: 100%;
  height: 100%;
  position: absolute;
}

.button-prev {
  left: 10px;
}

.button-next, .button-prev {
  position: absolute;
  top: 50%;
  width: 2rem;
  height: 2rem;
  transform: translateY(-50%);
  z-index: 1;
  background-color: #000000a0;
  border-radius: 10000px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.button-next {
  right: 10px;
}
</style>
