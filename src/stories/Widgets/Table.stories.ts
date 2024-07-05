/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/

import type { Meta, StoryObj } from "@storybook/vue3";

import TableWidget from '@/components/Widgets/Table/TableWidget.vue';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof TableWidget> = {
  title: "Widget/StaticWidgets/TableWidget",
  component: TableWidget,
  tags: ["autodocs"],
};

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
      <TableWidget
        :filter="args.filter"
        :filterByFields="args.filterByFields"
        :currentPage="args.currentPage"
        :perPage="args.perPage"
        :data="args.data"
        :headers="args.headers"
        :columns="args.columns"
      >
      </TableWidget>
    `,
    components: { TableWidget },
  }),
  args: {
    filter: "",
    filterByFields: [],
    currentPage: 1,
    perPage: 1,
    data: [],
    headers: [],
    columns: [],
  },
};
