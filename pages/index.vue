<template>  
<div class="flex flex-grow justify-center items-center space-y-4 space-x-4 flex-col">
  <div class="text-2xl p-5 font-bold">Testing Connection: {{ result }}</div>
  <button @click="runAuth" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold" >Test Functionality</button>
</div>
</template>
<script setup lang="ts">
//variables
const { data: result } = await useFetch('/api/test')


const clientId = encodeURIComponent('431685922807-87m61aqc8qliu36erdppeuat8ir0unqc.apps.googleusercontent.com')
const redirectUri = encodeURIComponent('http://localhost:3000/api/redirectAuth')
const scope = encodeURIComponent('https://www.googleapis.com/auth/calendar.readonly')
const runAuth = () => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=${scope}&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`
  console.log({ clientId, redirectUri, scope, url })
  window.location.href = url
}


</script>