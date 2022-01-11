<template>
  <b-form-group
    label="Indirizzo e-mail"
    label-align="left"
    :invalid-feedback="errorMsg"
    :state="state"
  >
    <b-form-input
      type="email"
      v-model="$v.email.$model"
      :state="state"
      @change.native="$emit('setEmail', email, $v.email.$error)"
    ></b-form-input>
  </b-form-group>
</template>

<script>
import { required, email } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      email: ""
    };
  },
  props: ["user", "touch"],
  validations: {
    email: { required, email }
  },
  computed: {
    errorMsg: function() {
      if (this.$v.email.$error && !this.$v.email.required) {
        return "Campo obbligatorio";
      } else if (this.$v.email.$error && !this.$v.email.email) {
        return "Inserire un indirizzo e-mail corretto";
      } else return null;
    },
    state: function() {
      if (this.$v.email.$dirty && this.$v.email.$invalid) {
        return false;
      } else {
        return null;
      }
    }
  },
  watch: {
    "$props.touch": function() {
      this.$v.email.$touch();
    },
    "$props.user": function() {
      this.email =
        this.$props.user && this.$props.user.email
          ? this.$props.user.email
          : "";
    }
  }
};
</script>
