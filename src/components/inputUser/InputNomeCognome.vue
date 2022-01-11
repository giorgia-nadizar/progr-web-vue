<template>
  <b-form-group
    label="Nome e Cognome"
    label-align="left"
    :invalid-feedback="errorMsg"
    :state="state"
  >
    <b-form-input
      v-model="$v.name.$model"
      :state="state"
      @change.native="$emit('setName', name, $v.name.$error)"
    ></b-form-input>
  </b-form-group>
</template>

<script>
import { required } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      name: ""
    };
  },
  props: ["user", "touch"],
  validations: {
    name: { required }
  },
  methods: {},
  computed: {
    errorMsg: function() {
      return this.$v.name.$error && !this.$v.name.required
        ? "Campo obbligatorio"
        : null;
    },
    state: function() {
      if (this.$v.name.$dirty && this.$v.name.$invalid) {
        return false;
      } else {
        return null;
      }
    }
  },
  watch: {
    "$props.touch": function() {
      this.$v.name.$touch();
    },
    "$props.user": function() {
      this.name =
        this.$props.user && this.$props.user.nomeCognome
          ? this.$props.user.nomeCognome
          : "";
    }
  }
};
</script>
