<template>
  <div>
    
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const { data: userInfo } = await useFetch(`/api/accessUser/${route.params.userId}`)
</script>

<style>

</style>