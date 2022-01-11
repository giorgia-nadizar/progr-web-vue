<template>
  <b-form-group
    label="Indirizzo e-mail"
    label-align="left"
    :invalid-feedback="errorMsg"
    :state="state"
  >
    <b-form-input
      type="email"
      class="lowerCase"
      v-model="$v.email.$model"
      :state="state"
      @change.native="$emit('setEmail', email.toLowerCase(), $v.email.$invalid)"
    ></b-form-input>
  </b-form-group>
</template>

<script>
import { required, email } from "vuelidate/lib/validators";
import { UserHelper } from "../../helpers/UserHelper";

export default {
  data() {
    return {
      email: ""
    };
  },
  validations: {
    email: {
      required,
      email,
      async isUnique(value) {
        return await UserHelper.isUnique(value);
      }
    }
  },
  props: ["touch"],
  computed: {
    errorMsg: function() {
      if (this.$v.email.$error && !this.$v.email.required) {
        return "Campo obbligatorio";
      } else if (this.$v.email.$error && !this.$v.email.email) {
        return "Inserire un indirizzo e-mail valido";
      } else if (this.$v.email.$error && !this.$v.email.unique) {
        return "Amministratore già registrato";
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
    "$v.email.$invalid": function(value) {
      this.$emit("setEmail", this.email.toLowerCase(), value);
    },
    "$props.touch": function() {
      this.$v.email.$touch();
    }
  }
};
</script>