import Vue from "vue";
import VueRouter from "vue-router";
import { UserHelper } from "../helpers/UserHelper";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/register",
    name: "Registrazione",
    component: () => import("../views/Register.vue"),
  },
  {
    path: "/recuperaPassword",
    name: "Recupera Password",
    component: () => import("../views/RecuperaPassword.vue"),
  },
  {
    path: "/modificaProfilo",
    name: "Modifica Profilo",
    component: () => import("../views/Modifica.vue"),
    meta: { authorize: [] },
  },
  {
    path: "/cambiaPassword",
    name: "Cambia Password",
    component: () => import("../views/CambiaPassword.vue"),
    meta: { authorize: [] },
  },
  {
    path: "/consumer/files",
    name: "Files",
    component: () => import("../views/Files.vue"),
    meta: { authorize: ["consumer"] },
  },
  {
    path: "/consumer/file",
    name: "File",
    component: () => import("../views/File.vue"),
    meta: { authorize: ["consumer"] },
  },
  {
    path: "/uploader/home",
    name: "Home Uploader",
    component: () => import("../views/HomepageUploader.vue"),
    meta: { authorize: ["uploader"] },
  },
  {
    path: "/uploader/caricaFile",
    name: "Carica File",
    component: () => import("../views/CaricaFile.vue"),
    meta: { authorize: ["uploader"] },
  },
  {
    path: "/uploader/creaConsumer",
    name: "Crea Consumer",
    component: () => import("../views/Register.vue"),
    meta: { authorize: ["uploader"] },
  },
  {
    path: "/uploader/modificaConsumer",
    name: "Modifica Consumer",
    component: () => import("../views/Modifica.vue"),
    meta: { authorize: ["uploader"] },
  },
  {
    path: "/administrator/uploadersStats",
    name: "Statistiche Uploaders",
    component: () => import("../views/uploadersStats.vue"),
    meta: { authorize: ["administrator"] },
  },
  {
    path: "/administrator/creaAmministratore",
    name: "Crea Amministratore",
    component: () => import("../views/Register.vue"),
    meta: { authorize: ["administrator"] },
  },
  {
    path: "/administrator/listaAmministratori",
    name: "Amministratori",
    component: () => import("../views/Lista.vue"),
    meta: { authorize: ["administrator"] },
  },
  {
    path: "/administrator/modificaAmministratore",
    name: "Modifica Amministratore",
    component: () => import("../views/Modifica.vue"),
    meta: { authorize: ["administrator"] },
  },
  {
    path: "/administrator/creaUploader",
    name: "Crea Uploader",
    component: () => import("../views/Register.vue"),
    meta: { authorize: ["administrator"] },
  },
  {
    path: "/administrator/listaUploaders",
    name: "Uploaders",
    component: () => import("../views/Lista.vue"),
    meta: { authorize: ["administrator"] },
  },
  {
    path: "/administrator/modificaUploader",
    name: "Modifica Uploader",
    component: () => import("../views/Modifica.vue"),
    meta: { authorize: ["administrator"] },
  },
  { path: "/consumer*", redirect: "/consumer/files" },
  { path: "/uploader*", redirect: "/uploader/home" },
  { path: "/administrator*", redirect: "/administrator/uploadersStats" },
  { path: "*", redirect: "/login" },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  const user = UserHelper.getLoggedUser();
  //l'utente loggato non deve accedere a queste pagine se non facendo prima logout
  if (
    (to.name === "Login" ||
      to.name === "Registrazione" ||
      to.name === "Recupera Password") &&
    user
  ) {
    return next({ path: `/${user.role}/` });
  }
  const { authorize } = to.meta;
  if (authorize) {
    if (!user) {
      //se non è loggato ritorna alla pagina di login
      return next({ path: "/login", query: { returnUrl: to.path } });
    }
    //se la route è riservata solo a determinati ruoli si controlla se l'utente è autorizzato
    if (authorize.length && !authorize.includes(user.role)) {
      //se l'utente non è autorizzato viene rimandato alla sua home
      return next({ path: `/${user.role}/` });
    }
  }
  next();
});

export default router;
