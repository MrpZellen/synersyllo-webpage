<template>
<div class="flex flex-grow justify-center items-center space-y-4 space-x-4 flex-col">
  <div class="text-center p-7 font-bold text-6xl">Welcome to <img class="p-4" width="100%" src="/assets/icon-png/longo.png"/></div>
  <div>Are you new? Sign your company up here! <button @click="signUpCompany"
            class="m-1 px-4 py-2 bg-sky-100 rounded hover:bg-sky-300 hover:border-black border-2 border-transparent font-bold"
          >Create Company</button></div>
</div>
</template>
<script setup lang="ts">
//variables
var myCookie = useCookie('google_tokens').value

const navToAuth = async () => {
  await navigateTo('/userAuth')
}

const signUpCompany = async () => {
  await navigateTo('/newCompany')
}

const emitRes = defineEmits(['sendLoginUpdate'])
onMounted(async (event: any) => {
  emitRes('sendLoginUpdate', (myCookie ? true : false))
});
</script>