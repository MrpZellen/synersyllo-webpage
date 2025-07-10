<template>
    <div>Yay! We are authorized!!!</div>
    <button @click="getCalendar" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold" >Get Calendars</button>
    <button @click="getEvent" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold" >Get Events</button>
    <div class="w-full">
    <calendar-back :title-of-calendar="items.titleOfCalendar" :theme-color="items.themeColor" :user-email="items.userEmail" :days-per-week="7"/>
  </div>
</template>

<script setup lang="ts">
const getCalendar = () => {
    navigateTo('/api/calendars')
}
const getEvent = () => {
    navigateTo('/api/events')
}
//NEW CONCEPT: a reactive allows it to be changed post build
const items = reactive({
  titleOfCalendar: '',
  themeColor: '',
  userEmail: '',
  daysPerWeek: 7
})
const buildCalendar = async () => {
    const result = await $fetch<{
      id: string;
      summary: string;
      description?: string;
      backgroundColor: string;
    }>('/api/calendars')
    items.titleOfCalendar = result.summary
    items.themeColor = result.backgroundColor
    items.userEmail = result.id
    items.daysPerWeek = 7
}
buildCalendar();


</script>