<template>
<div class="flex flex-grow justify-center items-center space-y-4 space-x-4 flex-col">
  <div>Hey there! Welcome to Synersyllo</div>
  <div>Are you new? Sign your company up here! <button @click="signUpCompany"
            class="m-1 px-4 py-2 bg-sky-100 rounded hover:bg-sky-300 hover:border-black border-2 border-transparent font-bold"
          >Create Company</button></div>
</div>
</template>
<script setup lang="ts">
//variables

const navToAuth = async () => {
  await navigateTo('/userAuth')
}

const signUpCompany = async () => {
  await navigateTo('/newCompany')
}
</script>