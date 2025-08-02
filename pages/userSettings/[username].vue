<template>
  <div v-if="!isLoading">
  <div v-if="!isValidLogin" class="text-red-500 flex flex-grow place-content-center items-center">
    <div class="text-start p-7 font-bold text-4xl flex flex-col">Sorry but you cannot access this page.
    <div class="text-start font-bold text-4xl"> This is due to one of the following: </div>
      <div class="text-start p-7 font-bold text-2xl"> - Wrong CID or User. </div>      
      <div class="text-start p-7 font-bold text-2xl"> - You are not logged in. </div>
      <div class="text-start p-7 font-bold text-2xl"> - You are not permitted to view this page. </div>
    </div>
    
  </div>
  <div v-if="isValidLogin" class="flex flex-grow place-content-center flex-col">
    <div class="text-center ps-7 pb-1 pt-7 font-bold text-4xl text-emerald-900">SETTINGS FOR {{ user.toString().toUpperCase() }}:</div>
    <hr class="ml-5 border-2 w-full text-darkfunk"></hr>
    <div class="p-5 rounded-lg m-4">
      <div class="ps-4 pb-1 font-bold text-2xl text-synsyl-darkgreen">Time Preferences: </div>
      <hr class="ml-5 border-2 w-2/3 text-darkfunk"></hr>
      <div class="p-2 ml-5 font-bold text-synsyl-darkgreen">
        <div>
          Timezone:
          <v-select v-model="settings.timezone" class="bg-white rounded-md m-2 p-2" :options="TZoptions" ></v-select>
        </div>
      </div>
    </div>
  </div>
  <div class="m-5 place-content-center items-center">
    <button
    @click="settingUpdate"
    class="px-4 content-center w-1/2 py-2 m-3 bg-funkygreen text-white rounded hover:bg-darkfunk font-bold"
  >Update Settings
  </button>
  </div>
  </div>
</template>

<script lang="ts" setup>
import type { Calendar } from '~/models/Calendar'
import { TZoptions } from '~/models/TZoptions'
const router = useRoute()
const user =  router.params.username

const isLoggedIn = ref(false)
const username = ref('')
const CID = ref('')
const isLoading = ref(true)

const isValidLogin = ref(false)

const settings = ref<{
  timezone: string,
  colorScheme: string,
  calendarName: string,
  calendarID: string
}>({
  timezone: 'UTC',
  colorScheme: 'light',
  calendarName: '',
  calendarID: 'primary'
});

const settingUpdate = async () => {
  console.log(settings.value)
  const result = await $fetch<{ calendars: Calendar, error: Error }>(`/api/settings/updateSettings`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      settings: {
        timezone: settings.value.timezone,
        colorSchema: settings.value.colorScheme,
        calendarName: settings.value.calendarName,
        calendarID: settings.value.calendarID
      }
    }
  }).then((result) => {
    if(!result.calendars){
      console.error('not updated!')
      //error page handling
      console.log(result.error)
    } else {
      //redirect
      console.log('settings updated!')
      navigateTo('/')
    }
  })
}

const getCalendar = async () => {
  const result = await $fetch<{ calendars: Calendar, error: any }>(`/api/events/getCalendar`, {
    credentials: 'include'
  }).then((result) => {
    if(!result.calendars){
      console.error('not signed in!')
      console.error(result.error)
      //error page handling
    }
    settings.value.timezone = result.calendars.timeZone
    settings.value.colorScheme = result.calendars.foregroundColor
    settings.value.calendarName = result.calendars.summary
    settings.value.calendarID = result.calendars.id
  })
}

onMounted(async () => {
  const res = await $fetch<{ isLoggedIn: boolean, cid: string, username: string }>('/api/checkLoginStatus')
  isLoggedIn.value = res.isLoggedIn
  username.value = res.username
  CID.value = res.cid
  console.log('is logged in: ', res.isLoggedIn)
  if (!isLoggedIn || username.value !== user){
    console.log('login: ', isLoggedIn, ' user values: ', username.value, user)
    isValidLogin.value = false
  } else {
    isValidLogin.value = true
  }
  await getCalendar()
  isLoading.value = false
  })
</script>

<style>

</style>