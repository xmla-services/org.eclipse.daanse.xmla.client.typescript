<!--
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

-->
<script lang="ts" setup>
export interface IVideoSettingsProps {
  videoSettings?: ObjectFitSetting;
  videoUrl?: string;
}

import { computed } from "vue";
import VideoWidgetSettings from "./VideoWidgetSettings.vue";
import { useSettings } from "@/composables/widgets/settings";
import { useStore } from "@/composables/widgets/store";
import { useSerialization } from "@/composables/widgets/serialization";
import type { Store } from "@/stores/Widgets/Store";
import type { ObjectFitSetting } from "@/@types/widgets";

const settingsComponent = VideoWidgetSettings;

const props = withDefaults(defineProps<IVideoSettingsProps>(), {
  videoSettings: () => ({
    fit: "None",
  }),
  videoUrl: "",
});

const { settings, setSetting } = useSettings<typeof props>(props);
const { store, data, setStore } = useStore<Store>();
const { getState } = useSerialization(settings);

defineExpose({
  setSetting,
  settings,
  settingsComponent,
  getState,
  store,
  setStore,
});

const videoUrlParced = computed(() => {
  let processedString = settings.value.videoUrl;
  const regex = /{(.*?)}/g;
  const parts = processedString.match(regex);

  if (!parts || !data.value) {
    return processedString;
  }

  parts.forEach((element: string) => {
    const trimmedString = element.replace("{", "").replace("}", "");
    const dataField = trimmedString.split(".");

    const res = dataField.reduce((acc: any, field) => {
      return acc[field];
    }, data.value);

    processedString = processedString.replace(element, res);
  });
  return processedString;
});
</script>

<template>
  <div class="container">
    <video controls :src="videoUrlParced">
      Your browser does not support embedded videos.
    </video>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container video {
  width: 100%;
  height: 100%;
  border-radius: 3px;
  object-fit: v-bind(settings.videoSettings.fit);
}
</style>
