<template>
<div class="flex flex-grow justify-center items-center space-y-4 space-x-4 flex-col">
  <div class="flex flex-row justify-center items-center m3">
      <div>Worlds Laziest Nav</div>
      <div v-if="!isLoggedIn">Login</div>
      <div v-if="isLoggedIn">Logout</div>
      <div v-if="!isLoggedIn">Register</div>
  </div>
  <div class="text-2xl p-5 font-bold">Testing Connection: {{ result }}</div>
  <div>Hey there! Welcome to Synersyllo</div>
  <button @click="navToAuth" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold" >Go to Auth</button>
</div>
</template>
<script setup lang="ts">
//variables
const { data: result } = await useFetch('/api/test')
const isLoggedIn = ref(false)

const navToAuth = async () => {
  await navigateTo('/userAuth')
}

</script>