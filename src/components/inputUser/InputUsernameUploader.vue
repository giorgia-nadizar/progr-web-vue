<template>
  <b-form-group
    label="Username"
    label-align="left"
    description="4 caratteri alfanumerici"
    :invalid-feedback="errorMsg"
    :state="state"
  >
    <b-form-input
      class="lowerCase"
      v-model="$v.username.$model"
      :state="state"
      @change.native="
        $emit('setUsername', username.toLowerCase(), $v.username.$invalid)
      "
    ></b-form-input>
  </b-form-group>
</template>

<script>
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import { UserHelper } from "../../helpers/UserHelper";

export default {
  data() {
    return {
      username: ""
    };
  },
  validations: {
    username: {
      required,
      minLength: minLength(4),
      maxLength: maxLength(4),
      async isUnique(value) {
        return await UserHelper.isUnique(value);
      }
    }
  },
  props: ["touch"],
  computed: {
    errorMsg: function() {
      if (this.$v.username.$error && !this.$v.username.required) {
        return "Campo obbligatorio";
      } else if (
        this.$v.username.$error &&
        (!this.$v.username.minLength || !this.$v.username.maxLength)
      ) {
        return "Lo username dev'essere composto da esattamente 4 caratteri";
      } else if (this.$v.username.$error && !this.$v.username.unique) {
        return "Username già utilizzato da un altro uploader";
      } else return null;
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
    "$v.username.$invalid": function(value) {
      this.$emit("setUsername", this.username.toLowerCase(), value);
    },
    "$props.touch": function() {
      this.$v.username.$touch();
    }
  }
};
</script>
