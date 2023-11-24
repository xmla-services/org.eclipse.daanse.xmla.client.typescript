import emitter from "tiny-emitter/instance";

export default {
  install: (app) => {
    app.config.globalProperties.$customEventBus = emitter;

    app.provide("customEventBus", emitter);
    emitter.on("NextPage", () => {
      console.log("next page");
    });
  },
};
