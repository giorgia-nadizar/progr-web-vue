<template>
  <div id="app" @click="closeOpenDropdown">
    <Navbar v-if="account.user" ref="navbar" />
    <Alert />
    <router-view @click="closeOpenDropdown" class="main-view" />
  </div>
</template>

<script>
import Navbar from "./components/layout/Navbar";
import Alert from "./components/Alert";
import { mapState } from "vuex";

export default {
  name: "app",
  components: {
    Navbar,
    Alert
  },
  computed: {
    ...mapState({
      account: state => state.account
    })
  },
  methods: {
    closeOpenDropdown() {
      if (this.account.user) this.$refs.navbar.closeOpenDropdown();
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.lowerCase {
  text-transform: lowercase;
}

.upperCase {
  text-transform: uppercase;
}

.main-view {
  max-width: 90%;
  margin: 0 auto;
}

.centered-form {
  max-width: 400px;
  margin: 0 auto;
}

.centered-table {
  max-width: 600px;
  margin: 0 auto;
}

.text-muted {
  text-align: left;
}

.table-plain tbody tr,
.table-plain tbody td,
.table-plain thead tr,
.table-plain thead th {
  background-color: white;
  border: none;
}

.table-plain tbody td,
.table-plain thead th {
  text-align: left;
}

.table-plain {
  margin: 0 auto;
}

.spaced-buttons {
  margin-right: 10px;
  margin-left: 10px;
}

.no-hover:hover {
  background-color: #eef4fb !important;
  color: #0069d9 !important;
  border-color: #0069d9 !important;
}

.card-link {
  position: relative;
  z-index: 2 !important;
  color: #6c757d !important;
}

.card-link:hover {
  color: #343a40 !important;
}

.createNew {
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>
