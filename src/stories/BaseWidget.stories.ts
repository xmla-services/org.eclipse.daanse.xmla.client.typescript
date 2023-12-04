import type { Meta, StoryObj } from '@storybook/vue3';


import {setup} from '@storybook/vue3';
import {createPinia} from "pinia";
import SOAPClient from "@/plugins/SOAPClient";
import {
    createVuesticEssential,
    createIconsConfig,
    VaButton,
    VaButtonToggle,
    VaSplit,
    VaImage,
    VaModal,
    VaCardTitle,
    VaCardContent,
    VaCardActions,
    VaInput,
    VaNavbar,
    VaNavbarItem,
    VaOptionList,
    VaSelect,
    VaTreeView,
    VaProgressCircle,
    VaChip,
    VaIcon,
    VaCheckbox,
    VaDropdown,
    VaDropdownContent,
    VaButtonGroup,
    VaDivider,
    VaButtonDropdown,
    VaDataTable,
    VaToast,
    VaSidebar,
    VaSidebarItem, VaSidebarItemContent, VaSidebarItemTitle, VaScrollContainer
} from "vuestic-ui";
import {BarElement, CategoryScale, Chart as ChartJS, Colors, Legend, LinearScale, Title, Tooltip,} from "chart.js";
import {useAppSettingsStore} from "@/stores/AppSettings";
import BaseWidget from "@/components/Widget/BaseWidget.vue";


setup(async (app) => {
    const pinia = createPinia();
    pinia.use(SOAPClient);
    ChartJS.register(
        Title,
        Tooltip,
        Legend,
        BarElement,
        CategoryScale,
        LinearScale,
        Colors,
    );
    app.use(pinia);
    app.use(
        createVuesticEssential({
            components: {
                VaButton,
                VaButtonToggle,
                VaSplit,
                VaImage,
                VaModal,
                VaCardTitle,
                VaCardContent,
                VaCardActions,
                VaInput,
                VaNavbar,
                VaNavbarItem,
                VaOptionList,
                VaSelect,
                VaTreeView,
                VaProgressCircle,
                VaChip,
                VaIcon,
                VaCheckbox,
                VaDropdown,
                VaDropdownContent,
                VaButtonGroup,
                VaDivider,
                VaDataTable,
                VaToast,
                VaButtonDropdown,
                VaSidebar,
                VaSidebarItem,
                VaSidebarItemContent,
                VaSidebarItemTitle,
                VaScrollContainer
            },
            config: {
                colors: {
                    variables: {
                        primary: "#133370"
                    },
                },
                //icons: createIconsConfig({ fonts }),
            },
        }));
    //app.mount("#app");
    const store = useAppSettingsStore();
    await store.initXmlaApi('https://datacube-stage.nomad-dmz.jena.de/cube/xmla');
});


// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
    title: 'Widget/DisplayWidgets/BaseWidget',
    component: BaseWidget,
    render: (args: any) => ({
        components:  {BaseWidget} ,
        setup() {
            return { args };
        },
        template: ` <BaseWidget class="absoluteHelper">
                    <template v-slot:title>My Test Widget</template>
                    <h1>Test Content</h1>
                    <p> Ipsum Lorem</p>
                    </BaseWidget>
                     `
    }),
    // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
    tags: ['autodocs']


} as Meta<typeof BaseWidget>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
    args: {

    },
};
