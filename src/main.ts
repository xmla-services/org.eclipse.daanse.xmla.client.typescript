/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors:

*/
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
  VaChip,
  VaIcon,
  VaCheckbox
} from "vuestic-ui";
import "vuestic-ui/styles/essential.css";
import "vuestic-ui/styles/grid.css";
import "vuestic-ui/styles/reset.css";
import "vuestic-ui/styles/typography.css";
import './scss/mainLayout.scss';

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
            VaChip,
            VaIcon,
            VaCheckbox
        },
        config: {
            colors: {
                variables: {
                    primary: "#133370",
                    warning: "#F49423"
                },
            },
        },
    })
);

app.mount("#app");
