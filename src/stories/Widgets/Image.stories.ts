/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/

import type { Meta, StoryObj } from '@storybook/vue3';

import ImageWidget from "@/components/Widgets/Image/ImageWidget.vue";

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof ImageWidget> = {
  title: 'Widget/StaticWidgets/Image',
  component: ImageWidget,
  tags: ['autodocs'],
  decorators: [
    () => ({
      template: '<div style="width: 300px; height: 300px;"><story /></div>',
    }),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const SingleImage: Story = {
  args: {
    images: [{id: "0", url: "https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U"}],
    imagesSettings: {fit: "Cover", diashowInterval: 0}
  },
};

export const ImageGallery: Story = {
  args: {
    images: [
      {id: "0", url: "https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U"},
      {id: "1", url: "https://fastly.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI"}
    ],
    imagesSettings: {fit: "Cover", diashowInterval: 0}
  },
};
