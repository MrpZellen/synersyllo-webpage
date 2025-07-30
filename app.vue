<template>
  <head>
      <title>SynerSyllo</title>
  </head>
  <div class="flex flex-col min-h-screen">
    <header>
      <div class="flex flex-row justify-around items-center bg-blue-100">
        <div class="p-3 justify-items-center" @click="home">
        <img src="/Logo.ico" class="w-15 h-15" /> <div class="text-lg font-bold">SynerSyllo</div> <span class="text-lg" v-if="isAdmin"> - Admin Signin</span> </div>
        <div class="menuText" v-if="!isLoggedIn" @click="logIn">Login</div>
        <div class="menuText" v-if="isLoggedIn" @click="logOut">Logout</div>
        <div class="menuText" v-if="!isLoggedIn" @click="register">Register</div>
        <div class="menuText" v-if="isAdmin && cid" @click="groups">Manage Groups</div>
        <div class="menuText" v-if="isAdmin && cid" @click="roles">Manage Roles</div>
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
const isAdmin = ref(false)
const username = ref('')
const cid = ref('')

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

const groups = () => {
  navigateTo({path: `/groups/${cid.value}`, query: { username: username.value }})
}
const roles = () => {
  navigateTo(`/roles/${cid.value}`)
}

onMounted(async () => {
  const res = await $fetch<{ isLoggedIn: boolean, isAdmin: boolean, cid: string, username: string }>('/api/checkLoginStatus')
  isLoggedIn.value = res.isLoggedIn
  isAdmin.value = res.isAdmin
  username.value = res.username
  cid.value = String(res.cid)
  console.log('is logged in: ', res.isLoggedIn, 'Is admin: ', res.isAdmin, 'is cid', res.cid)
})
</script>