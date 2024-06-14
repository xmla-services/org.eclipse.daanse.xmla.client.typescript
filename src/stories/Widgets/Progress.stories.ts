/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/

import type { Meta, StoryObj } from "@storybook/vue3";

import ProgressWidget from '@/components/Widgets/Progress/ProgressWidget.vue'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof ProgressWidget> = {
  title: "Widget/StaticWidgets/Progress",
  component: ProgressWidget,
  tags: ["autodocs"],
  decorators: [
    () => ({
      template: '<div style="width: 300px; height: 300px; display: flex; justify-content: center; align-items: center; background-color: #fafafa; color: black;"><story /></div>',
    }),
  ],
  argTypes: {
    progress: { control: 'text' },
    fillColor: { control: 'color' },
    gradientColor: { control: 'text' },
    backgroundColor: { control: 'color' },
    isGradient: { control: 'boolean' },
    isVertical: { control: 'boolean' },
    rotation: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Horizontal: Story = {
  args: {
    progress: "0.5",
    fillColor: "#00FF00",
    gradientColor: '#00FF00 0, #FAFAFA 85%',
    backgroundColor: "#d3d3d3",
    isGradient: false,
    isVertical: false,
    rotation: 90,
  },
};

export const Vertical: Story = {
  args: {
    progress: '0.3',
    fillColor: '#0000FF',
    gradientColor: '#0000FF 0%, #00FFFF 100%',
    backgroundColor: '#d3d3d3',
    isGradient: false,
    isVertical: true,
    rotation: 0,
  },
};

export const HorizontalGradient: Story = {
  args: {
    progress: '0.7',
    fillColor: '#FF0000',
    gradientColor: '#FF0000 0%, #FFFF00 50%, #00FF00 100%',
    backgroundColor: '#d3d3d3',
    isGradient: true,
    isVertical: false,
    rotation: 45,
  },
};

export const VerticalGradient: Story = {
  args: {
    progress: '0.5',
    fillColor: '#FF0000',
    gradientColor: '#FF0000 0%, #FFFF00 50%, #00FF00 100%',
    backgroundColor: '#d3d3d3',
    isGradient: true,
    isVertical: true,
    rotation: 45,
  },
};
