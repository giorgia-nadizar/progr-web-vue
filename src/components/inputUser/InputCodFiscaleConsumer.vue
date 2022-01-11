<template>
  <b-form-group
    label="Codice Fiscale"
    label-align="left"
    :invalid-feedback="errorMsg"
    :state="state"
  >
    <b-form-input
      class="upperCase"
      v-model="$v.cf.$model"
      :state="state"
      @change.native="$emit('setCF', cf.toUpperCase(), $v.cf.$invalid)"
    ></b-form-input>
  </b-form-group>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { UserHelper } from "../../helpers/UserHelper";

export default {
  data() {
    return {
      cf: ""
    };
  },
  validations: {
    cf: {
      required,
      async isUnique(value) {
        return await UserHelper.isUnique(value);
      },
      codFiscale(value) {
        return /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/.test(
          value.toUpperCase()
        );
      }
    }
  },
  props: ["touch"],
  computed: {
    errorMsg: function() {
      if (this.$v.cf.$error && !this.$v.cf.required) {
        return "Campo obbligatorio";
      } else if (this.$v.cf.$error && !this.$v.cf.codFiscale) {
        return "Inserire un Codice Fiscale valido";
      } else if (this.$v.cf.$error && !this.$v.cf.unique) {
        return "Consumer già registrato";
      } else return null;
    },
    state: function() {
      if (this.$v.cf.$dirty && this.$v.cf.$invalid) {
        return false;
      } else {
        return null;
      }
    }
  },
  watch: {
    "$v.cf.$invalid": function(value) {
      this.$emit("setCF", this.cf.toUpperCase(), value);
    },
    "$props.touch": function() {
      this.$v.cf.$touch();
    }
  }
};
</script>
