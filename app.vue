<template>  
<div class="h-full flex flex-grow justify-center items-center space-y-4 space-x-4 flex-col">
  <h1 class="text-3xl font-bold underline p-3">Welcome to SynerSyllo!</h1>
  <div class="text-xl p-3">We hope you enjoy the site!</div>
  <div class="text-2xl p-5 font-bold">Testing Connection: {{ result }}</div>
</div>
</template>
<script setup lang="ts">
//variables
const { data: result } = await useFetch('/api/test')
</script> 