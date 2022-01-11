<template>
  <b-form-group
    :label="label"
    label-align="left"
    :invalid-feedback="errorMsg"
    :state="state"
  >
    <b-form-select
      v-model="selected"
      :options="options"
      :state="state"
      @input="$emit('setOption', selected, $v.selected.$invalid)"
    ></b-form-select>
  </b-form-group>
</template>

<script>
import { required } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      selected: "",
    };
  },
  props: ["touch", "label", "options", "defaultOption"],
  validations: {
    selected: { required },
  },
  computed: {
    errorMsg: function() {
      if (this.$v.selected.$error && !this.$v.selected.required) {
        return "Campo obbligatorio";
      } else return null;
    },
    state: function() {
      if (this.$v.selected.$dirty && this.$v.selected.$invalid) {
        return false;
      } else {
        return null;
      }
    },
  },
  created: function() {
    if (this.$props.defaultOption) {
      this.selected = this.defaultOption;
    }
  },
  watch: {
    "$props.touch": function(t) {
      if (t) {
        this.$v.selected.$touch();
      } else {
        this.$v.selected.$reset();
      }
    },
    "$props.defaultOption": function() {
      this.selected = this.$props.defaultOption
        ? this.$props.defaultOption
        : "";
    },
  },
};
</script>
