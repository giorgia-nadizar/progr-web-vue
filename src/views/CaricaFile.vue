<template>
  <main>
    <h1>Carica file</h1>
    <b-form class="centered-form">
      <InputSelect
        :touch="touch"
        label="Consumer"
        :defaultOption="file.consumer"
        :options="consumers"
        @setOption="setConsumer"
      />
      <InputFile @setFile="setFile" v-bind:touch="touch" ref="file" />
      <InputHashtags @setHashtags="setHashtags" ref="hashtag" />
      <LoadingButton
        text="Carica il file"
        :submitting="submitting"
        @submit="handleSubmit"
      />
    </b-form>
  </main>
</template>

<script>
import { mapActions } from "vuex";
import { FileHelper } from "../helpers/FileHelper";
import { UserHelper } from "../helpers/UserHelper";
import router from "../router";
import InputSelect from "../components/inputUser/InputSelect";
import InputFile from "../components/inputFile/InputFile";
import InputHashtags from "../components/inputFile/InputHashtags";
import LoadingButton from "../components/LoadingButton";

export default {
  components: {
    InputSelect,
    InputFile,
    InputHashtags,
    LoadingButton
  },
  data() {
    return this.defaultData();
  },
  created: function() {
    UserHelper.getUsernames("consumer")
      .then(res => {
        this.consumers = res.data;
        if (this.consumers.length === 0) {
          router.push("/uploader/creaConsumer");
        }
      })
      .catch(() => {
        this.error("Impossibile proseguire sulla pagina richiesta");
        router.push("/uploader/");
      });
    if (this.$route.params && this.$route.params.consumer) {
      this.setConsumer(this.$route.params.consumer);
    }
  },
  methods: {
    ...mapActions("alert", ["success", "error"]),
    defaultData() {
      return {
        file: {
          nome: "",
          contenuto: "",
          hashtag: [],
          consumer: ""
        },
        touch: false,
        invalid: true,
        invalidConsumer: true,
        consumers: [],
        submitting: false
      };
    },
    setFile(filename, file, invalid) {
      this.file.contenuto = file;
      this.file.nome = filename;
      this.invalid = invalid;
    },
    setConsumer(consumer, invalid = false) {
      this.file.consumer = consumer;
      this.invalidConsumer = invalid;
    },
    setHashtags(hashtags) {
      this.file.hashtag = hashtags;
    },
    handleSubmit() {
      this.touch = true;
      if (!this.invalid && !this.invalidConsumer) {
        this.submitting = true;
        FileHelper.uploadFile(this.file)
          .then(() => {
            this.success("Caricamento riuscito.");
            const cons = this.consumers;
            Object.assign(this.$data, this.defaultData());
            this.consumers = cons;
            this.$refs.file.clear();
            this.$refs.hashtag.clear();
            this.submitting = false;
          })
          .catch(() => {
            this.error("Caricamento fallito");
            this.submitting = false;
          });
      }
    }
  }
};
</script>
