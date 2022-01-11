<template>
  <main>
    <h1>Gestione {{ title }}</h1>
    <b-button
      class="createNew"
      variant="outline-secondary"
      :to="{
        name: 'Crea ' + ruolo
      }"
    >
      <b-icon icon="person-plus-fill" shift-h="-4"></b-icon>Crea un nuovo
      {{ ruolo }}
    </b-button>
    <b-table
      striped
      outlined
      stacked="md"
      :items="users"
      :fields="fields"
      :busy="loading"
      head-variant="dark"
      v-if="users.length"
    >
      <template v-slot:table-busy>
        <div class="text-center my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Caricamento...</strong>
        </div>
      </template>
      <template v-slot:cell(Azioni)="row">
        <b-button
          size="sm"
          :to="{
            name: `Modifica ${ruolo}`,
            params: { username: row.item.username }
          }"
          class="mr-2"
          >Modifica Dati</b-button
        >
        <LoadingButton
          size="sm"
          variant="secondary"
          :submitting="row.item.deleting"
          text="Elimina"
          @submit="askConfirm(row.item.username)"
        />
      </template>
    </b-table>
    <Confirm ref="confirm" @confirm="deleteUser" />
  </main>
</template>

<script>
import { UserHelper } from "../helpers/UserHelper";
import LoadingButton from "../components/LoadingButton";
import Confirm from "../components/Confirm";
import router from "../router";
import { mapActions } from "vuex";
export default {
  components: { Confirm, LoadingButton },
  data() {
    return {
      users: [],
      fields: ["username", "nomeCognome", "email", "Azioni"],
      title: "",
      role: "",
      ruolo: "",
      loading: null
    };
  },
  created: function() {
    this.updatePage();
  },
  watch: {
    "$route.path": function() {
      this.updatePage();
    }
  },
  methods: {
    ...mapActions("alert", ["success", "error"]),
    updatePage() {
      this.loading = true;
      if (this.$route.path.endsWith("listaUploaders")) {
        //gestisco il caso degli uploaders
        this.role = "uploader";
        this.ruolo = "Uploader";
        this.title = "Uploaders";
      } else if (this.$route.path.endsWith("listaAmministratori")) {
        //gestisco il caso degli amministratori
        this.role = "administrator";
        this.ruolo = "Amministratore";
        this.title = "Amministratori";
      } else {
        router.push(`/${UserHelper.getLoggedUser().role}/`);
      }
      UserHelper.getUsers(this.role)
        .then(res => {
          res.data.forEach(function(user) {
            user.deleting = false;
          });
          this.users = res.data;
          this.users = this.users.filter(
            user => user.username !== UserHelper.getLoggedUser().username
          );
          this.loading = false;
        })
        .catch(() => {
          this.error("Impossibile proseguire sulla pagina richiesta");
          router.push(`/${UserHelper.getLoggedUser().role}/`);
        });
    },
    askConfirm(username) {
      this.$refs.confirm.askConfirm(username);
    },
    deleteUser(username) {
      this.users.find(x => x.username === username).deleting = true;
      UserHelper.deleteUser(username)
        .then(() => {
          this.users = this.users.filter(user => user.username !== username);
          this.success("Eliminazione effettuata con successo");
        })
        .catch(() => {
          this.error(`Eliminazione ${this.ruolo.toLowerCase} fallita`);
          this.users.find(x => x.username === username).deleting = false;
        });
    }
  }
};
</script>
