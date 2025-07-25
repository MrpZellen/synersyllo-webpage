<template>
  <div>
    Redirecting to logout...
  </div>
</template>

<script lang="ts" setup>
const result = await $fetch('/api/accessUser/logout')
if(result.status === 200){
  console.log('SUCCESSFUL LOGOUT! Redirecting...')
  window.location.href = '/'
} else {
  console.log('something went wrong.')
}
</script>