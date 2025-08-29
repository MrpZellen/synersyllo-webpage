<template>
  <head>
      <title>SynerSyllo</title>
  </head>
  <div class="flex flex-col min-h-screen">
    <div v-if="!isLoading" class="flex flex-col flex-grow bg-blue-200">
    <header>
      <div class="flex flex-row justify-around items-center">
        <div class="p-3 justify-items-center" @click="home">
        <img src="/Logo.ico" class="w-15 h-15" /> <div class="transition delay-50 duration-200 ease-in-out hover:scale-130 hover:text-synsyl-lightblue font-bold text-lg font-bold">SynerSyllo</div> <span class="text-lg" v-if="isAdmin"> - Admin Signin</span> </div>
        <div class="transition delay-50 duration-200 ease-in-out hover:scale-130 hover:text-synsyl-lightblue font-bold" v-if="isLoggedIn" @click="myCalendar">My Calendar</div>
        <div class="transition delay-50 duration-200 ease-in-out hover:scale-130 hover:text-synsyl-lightblue font-bold" v-if="!isLoggedIn" @click="logIn">Login</div>
        <div class="transition delay-50 duration-200 ease-in-out hover:scale-130 hover:text-synsyl-lightblue font-bold" v-if="!isLoggedIn" @click="register">Register</div>
        <div class="transition delay-50 duration-200 ease-in-out hover:scale-130 hover:text-synsyl-lightblue font-bold" v-if="isAdmin === true" @click="groups">Manage Company Groups</div>
        <div class="transition delay-50 duration-200 ease-in-out hover:scale-130 hover:text-synsyl-lightblue font-bold" v-if="isLoggedIn && cid" @click="userGroups">View Your Groups</div>
        <div class="transition delay-50 duration-200 ease-in-out hover:scale-130 hover:text-synsyl-lightblue font-bold" v-if="isLoggedIn" @click="logOut">Logout</div>
        <div v-if="isLoggedIn" class="flex flex-end m-3" @click="userSettings"><img class="rounded-full border-5 border-transparent transition delay-50 duration-200 ease-in-out hover:scale-110 hover:border-blue-300 w-15 h-15" :src="photo" /></div>
      </div>
    </header>
    <main class="flex flex-grow bg-blue-100">
      <NuxtPage/>
    </main>
    <footer class="footer sm:footer-horizontal bg-blue-200 text-neutral-content p-10">
      <small>
        &copy;BENJAMIN NATHAN LEONARD 2025
      </small>
    </footer>
  </div>
  </div>
</template>

<script setup lang="ts">
//computes and returns a reactive object when the cookie changes
const isLoggedIn = ref(false)
const isAdmin = ref(false)
const username = ref('')
const cid = ref('')
const photo = ref('')

const isLoading = ref(true)

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
const userSettings = () => {
  navigateTo(`/userSettings/${username.value}`)
}
const myCalendar = () => {
  navigateTo(`/calendar/${username.value}`)
}

const groups = () => {
  navigateTo({path: `/groups/${cid.value}`, query: { username: username.value }})
}
const userGroups = () => {
  navigateTo({path: `/groups/user/${username.value}`})
}

onMounted(async () => {
  const res = await $fetch<{ isLoggedIn: boolean, isAdmin: boolean, cid: string, username: string, photo: string }>('/api/checkLoginStatus')
  isLoggedIn.value = res.isLoggedIn
  isAdmin.value = res.isAdmin
  username.value = res.username
  photo.value = res.photo
  cid.value = String(res.cid)
  console.log('CHECKiNGLOGPROG', 'is logged in: ', res.isLoggedIn, 'Is admin: ', res.isAdmin, 'is cid', res.cid, 'is photo', res.photo)
  isLoading.value = false
})
</script>