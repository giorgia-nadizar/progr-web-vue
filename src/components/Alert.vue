<template>
  <b-alert
    :show="dismissCountDown"
    dismissible
    fade
    :variant="alert.type"
    @dismissed="clearAlert"
    @dismiss-count-down="countDownChanged"
  >
    {{ alert.message }}
  </b-alert>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      dismissSecs: 4,
      dismissCountDown: 0
    };
  },
  computed: {
    ...mapState({
      alert: state => state.alert
    }),
    hasMessage: function() {
      return this.alert.message ? true : false;
    }
  },
  methods: {
    ...mapActions({
      clearAlert: "alert/clear"
    }),
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    }
  },
  watch: {
    "alert.message": function(value) {
      if (value) {
        this.dismissCountDown = this.dismissSecs;
      } else {
        this.dismissCountDown = 0;
      }
    }
  }
};
</script>
