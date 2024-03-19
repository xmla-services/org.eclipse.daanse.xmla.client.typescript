/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/


import type { Meta, StoryObj } from "@storybook/vue3";
import { setup } from "@storybook/vue3";
import {
  createVuesticEssential,
  VaIcon,
  createIconsConfig,
  VaButton,
} from "vuestic-ui";
import "vuestic-ui/css";
import "@/assets/main.css";

import WidgetWrapper from "@/components/Widgets/WidgetWrapper/WidgetWrapper.vue";
import ImageWidget from "@/components/Widgets/Image/ImageWidget.vue";

setup(async (app) => {
  const fonts = [
    {
      name: "mdi-{icon}",
      resolve: ({ icon }) => ({
        class: "material-icons-outlined",
        content: icon,
        tag: "span",
      }),
    },
  ];
  console.log(fonts);
  app.use(
    createVuesticEssential({
      components: {
        VaIcon,
        VaButton,
      },
      config: {
        icons: createIconsConfig({
          fonts: [
            {
              name: "mdi-{icon}",
              resolve: ({ icon }) => ({
                class: "material-icons-outlined",
                content: icon,
                tag: "span",
              }),
            },
          ],
        }),
      },
    }),
  );
});

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: "Widget/StaticWidgets/Wrapper",
  component: WidgetWrapper,
  tags: ["autodocs"],
} as Meta<typeof WidgetWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: (args: any) => ({
    setup() {
      return { args };
    },
    template: `
      <WidgetWrapper
        :title="args.title"
        :backgroundColor="args.backgroundColor"
        :titleColor="args.titleColor"
        :titleFontSize="args.titleFontSize"
        :borderSize="args.borderSize"
        :borderColor="args.borderColor"
        :borderRadius="args.borderRadius"
        :fullscreen="args.fullscreen"
      >
        <ImageWidget imgSrc="https://placekitten.com/2000/1000" />
      </WidgetWrapper>
    `,
    components: { ImageWidget, WidgetWrapper },
  }),
  args: {
    title: "Widget title",
    backgroundColor: "#fff",
    titleColor: "#000",
    titleFontSize: 20,
    borderSize: 1,
    borderColor: "#000",
    borderRadius: 4,
    fullscreen: false,
  },
};
