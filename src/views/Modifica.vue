<template>
  <main>
    <h1>{{ title }}</h1>
    <b-form class="centered-form">
      <InputSelect
        v-if="usernames"
        :options="usernames"
        :defaultOption="username"
        :touch="touch"
        label="Username"
        @setOption="setUsername"
      />
      <InputNomeCognome
        v-bind:user="user"
        v-bind:touch="touch"
        @setName="setName"
      />
      <InputEmail
        v-bind:user="user"
        v-bind:touch="touch"
        @setEmail="setEmail"
      />
      <InputLogo
        v-if="role === 'uploader'"
        v-bind:user="user"
        v-bind:touch="touch"
        @setLogo="setLogo"
      />
      <b-form-group class="form-buttons">
        <LoadingButton
          text="Conferma la modifica"
          c="spaced-buttons"
          :submitting="submitting"
          :disabled="!edited"
          @submit="handleSubmit"
        />
        <b-button
          :class="edited ? 'no-hover spaced-buttons' : 'spaced-buttons'"
          variant="outline-primary"
          :disabled="!edited"
          @click="handleReset"
          >Reset</b-button
        >
      </b-form-group>
    </b-form>
  </main>
</template>

<script>
import { mapActions } from "vuex";
import { UserHelper } from "../helpers/UserHelper";
import InputNomeCognome from "../components/inputUser/InputNomeCognome";
import InputEmail from "../components/inputUser/InputEmail";
import InputLogo from "../components/inputUser/InputLogo";
import InputSelect from "../components/inputUser/InputSelect";
import router from "../router";
import LoadingButton from "../components/LoadingButton";

export default {
  components: {
    InputNomeCognome,
    InputEmail,
    InputLogo,
    InputSelect,
    LoadingButton
  },
  data() {
    return {
      userDB: {},
      user: {},
      touch: false,
      title: "",
      username: "",
      role: "",
      usernames: null,
      submitting: false,
      invalidName: false,
      invalidEmail: false,
      invalidUsername: true
    };
  },
  mounted: function() {
    this.updatePage();
  },
  watch: {
    username: function() {
      if (this.username) {
        UserHelper.getUser(this.username)
          .then(res => {
            if (this.role === "uploader" && !res.data.logo) {
              res.data.logo = "";
            }
            this.userDB = res.data;
            this.user = Object.assign({}, this.userDB);
          })
          .catch(() => {
            this.error("Impossibile proseguire sulla pagina richiesta");
            router.push(`/${UserHelper.getLoggedUser().role}/`);
          });
      }
    },
    "$route.path": function() {
      this.updatePage();
    }
  },
  methods: {
    ...mapActions("alert", ["success", "error"]),
    updatePage() {
      let url = this.$route.path;
      if (url.endsWith("modificaProfilo")) {
        this.title = "Modifica profilo";
        this.setUsername(UserHelper.getLoggedUser().username);
        this.role = UserHelper.getLoggedUser().role;
        this.usernames = null;
      } else {
        if (url.endsWith("modificaConsumer")) {
          this.title = "Modifica Consumer";
          this.role = "consumer";
        } else if (url.endsWith("modificaUploader")) {
          this.title = "Modifica Uploader";
          this.role = "uploader";
        } else if (url.endsWith("modificaAmministratore")) {
          this.title = "Modifica Amministratore";
          this.role = "administrator";
        } else {
          router.push(`/${UserHelper.getLoggedUser().role}/`);
        }
        //recupero gli usernames
        UserHelper.getUsernames(this.role)
          .then(res => {
            this.usernames = res.data;
            if (this.$route.params && this.$route.params.username)
              this.setUsername(this.$route.params.username);
          })
          .catch(() => {
            this.error("Impossibile proseguire sulla pagina richiesta");
            router.push(`/${UserHelper.getLoggedUser().role}/`);
          });
      }
    },
    setUsername(username, invalid = false) {
      this.username = username;
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
    setLogo(logo) {
      this.user.logo = logo;
    },
    handleSubmit() {
      this.touch = true;
      if (
        this.edited &&
        !(this.invalidName || this.invalidEmail || this.invalidUsername)
      ) {
        this.submitting = true;
        UserHelper.editUser(this.user)
          .then(() => {
            this.success("Modifica conclusa con successo.");
            this.submitting = false;
            router.push(`/${UserHelper.getLoggedUser().role}/`);
          })
          .catch(() => {
            this.error("Modifica dati fallita");
            this.submitting = false;
          });
      }
    },
    handleReset() {
      this.user = Object.assign({}, this.userDB);
    }
  },
  computed: {
    edited: function() {
      for (let propName in this.user) {
        if (this.user[propName] !== this.userDB[propName]) return true;
      }
      return false;
    }
  }
};
</script>
