<template>
  <main>
    <h1>I miei Consumers</h1>
    <b-button
      class="createNew"
      variant="outline-secondary"
      to="/uploader/creaConsumer"
    >
      <b-icon icon="person-plus-fill" shift-h="-4"></b-icon>Crea un nuovo
      Consumer
    </b-button>
    <b-table
      v-if="consumers.length"
      striped
      outlined
      responsive
      stacked="md"
      :items="consumers"
      :fields="fields"
      :busy="loading"
      head-variant="dark"
    >
      <template v-slot:table-busy>
        <div class="text-center my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Caricamento...</strong>
        </div>
      </template>
      <template v-slot:cell(gestioneFiles)="row">
        <b-button
          size="sm"
          @click="
            row.toggleDetails();
            getFiles(row.item.username, row.detailsShowing);
          "
          class="mr-2"
        >
          {{ row.detailsShowing ? "Nascondi" : "Mostra" }} Files
        </b-button>
        <b-button
          size="sm"
          :to="{ name: 'Carica File', params: { consumer: row.item.username } }"
          >Carica file</b-button
        >
      </template>
      <template v-slot:cell(gestioneConsumer)="row">
        <b-button
          size="sm"
          :to="{
            name: 'Modifica Consumer',
            params: { username: row.item.username }
          }"
          class="mr-2"
          >Modifica Dati</b-button
        >
        <LoadingButton
          size="sm"
          variant="secondary"
          :submitting="row.item.deleting"
          text="Elimina Consumer"
          @submit="askConfirm(row.item.username)"
        />
      </template>
      <template v-slot:row-details="row">
        <b-card>
          <b-table-simple
            :fields="fileFields"
            responsive
            stacked="md"
            v-if="row.item.files.length"
            class="table table-plain"
          >
            <b-thead>
              <b-tr>
                <b-th>Nome</b-th>
                <b-th>Hashtag</b-th>
                <b-th>Data Visualizzazione</b-th>
                <b-th>Indirizzo Ip Visualizzazione</b-th>
                <b-th>Elimina</b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-tr v-for="file in row.item.files" :key="file.id">
                <b-td>{{ file.nome }}</b-td>
                <b-td>{{ file.hashtag | formatTag }}</b-td>
                <b-td>
                  {{ file.dataOraVisualizzazione | formatDate }}
                </b-td>
                <b-td>{{ file.ipVisualizzazione }}</b-td>
                <b-td>
                  <LoadingButton
                    size="sm"
                    variant="secondary"
                    :submitting="file.deleting"
                    icon="trash"
                    @submit="askConfirm(row.item.username, file.id)"
                  />
                </b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
          <p v-else>
            Non sono stati caricati file per questo consumer.
          </p></b-card
        >
      </template>
    </b-table>
    <Confirm ref="confirm" @confirm="confirmDelete" />
  </main>
</template>

<script>
import { FileHelper } from "../helpers/FileHelper";
import * as moment from "moment/moment";
import { UserHelper } from "../helpers/UserHelper";
import { mapActions } from "vuex";
import Confirm from "../components/Confirm";
import LoadingButton from "../components/LoadingButton";
export default {
  components: { Confirm, LoadingButton },
  data() {
    return {
      consumers: [],
      fields: [
        "username",
        "nomeCognome",
        "email",
        "gestioneFiles",
        "gestioneConsumer"
      ],
      fileFields: [
        "nome",
        "hashtag",
        "dataOraVisualizzazione",
        "ipVisualizzazione",
        "Elimina"
      ],
      icon: "trash",
      submitting: false,
      loading: null
    };
  },
  created: function() {
    this.loading = true;
    UserHelper.getUsers("consumer")
      .then(res => {
        res.data.forEach(function(consumer) {
          consumer.files = [];
          consumer.deleting = false;
        });
        this.consumers = res.data;
        this.loading = null;
      })
      .catch(() => {
        this.error("Impossibile proseguire sulla pagina richiesta");
        this.loading = null;
        this.logout();
      });
  },
  filters: {
    formatDate: function(date) {
      if (date) {
        return moment(String(date)).format("DD/MM/YYYY");
      }
    },
    formatTag: function(tag) {
      if (tag) {
        return `#${tag.join(" #")}`;
      }
    }
  },
  methods: {
    ...mapActions("alert", ["success", "error"]),
    ...mapActions("account", ["logout"]),
    getFiles(username, open) {
      if (!open) {
        FileHelper.getFilesForUploaders(username)
          .then(res => {
            res.data.forEach(function(file) {
              file.deleting = false;
            });
            this.consumers.find(x => x.username === username).files = res.data;
          })
          .catch(() => {
            this.error("Impossibile caricare i file richiesti");
          });
      }
    },
    askConfirm(username, id) {
      this.$refs.confirm.askConfirm(username, id);
    },
    confirmDelete(username, id) {
      if (id) {
        this.deleteFile(username, id);
      } else {
        this.deleteConsumer(username);
      }
    },
    deleteConsumer(username) {
      this.consumers.find(x => x.username === username).deleting = true;
      UserHelper.deleteUser(username)
        .then(() => {
          this.consumers = this.consumers.filter(
            consumer => consumer.username !== username
          );
          this.success("Eliminazione consumer effettuata con successo");
        })
        .catch(() => {
          this.error("Eliminazione consumer fallita");
          this.submitting = false;
        });
    },
    deleteFile(consumer, id) {
      this.consumers
        .find(x => x.username === consumer)
        .files.find(y => y.id === id).deleting = true;
      FileHelper.deleteFile(id)
        .then(() => {
          this.consumers.find(
            x => x.username === consumer
          ).files = this.consumers
            .find(x => x.username === consumer)
            .files.filter(file => file.id !== id);
          this.success("Eliminazione file effettuata con successo");
        })
        .catch(() => {
          this.error("Eliminazione file fallita");
          this.submitting = false;
        });
    }
  }
};
</script>
