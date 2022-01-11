<template>
  <header class="header">
    <nav class="header__navbar">
      <transition name="slide-fade">
        <a href="#" class="header__link">
          <!-- Header Navigation Menu Icons -->
          <button class="header--button" v-if="show" key="on">
            <b-icon icon="x" class="header--icon"></b-icon>
          </button>
          <button
            class="header--button"
            v-else
            key="off"
            @click.stop="show = true"
          >
            <b-icon icon="justify" class="header--icon"></b-icon>
          </button> </a
      ></transition>
      <!-- Dropdown Menu -->
      <transition name="dropdown">
        <ul class="dropdown__menu" v-bind:class="{ active: show }" v-if="show">
          <li
            class="dropdown__menu-item"
            v-for="item in navlist"
            v-bind:key="item.id"
          >
            <template v-if="item.children">
              <a
                class="dropdown__menu-link"
                :title="item.title"
                href="#"
                @click.stop="
                  (item.isOpen = !item.isOpen), closeOpenDropdown(item.id)
                "
              >
                <b-icon :icon="item.icon" class="dropdown__menu-icon"></b-icon>
                {{ item.title }}
              </a>
              <ul :class="{ isOpen: item.isOpen }" class="dropdown">
                <li v-for="{ url, name, index } in item.children" :key="index">
                  <router-link class="inner-dropdown__menu-link" :to="url">
                    {{ name }}
                  </router-link>
                </li>
              </ul>
            </template>
            <template v-else>
              <router-link
                :to="item.url"
                class="dropdown__menu-link"
                :title="item.title"
              >
                <b-icon :icon="item.icon" class="dropdown__menu-icon"></b-icon>
                {{ item.title }}
              </router-link>
            </template>
          </li>
          <li class="dropdown__menu-item" @click="logout">
            <a href="#" class="dropdown__menu-link" title="Logout">
              <b-icon icon="power" class="dropdown__menu-icon"></b-icon>
              Logout
            </a>
          </li>
        </ul>
      </transition>
    </nav>
  </header>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "Navbar",
  data() {
    return {
      show: false,
      gestioneProfilo: {
        children: [
          { name: "Modifica Profilo", url: "/modificaProfilo" },
          { name: "Cambia Password", url: "/cambiaPassword" }
        ],
        icon: "person-square",
        id: 0,
        title: "Gestione Profilo",
        isOpen: false
      },
      uploadersStats: {
        icon: "graph-up",
        id: 1,
        title: "Statistiche Uploaders",
        url: "/administrator/uploadersStats"
      },
      gestioneAmministratori: {
        children: [
          {
            name: "Tutti gli Amministratori",
            url: "/administrator/listaAmministratori"
          },
          {
            name: "Crea Amministratore",
            url: "/administrator/creaAmministratore"
          },
          {
            name: "Modifica Dati Amministratore",
            url: "/administrator/modificaAmministratore"
          }
        ],
        icon: "person-check-fill",
        id: 2,
        title: "Gestione Amministratori",
        isOpen: false
      },
      gestioneUploaders: {
        children: [
          { name: "Tutti gli Uploaders", url: "/administrator/listaUploaders" },
          { name: "Crea Uploader", url: "/administrator/creaUploader" },
          {
            name: "Modifica Dati Uploader",
            url: "/administrator/modificaUploader"
          }
        ],
        icon: "person-lines-fill",
        id: 3,
        title: "Gestione Uploaders",
        isOpen: false
      },
      fileConsumers: {
        icon: "file-text",
        id: 1,
        title: "I miei Files",
        url: "/consumer/files"
      },
      fileUpload: {
        icon: "upload",
        id: 1,
        title: "Carica File",
        url: "/uploader/caricaFile"
      },
      gestioneConsumers: {
        children: [
          { name: "Tutti i Consumers", url: "/uploader/home" },
          { name: "Crea Consumer", url: "/uploader/creaConsumer" },
          {
            name: "Modifica Dati Consumer",
            url: "/uploader/modificaConsumer"
          }
        ],
        icon: "people",
        id: 2,
        title: "Gestione Consumers",
        isOpen: false
      }
    };
  },
  methods: {
    ...mapActions("account", ["logout"]),
    closeOpenDropdown(id = -1) {
      if (id === -1) {
        this.show = false;
      }
      this.navlist.forEach(item => {
        if (item.children && item.id !== id) {
          item.isOpen = false;
        }
      });
    }
  },
  computed: {
    ...mapState({
      account: state => state.account
    }),
    navlist: function() {
      let n = [];
      if (this.account.user) {
        n.push(this.gestioneProfilo);
        if (this.account.user.role === "administrator") {
          n.push(this.uploadersStats);
          n.push(this.gestioneAmministratori);
          n.push(this.gestioneUploaders);
        } else if (this.account.user.role === "uploader") {
          n.push(this.fileUpload);
          n.push(this.gestioneConsumers);
        } else if (this.account.user.role === "consumer") {
          n.push(this.fileConsumers);
        }
      }
      return n;
    }
  }
};
</script>

<style>
:root {
  --font-primary: "Open Sans", sans-serif;
  --color-gray: #dadce0;
}

.header {
  padding: 2rem 5rem 2rem 5rem;
}

.header__nav {
  position: relative;
}

.header__navbar {
  position: relative;
  display: -webkit-box;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: end;
  justify-content: flex-end;
}

.header--icon {
  width: 1.65rem;
  height: 1.65rem;
}

.header--button {
  top: 0;
  right: 0;
  position: absolute;
  margin: 0;
  padding: 0;
  color: gray;
  cursor: pointer;
  border: 1px solid transparent;
  background-color: transparent;
}
.header--button:focus {
  outline: 0;
}

.dropdown__menu {
  top: 100%;
  right: 0;
  position: absolute;
  z-index: 10;
  max-height: 25rem;
  min-width: 300px;
  margin-top: 2rem;
  overflow-y: auto;
  padding: 0rem 0rem 0rem 0rem;
  border-radius: 12px;
  background-color: white;
  border: 1px solid var(--color-gray);
  background-clip: padding-box;
}
.dropdown__menu-link {
  display: -webkit-box;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: start;
  justify-content: flex-start;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.6);
  padding: 1.5rem 0 1.5rem 2rem;
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
  border-radius: 0 50px 50px 0;
}
.dropdown__menu-link:hover {
  text-decoration: none;
  color: rgba(255, 255, 255, 1);
  background-color: rgba(0, 123, 255, 0.7);
}
.dropdown__menu-icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 1.5rem;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  -webkit-transition: all 0.6s;
  transition: all 0.6s;
}

.slide-fade-enter,
.slide-fade-leave-active {
  opacity: 0;
}

.slide-fade-enter {
  -webkit-transform: translateX(31px);
  transform: translateX(31px);
}

.slide-fade-leave-active {
  -webkit-transform: translateX(-31px);
  transform: translateX(-31px);
}

.dropdown-enter-active,
.dropdown-leave-active {
  -webkit-transition: all 1s;
  transition: all 1s;
}

.dropdown-enter,
.dropdown-leave-to {
  opacity: 0;
  -webkit-transform: translateY(30px);
  transform: translateY(30px);
}

.dropdown {
  display: none;
  top: 100%;
  right: 0;
  z-index: 10;
  max-height: 25rem;
  overflow-y: auto;
  padding: 0rem 0rem 0rem 0rem;
  background-color: white;
  background-clip: padding-box;
}

.dropdown.isOpen {
  display: block;
}

.inner-dropdown__menu-link {
  display: -webkit-box;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: start;
  justify-content: flex-start;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.6);
  padding: 0.9rem 0 0.9rem 2rem;
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
  border-radius: 0 50px 50px 0;
  font-weight: 300;
  margin-left: 1rem;
  margin-right: 1rem;
  font-size: 0.9rem;
}
.inner-dropdown__menu-link:hover {
  text-decoration: none;
  color: rgba(255, 255, 255, 1);
  background-color: rgba(0, 123, 255, 0.5);
}
</style>
