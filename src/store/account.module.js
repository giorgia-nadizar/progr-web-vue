import { UserHelper } from "../helpers/UserHelper";
import router from "../router";

const user = JSON.parse(localStorage.getItem("user"));
const state = user
  ? {
      status: { loggedIn: true },
      user: user,
    }
  : { status: {}, user: null };

const actions = {
  login({ dispatch, commit }, { username, password, returnUrl }) {
    commit("loginRequest");
    return UserHelper.login(username, password)
      .then((user) => {
        commit("loginSuccess", user);
        const url = returnUrl ? returnUrl : `/${user.role}/`;
        router.push(url);
      })
      .catch((err) => {
        commit("loginFailure", err);
        dispatch("alert/error", err.response.data, { root: true });
      });
  },
  logout({ commit }) {
    commit("logout");
    UserHelper.logout();
    router.push("/login");
  },
};

const mutations = {
  loginRequest(state) {
    state.status = { loggingIn: true };
  },
  loginSuccess(state, user) {
    state.status = { loggedIn: true };
    state.user = user;
  },
  loginFailure(state) {
    state.status = {};
    state.user = null;
    state.navlist = null;
  },
  logout(state) {
    state.status = {};
    state.user = null;
    state.navlist = null;
  },
};

export const account = {
  namespaced: true,
  state,
  actions,
  mutations,
};
