import type { Meta, StoryObj } from "@storybook/vue3";

import TextWidget from "@/components/Widgets/Svg/SvgWidget.vue";
import Svg from '@/../public/demo/test.svg';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: "Widget/StaticWidgets/Svg",
  component: TextWidget,
  tags: ["autodocs"],
} as Meta<typeof TextWidget>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  args: {
    src: Svg,
    classesConfig: {
      primary: {
        stroke: "#fff",
        fill: "#000",
      },
      secondary: {
        stroke: "#ffffff",
        fill: "#ff0000",
      },
      ternary: {
        stroke: "#aaaaff",
        fill: "#ffff00",
      },
    },
  },
};
