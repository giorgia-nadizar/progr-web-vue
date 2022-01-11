<template>
  <main>
    <h1>Login</h1>
    <b-form class="centered-form">
      <LoginUsername @setUsername="setUsername" v-bind:touch="touch" />
      <LoginPassword @setPassword="setPassword" v-bind:touch="touch" />
      <b-form-group class="form-buttons">
        <LoadingButton
          text="Login"
          c="spaced-buttons"
          :submitting="submitting"
          @submit="handleSubmit"
        />
        <b-button to="/register" class="spaced-buttons" variant="link"
          >Register</b-button
        >
      </b-form-group>
      <b-button to="/recuperaPassword" variant="link"
        >Password dimenticata?</b-button
      >
    </b-form>
  </main>
</template>

<script>
import { mapState, mapActions } from "vuex";
import LoginUsername from "../components/login/LoginUsername";
import LoginPassword from "../components/login/LoginPassword";
import LoadingButton from "../components/LoadingButton";

export default {
  components: {
    LoginUsername,
    LoginPassword,
    LoadingButton
  },
  data() {
    return {
      username: "",
      password: "",
      invalidUsername: true,
      invalidPassword: true,
      submitting: false,
      touch: false
    };
  },
  computed: {
    ...mapState("account", ["status", "user"]),
    returnUrl: function() {
      return this.$route.query.returnUrl;
    }
  },
  methods: {
    ...mapActions("account", ["login"]),
    setUsername(username, invalid) {
      this.username = username;
      this.invalidUsername = invalid;
    },
    setPassword(password, invalid) {
      this.password = password;
      this.invalidPassword = invalid;
    },
    handleSubmit() {
      this.touch = true;
      if (!(this.invalidUsername || this.invalidPassword)) {
        this.submitting = true;
        const { username, password, returnUrl } = this;
        this.login({ username, password, returnUrl })
          .then(() => {
            this.submitting = false;
          })
          .catch(() => {
            this.submitting = false;
          });
      }
    }
  }
};
</script>
