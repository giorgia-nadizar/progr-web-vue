<template>
  <main>
    <h1>Statistiche degli Uploader</h1>
    <p v-if="!stats.length">Non ci sono uploaders</p>
    <date-range-picker
      v-if="stats.length"
      ref="picker"
      date-util="moment"
      :locale-data="localdate"
      :autoApply="true"
      v-model="dateRange"
    >
    </date-range-picker>
    <b-table
      v-if="stats.length"
      striped
      outlined
      hover
      fixed
      stacked="md"
      :items="stats"
      :fields="fields"
      :busy="loading"
      head-variant="dark"
      class="centered-table"
    >
      <template v-slot:table-busy>
        <div class="text-center my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Caricamento...</strong>
        </div>
      </template></b-table
    >
  </main>
</template>

<script>
import * as moment from "moment/moment";
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
import { FileHelper } from "../helpers/FileHelper";
import { mapActions } from "vuex";

export default {
  components: { DateRangePicker },
  data() {
    return {
      loading: null,
      dateRange: {
        startDate: moment().subtract(1, "months"),
        endDate: moment()
      },
      localdate: {
        direction: "ltr",
        format: "DD/MM/YYYY",
        separator: " - ",
        applyLabel: "Conferma",
        cancelLabel: "Annulla",
        daysOfWeek: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
        monthNames: [
          "Gen",
          "Feb",
          "Mar",
          "Apr",
          "Mag",
          "Giu",
          "Lug",
          "Ago",
          "Set",
          "Ott",
          "Nov",
          "Dic"
        ],
        firstDay: 1
      },
      stats: [],
      fields: ["uploader", "numeroFile", "numeroConsumers"]
    };
  },
  methods: {
    ...mapActions("alert", ["success", "error"]),
    ...mapActions("account", ["logout"]),
    fetchStats() {
      this.loading = true;
      FileHelper.uploaderStats(
        moment(this.dateRange.startDate).format("DD-MM-YYYY"),
        moment(this.dateRange.endDate).format("DD-MM-YYYY")
      )
        .then(res => {
          this.stats = res.data;
          this.loading = false;
        })
        .catch(() => {
          this.error("Impossibile proseguire sulla pagina richiesta");
          this.logout();
        });
    }
  },
  mounted: function() {
    this.fetchStats();
  },
  watch: {
    dateRange: function() {
      this.fetchStats();
    }
  }
};
</script>
