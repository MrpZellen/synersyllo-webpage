<template>
  <head>
      <title>SynerSyllo</title>
  </head>
  <div class="flex flex-col min-h-screen">
    <header>
      <div class="flex flex-row justify-around items-center bg-blue-100">
        <div class="p-3 justify-items-center" @click="home">
        <img src="/Logo.ico" class="w-15 h-15" /> <div class="text-lg font-bold">SynerSyllo</div> </div>
        <div class="p-3" v-if="!isLoggedIn" @click="logIn">Login</div>
        <div class="p-3" v-if="isLoggedIn" @click="logOut">Logout</div>
        <div class="p-3" v-if="!isLoggedIn" @click="register">Register</div>
      </div>
    </header>
    <main class="flex-grow">
      <NuxtPage/>
    </main>
    <footer class="footer sm:footer-horizontal bg-blue-100 text-neutral-content p-10 mt-10">
      <small>
        &copy;BENJAMIN NATHAN LEONARD 2025
      </small>
    </footer>
  </div>
</template>

<script setup lang="ts">
//computes and returns a reactive object when the cookie changes
const isLoggedIn = ref(false)

//NAV STUFF
const home = () => {
  navigateTo('/')
}

const logIn = () => {
  navigateTo('/login')
}

const logOut = () => {
  navigateTo('/logout')
}

const register = () => {
  navigateTo('/register')
}

onMounted(async () => {
  const res = await $fetch<{ loggedIn: boolean }>('/api/checkLoginStatus')
  isLoggedIn.value = res.loggedIn
  console.log(res.loggedIn)
})
</script>