<template>
  <div id="app">
    <mt-search
                v-model="value"
               :placeholder="$t('system.searchInputPlaceholderText')"
               :cancel-text="$t('system.cancelButtonText')"></mt-search>
  </div>
</template>

<script>

export default {
  name: 'App',
  data:function () {
    return{
      value:'11111111'
    }
  },
  components: {
  }
}
</script>

<style>
</style>
