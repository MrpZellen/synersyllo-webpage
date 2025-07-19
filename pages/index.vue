<template>
<div class="flex flex-grow justify-center items-center space-y-4 space-x-4 flex-col">
  <div>Hey there! Welcome to Synersyllo</div>
  <button @click="navToAuth" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold" >Go to Auth</button>
</div>
</template>
<script setup lang="ts">
//variables

const navToAuth = async () => {
  await navigateTo('/userAuth')
}
</script>