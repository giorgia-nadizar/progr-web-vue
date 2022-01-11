<template>
  <main>
    <h1>I miei File</h1>
    <b-card-group deck class="vertical-cards" v-if="uploaders.length">
      <b-card
        class="card"
        v-for="uploader in uploaders"
        :key="uploader.username"
      >
        <router-link
          :to="{
            name: 'File',
            params: {
              logo: uploader.logo,
              uploader: uploader.username,
              name: uploader.nomeCognome,
              email: uploader.email
            }
          }"
          class="stretched-link"
        ></router-link>
        <b-row>
          <b-col md="auto">
            <b-avatar rounded="lg" size="7em" :src="uploader.logo"></b-avatar>
          </b-col>
          <b-col>
            <b-card-body :title="uploader.nomeCognome" align="left">
              <a
                :href="`mailto:${uploader.email}`"
                class="card-link"
                @mouseover="animateEmail(uploader.username)"
                @mouseout="stopAnimation(uploader.username)"
              >
                <b-icon
                  icon="envelope"
                  :animation="uploader.emailAnimation"
                  shift-h="-4"
                ></b-icon
                >{{ uploader.email }}</a
              >
            </b-card-body>
          </b-col>
        </b-row>
      </b-card>
    </b-card-group>
    <p v-else>Non ci sono file da scaricare.</p>
  </main>
</template>

<script>
import { mapActions } from "vuex";
import { FileHelper } from "../helpers/FileHelper";
import router from "../router";
export default {
  data() {
    return {
      uploaders: []
    };
  },
  methods: {
    ...mapActions("account", ["logout"]),
    ...mapActions("alert", ["success", "error"]),
    animateEmail(username) {
      this.uploaders.find(x => x.username === username).emailAnimation =
        "throb";
    },
    stopAnimation(username) {
      this.uploaders.find(x => x.username === username).emailAnimation = null;
    }
  },
  created: function() {
    FileHelper.getUploaders()
      .then(res => {
        if (res.data.length === 1) {
          router.push({
            name: "File",
            params: {
              logo: res.data[0].logo,
              uploader: res.data[0].username,
              name: res.data[0].nomeCognome,
              email: res.data[0].email
            }
          });
        }
        res.data.forEach(function(uploader) {
          uploader.emailAnimation = null;
        });
        this.uploaders = res.data;
      })
      .catch(() => {
        this.error("Impossibile proseguire sulla pagina richiesta");
        this.logout();
      });
  }
};
</script>

<style scoped>
.vertical-cards {
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin: 0 auto;
}

.card:hover {
  color: #495057;
  background-color: #fff;
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
</style>
