<template>
  <main>
    <b-card>
      <b-row>
        <b-col md="auto">
          <b-avatar rounded="lg" size="7em" :src="logo"></b-avatar>
        </b-col>
        <b-col>
          <b-card-body :title="uploaderName" align="left">
            <a
              :href="`mailto:${uploaderEmail}`"
              class="card-link"
              @mouseover="animateEmail"
              @mouseout="stopAnimation"
            >
              <b-icon
                icon="envelope"
                :animation="emailAnimation"
                shift-h="-4"
              ></b-icon
              >{{ uploaderEmail }}</a
            >
          </b-card-body>
        </b-col>
      </b-row>
    </b-card>

    <InputSelect :options="hashtags" @setOption="setHashtag" />

    <b-table
      striped
      outlined
      stacked="md"
      :busy="loading"
      :items="files"
      :fields="fields"
      :filter="hashtag"
      :filterIncludedFields="['hashtag']"
      head-variant="dark"
    >
      <template v-slot:cell(dataOraCaricamento)="row">
        {{ row.item.dataOraCaricamento | formatDate }}
      </template>
      <template v-slot:cell(dataOraVisualizzazione)="row">
        {{ row.item.dataOraVisualizzazione | formatDate }}
      </template>
      <template v-slot:cell(Download)="row">
        <LoadingButton
          size="sm"
          variant="secondary"
          :submitting="row.item.downloading"
          icon="download"
          @submit="DownloadFile(row.item.id)"
        />
      </template>
    </b-table>
  </main>
</template>

<script>
import router from "../router";
import { mapActions } from "vuex";
import { FileHelper } from "../helpers/FileHelper";
import * as moment from "moment/moment";
import _ from "lodash";
import LoadingButton from "../components/LoadingButton";
import InputSelect from "../components/inputUser/InputSelect";
export default {
  components: { LoadingButton, InputSelect },
  data() {
    return {
      files: [],
      hashtags: [{ value: "", text: "Tutti gli hashtag" }],
      loading: false,
      uploader: "",
      uploaderName: "",
      uploaderEmail: "",
      emailAnimation: null,
      logo: "",
      hashtag: null,
      fields: [
        "nome",
        { key: "dataOraCaricamento", label: "Data Caricamento" },
        { key: "dataOraVisualizzazione", label: "Data Visualizzazione" },
        "Download"
      ]
    };
  },
  created: function() {
    if (!this.$route.params || !this.$route.params.uploader) {
      router.push("/consumer/files");
    }
    this.loading = true;
    this.uploader = this.$route.params.uploader;
    this.uploaderName = this.$route.params.name;
    this.uploaderEmail = this.$route.params.email;
    this.logo = this.$route.params.logo;
    FileHelper.getFilesForConsumers(this.uploader)
      .then(res => {
        res.data.forEach(function(file) {
          file.downloading = false;
        });
        this.files = res.data;
        this.hashtags = this.hashtags.concat(
          _.union.apply(
            _,
            this.files.map(a => a.hashtag)
          )
        );
        this.loading = false;
      })
      .catch(() => {
        this.error("Impossibile proseguire sulla pagina richiesta");
        this.loading = false;
        router.push("/consumer/");
      });
  },
  filters: {
    formatDate: function(date) {
      if (date) {
        return moment(String(date)).format("DD/MM/YYYY");
      }
    }
  },
  methods: {
    ...mapActions("alert", ["success", "error"]),
    setHashtag(h) {
      this.hashtag = h;
    },
    DownloadFile(id) {
      this.files.find(x => x.id === id).downloading = true;
      FileHelper.getFile(this.uploader, id)
        .then(() => {
          this.$set(
            this.files.find(x => x.id === id),
            "dataOraVisualizzazione",
            moment().format()
          );
          this.files.find(x => x.id === id).downloading = false;
        })
        .catch(() => {
          this.error("Impossibile scaricare il file richiesto");
          this.files.find(x => x.id === id).downloading = false;
        });
    },
    animateEmail() {
      this.emailAnimation = "throb";
    },
    stopAnimation() {
      this.emailAnimation = null;
    }
  }
};
</script>
