import type { Meta, StoryObj } from "@storybook/vue3";

import RepeatableSvgWidget from "@/components/Widgets/RepeatableSvg/RepeatableSvgWidget.vue";
import Svg from "@/../public/demo/human.svg";

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: "Widget/StaticWidgets/RepeatableSvg",
  component: RepeatableSvgWidget,
  tags: ["autodocs"],
} as Meta<typeof RepeatableSvgWidget>;

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
    activeItemStyles: {
      fill: "red",
      stroke: "yellow",
    },
    defaultItemStyles: {
      fill: "#777",
      stroke: "#777",
    },
    repeations: 3,
    progress: 0.3,
  },
};
