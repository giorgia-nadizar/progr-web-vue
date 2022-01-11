<template>
  <main>
    <h1>Cambia password</h1>
    <b-form class="centered-form">
      <InputPassword @setPassword="setNewPassword" :touch="touch" />
      <InputOldPassword @setPassword="setOldPassword" :touch="touch" />
      <LoadingButton
        text="Cambia Password"
        :submitting="submitting"
        @submit="handleSubmit"
      />
    </b-form>
  </main>
</template>

<script>
import { mapActions } from "vuex";
import { UserHelper } from "../helpers/UserHelper";
import router from "../router";
import InputPassword from "../components/inputUser/InputPassword";
import InputOldPassword from "../components/inputUser/InputOldPassword";
import LoadingButton from "../components/LoadingButton";

export default {
  components: { InputPassword, InputOldPassword, LoadingButton },
  data() {
    return {
      password: {
        newPassword: "",
        oldPassword: ""
      },
      invalidNewPassword: true,
      invalidOldPassword: false,
      touch: false,
      submitting: false
    };
  },
  methods: {
    ...mapActions("alert", ["success", "error"]),
    setNewPassword(password, invalid) {
      this.password.newPassword = password;
      this.invalidNewPassword = invalid;
    },
    setOldPassword(password, invalid) {
      this.password.oldPassword = password;
      this.invalidOldPassword = invalid;
    },
    handleSubmit() {
      this.touch = true;
      if (!(this.invalidNewPassword || this.invalidOldPassword)) {
        this.submitting = true;
        UserHelper.changePassword(this.password)
          .then(() => {
            this.success("Password modificata con successo.");
            this.submitting = false;
            router.push(`/${UserHelper.getLoggedUser().role}/`);
          })
          .catch(() => {
            this.error("Modifica password fallita");
            this.submitting = false;
          });
      }
    }
  }
};
</script>
