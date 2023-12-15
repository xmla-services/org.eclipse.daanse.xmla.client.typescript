import type { Meta, StoryObj } from '@storybook/vue3';

import TextWidget from "@/components/Widgets/Text/TextWidget.vue";

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: 'Widget/StaticWidgets/Text',
  component: TextWidget,
  tags: ['autodocs']
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
      text: "Qwe",
      fontSize: 24,
      fontColor: "white",
      textAlign: "center",
    },
};
