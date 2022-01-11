<template>
  <main>
    <h1>Recupera password</h1>
    <b-form class="centered-form">
      <LoginUsername @setUsername="setUsername" v-bind:touch="touch" />
      <b-form-group class="form-buttons">
        <LoadingButton
          text="Conferma"
          c="spaced-buttons"
          :submitting="submitting"
          @submit="handleSubmit"
        />
        <b-button to="/login" class="spaced-buttons" variant="link"
          >Annulla</b-button
        >
      </b-form-group>
    </b-form>
  </main>
</template>

<script>
import LoginUsername from "../components/login/LoginUsername";
import LoadingButton from "../components/LoadingButton";
import { UserHelper } from "../helpers/UserHelper";
import { mapActions } from "vuex";
import router from "../router";

export default {
  components: {
    LoginUsername,
    LoadingButton
  },
  data() {
    return {
      username: "",
      invalidUsername: true,
      submitting: false,
      touch: false
    };
  },
  methods: {
    ...mapActions("alert", ["success", "error"]),
    setUsername(username, invalid) {
      this.username = username;
      this.invalidUsername = invalid;
    },
    handleSubmit() {
      this.touch = true;
      if (!this.invalidUsername) {
        this.submitting = true;
        UserHelper.passwordRecovery(this.username)
          .then(() => {
            this.success(
              "É stata inviata un'e-mail con le istruzioni per resettare la password all'indirizzo collegato all'account con lo username inserito"
            );
            this.submitting = false;
            router.push("/login");
          })
          .catch(() => {
            this.error("Reset password fallito, riprovare");
            this.submitting = false;
          });
      }
    }
  }
};
</script>
