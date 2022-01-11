import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import Vuelidate from "vuelidate";
import { UserHelper } from "./helpers/UserHelper";
import axios from "axios";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(Vuelidate);
Vue.use(require("vue-moment"));

Vue.config.productionTip = false;

axios.interceptors.request.use(
  (config) => {
    const user = UserHelper.getLoggedUser();
    if (user) {
      config.headers.common["Authorization"] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (!error.response) {
      store.dispatch(
        "alert/error",
        "Impossibile connettersi. Si prega di controllare la propria connessione di rete.",
        { root: true }
      );
    } else {
      console.log(`Error ${error.response.status} - ${error.response.data}`);
      if (
        error.response.status === 401 &&
        error.response.data === "Token non valido o scaduto"
      ) {
        store.dispatch(
          "alert/error",
          `${error.response.data}, si prega di effettuare nuovamente il login.`,
          { root: true }
        );
        store.dispatch("account/logout");
        return new Promise(() => {});
      }
    }
    return Promise.reject(error);
  }
);

new Vue({
  router,
  store,
  axios,
  render: (h) => h(App),
}).$mount("#app");
