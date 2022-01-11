<template>
  <div>
    <b-form-group
      label="Nome Documento"
      label-align="left"
      :invalid-feedback="errorMsgFirst"
      :state="stateFirst"
    >
      <b-form-input
        v-model="$v.filename.$model"
        :state="stateFirst"
        @change.native="
          $emit('setFile', filename, file, fileTooBig || $v.filename.$error)
        "
      ></b-form-input>
    </b-form-group>
    <b-form-group
      label="Documento"
      label-align="left"
      :invalid-feedback="errorMsgSecond"
      :state="stateSecond"
    >
      <b-form-file
        ref="fileinput"
        :state="stateSecond"
        browse-text="Scegli file"
        accept="image/*, application/pdf"
        placeholder=" "
        drop-placeholder="Rilascia qui il file per caricarlo"
        @change.native="handleFile"
      ></b-form-file>
    </b-form-group>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";

export default {
  data() {
    return this.defaultData();
  },
  validations: {
    file: { required },
    filename: {
      required
    }
  },
  props: ["touch"],
  computed: {
    errorMsgFirst: function() {
      return this.$v.filename.$invalid && !this.$v.filename.required
        ? "Campo obbligatorio"
        : null;
    },
    errorMsgSecond: function() {
      if (this.fileTooBig) {
        return "Il file supera la dimensione massima consentita di 800KB";
      } else if (this.$v.file.$invalid && !this.$v.file.required) {
        return "Campo obbligatorio";
      } else {
        return null;
      }
    },
    stateFirst: function() {
      if (this.$v.filename.$dirty && this.$v.filename.$invalid) {
        return false;
      } else {
        return null;
      }
    },
    stateSecond: function() {
      if ((this.$v.file.$dirty && this.$v.file.$invalid) || this.fileTooBig) {
        return false;
      } else {
        return null;
      }
    }
  },
  watch: {
    "$props.touch": function(t) {
      if (t) {
        this.$v.file.$touch();
        this.$v.filename.$touch();
      } else {
        this.$v.file.$reset();
        this.$v.filename.$reset();
      }
    },
    file: function() {
      this.$emit(
        "setFile",
        this.filename,
        this.file,
        this.fileTooBig || this.$v.filename.$error
      );
    }
  },
  methods: {
    defaultData() {
      return {
        file: "",
        filename: "",
        fileTooBig: false
      };
    },
    clear() {
      this.$refs.fileinput.reset();
      Object.assign(this.$data, this.defaultData());
    },
    handleFile(e) {
      const selectedFile = e.target.files[0];
      if (!selectedFile) {
        this.fileTooBig = false;
        this.file = "";
        this.$v.file.$touch();
      } else if (selectedFile.size > 819000) {
        this.file = "";
        this.fileTooBig = true;
      } else {
        this.createBase64File(selectedFile);
        this.fileTooBig = false;
      }
    },
    createBase64File(fileObject) {
      const reader = new FileReader();
      reader.onload = e => {
        this.file = e.target.result;
        if (this.filename === "")
          this.filename = fileObject.name.substr(
            0,
            fileObject.name.lastIndexOf(".")
          );
      };
      reader.readAsDataURL(fileObject);
    }
  }
};
</script>
