<template>
  <b-form-group
    label="Hashtag"
    label-align="left"
    description="I tag possono essere immessi con o senza il carattere # in testa"
  >
    <vue-tags-input
      v-model="tag"
      :tags="tags"
      :allow-edit-tags="true"
      :add-on-key="[' ']"
      :separators="[';', '#', ',', ' ']"
      :validation="[validate]"
      placeholder=""
      @tags-changed="changeTags"
    />
  </b-form-group>
</template>

<script>
import VueTagsInput from "@johmun/vue-tags-input";

export default {
  components: {
    VueTagsInput,
  },
  data() {
    return {
      tag: "",
      tags: [],
      validate: {
        classes: "hashtagPattern",
        rule: /(^$)|(^\w+$)|(#\w+$)|(#$)/,
        disableAdd: true,
      },
    };
  },
  methods: {
    clear() {
      this.tag = "";
      this.tags = [];
    },
    changeTags(newTags) {
      this.tags = newTags;
      this.$emit(
        "setHashtags",
        this.tags.map((tag) => tag.text)
      );
    },
  },
};
</script>

<style>
.ti-input {
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5rem;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da !important;
  border-radius: 0.25rem;
}

.ti-input:focus-within {
  color: #495057;
  background-color: #fff;
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* il tag che sto scrivendo ora */
.ti-new-tag-input {
  font-size: 1rem;
  color: #495057;
}

.ti-tags {
  line-height: 1.5rem;
}

.ti-tag.ti-valid {
  font-size: 1rem;
  color: white;
  background: #4da3ff;
}

.ti-new-tag-input.ti-invalid {
  color: red;
}
</style>
