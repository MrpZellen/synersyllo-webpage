<template>
  <head>
      <title>SynerSyllo</title>
  </head>
  <div class="flex flex-col min-h-screen">
    <header>
      <div class="flex flex-row justify-around items-center m-3">
        <div class="p-3" @click="home">Worlds Laziest Nav</div>
        <div class="p-3" v-if="!isLoggedIn" @click="logIn">Login</div>
        <div class="p-3" v-if="isLoggedIn" @click="logOut">Logout</div>
        <div class="p-3" v-if="!isLoggedIn" @click="register">Register</div>
      </div>
    </header>
    <main class="flex-grow">
      <NuxtPage />
    </main>
    <footer class="footer sm:footer-horizontal bg-blue-100 text-neutral-content p-10 mt-10">
      <small>
        &copy;BENJAMIN NATHAN LEONARD 2025
      </small>
    </footer>
  </div>
</template>

<script setup lang="ts">
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
</script>