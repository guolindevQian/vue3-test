<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
console.log(route.meta)
console.log(JSON.stringify(import.meta.env))
</script>
<style lang="less">
header{
  background-color: #0a1f8f;
  color: #fff;
}
</style>