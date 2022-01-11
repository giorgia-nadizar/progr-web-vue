<template>
  <main>
    <h1>{{ title }}</h1>
    <b-form class="centered-form">
      <InputCodFiscaleConsumer
        v-if="role === 'consumer'"
        @setCF="setUsername"
        v-bind:touch="touch"
      />
      <InputUsernameUploader
        v-if="role === 'uploader'"
        @setUsername="setUsername"
        v-bind:touch="touch"
      />
      <InputEmailAmministratore
        v-if="role === 'administrator'"
        @setEmail="setEmailAdmin"
        v-bind:touch="touch"
      />
      <InputNomeCognome @setName="setName" v-bind:touch="touch" />
      <InputEmail
        v-if="role !== 'administrator'"
        @setEmail="setEmail"
        v-bind:touch="touch"
      />
      <InputPassword @setPassword="setPassword" v-bind:touch="touch" />
      <InputLogo
        v-if="role === 'uploader'"
        @setLogo="setLogo"
        v-bind:touch="touch"
      />
      <b-form-group class="form-buttons">
        <LoadingButton
          text="Conferma registrazione"
          c="spaced-buttons"
          :submitting="submitting"
          @submit="handleSubmit"
        />
        <b-button to="/login" variant="link">Annulla</b-button>
      </b-form-group>
    </b-form>
  </main>
</template>

<script>
import { mapActions } from "vuex";
import { UserHelper } from "../helpers/UserHelper";
import router from "../router";
import InputCodFiscaleConsumer from "../components/inputUser/InputCodFiscaleConsumer";
import InputUsernameUploader from "../components/inputUser/InputUsernameUploader";
import InputEmailAmministratore from "../components/inputUser/InputEmailAmministratore";
import InputNomeCognome from "../components/inputUser/InputNomeCognome";
import InputEmail from "../components/inputUser/InputEmail";
import InputPassword from "../components/inputUser/InputPassword";
import InputLogo from "../components/inputUser/InputLogo";
import LoadingButton from "../components/LoadingButton";

export default {
  components: {
    InputCodFiscaleConsumer,
    InputUsernameUploader,
    InputEmailAmministratore,
    InputNomeCognome,
    InputEmail,
    InputPassword,
    InputLogo,
    LoadingButton
  },
  data() {
    return {
      user: {
        username: "",
        nomeCognome: "",
        logo: "",
        email: "",
        password: ""
      },
      invalidUsername: true,
      invalidName: true,
      invalidEmail: true,
      invalidPassword: true,
      submitting: false,
      touch: false
    };
  },
  computed: {
    role: function() {
      let url = this.$route.path;
      if (url.endsWith("creaAmministratore")) {
        return "administrator";
      } else if (url.endsWith("creaUploader")) {
        return "uploader";
      } else {
        return "consumer";
      }
    },
    title: function() {
      let url = this.$route.path;
      if (url.endsWith("creaAmministratore")) {
        return "Crea Amministratore";
      } else if (url.endsWith("creaUploader")) {
        return "Crea Uploader";
      } else if (url.endsWith("creaConsumer")) {
        return "Crea Consumer";
      } else {
        return "Registrati";
      }
    }
  },
  methods: {
    ...mapActions("alert", ["success", "error"]),
    setEmailAdmin(email, invalid = true) {
      this.setEmail(email, invalid);
      this.setUsername(email, invalid);
    },
    setUsername(username, invalid = true) {
      this.user.username = username;
      this.invalidUsername = invalid;
    },
    setName(name, invalid) {
      this.user.nomeCognome = name;
      this.invalidName = invalid;
    },
    setEmail(email, invalid) {
      this.user.email = email;
      this.invalidEmail = invalid;
    },
    setPassword(password, invalid) {
      this.user.password = password;
      this.invalidPassword = invalid;
    },
    setLogo(logo) {
      this.user.logo = logo;
    },
    ...mapActions("account", ["register"]),
    handleSubmit() {
      this.touch = true;
      if (
        !(
          this.invalidUsername ||
          this.invalidName ||
          this.invalidEmail ||
          this.invalidPassword
        )
      ) {
        this.submitting = true;
        this.user.role = this.role;
        UserHelper.createUser(this.user)
          .then(() => {
            if (this.title === "Registrati") {
              router.push("/login");
            } else {
              router.push(`/${UserHelper.getLoggedUser().role}/`);
            }
            this.success("Creazione utente conclusa con successo.");
            this.submitting = false;
          })
          .catch(() => {
            this.error("Creazione utente fallita");
            this.submitting = false;
          });
      }
    }
  }
};
</script>
