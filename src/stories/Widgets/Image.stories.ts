import type { Meta, StoryObj } from '@storybook/vue3';

import ImageWidget from "@/components/Widgets/Image/ImageWidget.vue";

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: 'Widget/StaticWidgets/Image',
  component: ImageWidget,
  tags: ['autodocs']
} as Meta<typeof ImageWidget>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
    args: {
      imgSrc: "https://placekitten.com/2000/1000"
    },
};
