<template>
  <b-overlay :show="busy" no-wrap @shown="onShown">
    <template v-slot:overlay>
      <div
        ref="dialog"
        tabindex="-1"
        role="dialog"
        aria-modal="false"
        aria-labelledby="form-confirm-label"
        class="text-center p-3"
      >
        <p>
          <strong id="form-confirm-label">Confermare l'eliminazione?</strong>
        </p>
        <div class="d-flex justify-content-center">
          <b-button variant="outline-danger" class="mr-3" @click="onCancel">
            Annulla
          </b-button>
          <b-button variant="outline-success" @click="onOK">Conferma</b-button>
        </div>
      </div>
    </template>
  </b-overlay>
</template>

<script>
export default {
  data() {
    return {
      busy: false,
      username: null,
      id: null
    };
  },
  methods: {
    askConfirm(username, id) {
      this.busy = true;
      this.username = username;
      this.id = id;
    },
    onShown() {
      this.$refs.dialog.focus();
    },
    onCancel() {
      this.busy = false;
    },
    onOK() {
      this.busy = false;
      this.$emit("confirm", this.username, this.id);
    }
  }
};
</script>