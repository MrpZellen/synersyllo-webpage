<template>
    <div>Yay! We are authorized!!!</div>
    <button @click="getCalendar" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold" >Get Calendars</button>
    <button @click="getEvent" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold" >Get Events</button>
</template>

<script setup lang="ts">
const getCalendar = () => {
    navigateTo('/api/calendars')
}
const getEvent = () => {
    navigateTo('/api/events')
}

</script>