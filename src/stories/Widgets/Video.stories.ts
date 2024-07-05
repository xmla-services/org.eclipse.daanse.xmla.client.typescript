/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/

import type { Meta, StoryObj } from "@storybook/vue3";

import VideoWidget from '@/components/Widgets/Video/VideoWidget.vue';
// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof VideoWidget> = {
  title: "Widget/StaticWidgets/VideoWidget",
  component: VideoWidget,
  tags: ["autodocs"],
  // decorators: [
  //   () => ({
  //     template: '<div style="width: 300px; height: 300px; background-color: #fafafa;"><story /></div>',
  //   }),
  // ],
};

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  args: {
    videoSettings: {fit: "None"},
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
};

