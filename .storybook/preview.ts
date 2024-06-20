import type { Preview } from "@storybook/vue3";
import { themes } from '@storybook/theming';
import { setup } from '@storybook/vue3';
import EventBus from '../src/plugins/EventBus';
import {
  createVuesticEssential,
  createIconsConfig,
  VaButton,
  VaColorInput,
  VaSelect,
  VaInput,
  VaSwitch,
  VaDateInput,
  VaTimeInput,
  VaDataTable,
  VaPagination,
  VaIcon
} from "vuestic-ui";
import "vuestic-ui/css";
import "@/assets/main.css";

setup((app) => {
  app.use(EventBus);
  app.use(
    createVuesticEssential({
      components: {
        createIconsConfig,
        VaButton,
        VaColorInput,
        VaSelect,
        VaInput,
        VaSwitch,
        VaDateInput,
        VaTimeInput,
        VaDataTable,
        VaPagination,
        VaIcon
      },
    }),
  );
});

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs:{
      theme:themes.dark
    }
  },
};

export default preview;
