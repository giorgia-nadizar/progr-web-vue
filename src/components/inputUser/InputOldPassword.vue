<template>
  <b-form-group
    label="Vecchia Password"
    label-align="left"
    :invalid-feedback="errorMsg"
    :state="state"
    ><b-input-group>
      <b-form-input
        :type="passwordInputType"
        v-model="$v.password.$model"
        :state="state"
        @change.native="$emit('setPassword', password, $v.$invalid)"
      ></b-form-input>
      <template v-slot:append>
        <b-button variant="outline-secondary" @click="togglePasswordVisibility"
          ><b-icon :icon="passwordIcon" aria-hidden="true"></b-icon
        ></b-button>
      </template>
    </b-input-group>
  </b-form-group>
</template>

<script>
import { required } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      password: "",
      passwordInputType: "password",
      passwordIcon: "eye",
    };
  },
  validations: {
    password: { required },
  },
  props: ["touch"],
  methods: {
    togglePasswordVisibility() {
      if (this.passwordInputType === "password") {
        this.passwordInputType = "text";
        this.passwordIcon = "eye-slash";
      } else {
        this.passwordInputType = "password";
        this.passwordIcon = "eye";
      }
    },
  },
  computed: {
    errorMsg: function() {
      return this.$v.password.$error && !this.$v.password.required
        ? "Campo obbligatorio"
        : null;
    },
    state: function() {
      if (this.$v.password.$dirty && this.$v.password.$invalid) {
        return false;
      } else {
        return null;
      }
    },
  },
  watch: {
    "$props.touch": function() {
      this.$v.password.$touch();
    },
  },
};
</script>
