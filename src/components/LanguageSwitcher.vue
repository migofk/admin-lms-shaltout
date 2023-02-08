<template>
  <!-- eslint-disable -->
  <div style="max-width:70px"  >
    <select 
      class="form-select"
      @change="onChange($event)" 
      v-model="$i18n.locale"
     >
        <option v-for="(lang, i) in langs" 
          :key="`Lang${i}`" 
          :value="lang"
        >
          {{ lang }}
        </option>
    </select>
  </div>
</template>

<script>
/* eslint-disable */ 
export default {
  name: 'LanguageSwitcher',
  data () {
    return { 
      langs: this.$store.state.languages
    }
  },
  methods: {
        onChange(event) {
            this.$store.commit('saveLocalization',event.target.value);
        }
    },
}
</script>
