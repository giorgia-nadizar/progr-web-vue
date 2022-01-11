<template>
  <b-form-group
    label="Username"
    label-align="left"
    :invalid-feedback="errorMsg"
    :state="state"
  >
    <b-form-input
      v-model="$v.username.$model"
      :state="state"
      @change.native="$emit('setUsername', username, $v.username.$error)"
    ></b-form-input>
  </b-form-group>
</template>

<script>
import { required } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      username: ""
    };
  },
  props: ["touch"],
  validations: {
    username: { required }
  },
  computed: {
    errorMsg: function() {
      return this.$v.username.$error && !this.$v.username.required
        ? "Campo obbligatorio"
        : null;
    },
    state: function() {
      if (this.$v.username.$dirty && this.$v.username.$invalid) {
        return false;
      } else {
        return null;
      }
    }
  },
  watch: {
    "$props.touch": function() {
      this.$v.username.$touch();
    }
  }
};
</script>
