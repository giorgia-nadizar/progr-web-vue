<template>
  <b-form-group label="Logo (opzionale)" label-align="left">
    <picture-input
      ref="pictureInput"
      @change="handleImage"
      @remove="handleImage"
      size="0.5"
      width="200"
      height="200"
      margin="10"
      radius="5"
      :prefill="image"
      accept="image/*"
      :removable="true"
      :customStrings="{
        tap: 'Trascina un\'immagine oppure clicca per aprire la galleria',
        drag: 'Trascina un\'immagine oppure clicca per aprire la galleria',
        change: 'Cambia immagine',
        remove: 'Rimuovi immagine',
        fileSize: 'L\'immagine supera la dimensione massima consentita',
        fileType: 'Il file selezionato è di un formato non supportato',
      }"
    >
    </picture-input>
  </b-form-group>
</template>

<script>
import PictureInput from "vue-picture-input";
export default {
  components: {
    PictureInput,
  },
  data() {
    return {
      image: "",
    };
  },
  props: ["user"],
  methods: {
    handleImage() {
      this.image = this.$refs.pictureInput.image;
      this.$emit("setLogo", this.image);
    },
  },
  mounted() {
    this.image =
      this.$props.user && this.$props.user.logo ? this.$props.user.logo : "";
  },
  watch: {
    "$props.user": function() {
      this.image =
        this.$props.user && this.$props.user.logo ? this.$props.user.logo : "";
    },
  },
};
</script>
