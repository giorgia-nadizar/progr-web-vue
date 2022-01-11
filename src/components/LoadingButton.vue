<template>
  <b-overlay
    :show="submitting"
    rounded
    opacity="0.6"
    spinner-small
    :spinner-variant="localVariant"
    class="d-inline-block"
    @hidden="onHidden"
  >
    <b-button
      ref="button"
      :class="c"
      :size="localSize"
      :disabled="disable"
      :variant="localVariant"
      @click="$emit('submit')"
    >
      <b-icon v-if="icon" :icon="icon" aria-hidden="true"></b-icon>
      {{ text }}
    </b-button>
  </b-overlay>
</template>

<script>
export default {
  props: ["submitting", "icon", "text", "variant", "size", "disabled", "c"],
  methods: {
    onHidden() {
      this.$refs.button.focus();
    }
  },
  computed: {
    localVariant: function() {
      return this.$props.variant ? this.$props.variant : "primary";
    },
    localSize: function() {
      return this.$props.size ? this.$props.size : null;
    },
    disable: function() {
      return this.$props.submitting || this.$props.disabled;
    }
  }
};
</script>
