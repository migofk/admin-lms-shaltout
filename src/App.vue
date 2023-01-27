<template>
  <router-view />
</template>

<script>
export default {
  mounted() {
    this.$store.commit('initialiseStore')
  },
}
</script>
<style lang="scss">
// Import Main styles for this application
@import 'styles/style';
</style>
