import { createApp } from "vue";
import { createPinia } from "pinia";
import SOAPClient from "./plugins/SOAPClient";

import App from "./App.vue";
// import router from './router'

import "./assets/main.css";
import {
  createVuesticEssential,
  VaButton,
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
} from "vuestic-ui";
import "vuestic-ui/styles/essential.css";
import "vuestic-ui/styles/grid.css";
import "vuestic-ui/styles/reset.css";
import "vuestic-ui/styles/typography.css";

const app = createApp(App);

const pinia = createPinia();
pinia.use(SOAPClient);
app.use(pinia);
// app.use(router)

app.use(
  createVuesticEssential({
    components: {
      VaButton,
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
    },
  })
);

app.mount("#app");
