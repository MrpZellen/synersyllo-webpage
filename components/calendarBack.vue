<template>
  <div class="flex w-full min-h-dvh justify-center w-100 border-2 border-black p-2">
    <div v-if="daysPerWeek == 5" class="grid grid-cols-5 gap-4 w-full min-h-full">
      <calendar-col :day-count="daysPerWeek" class="h-full" :day="1" :event-info="eventInfo" />
      <calendar-col :day-count="daysPerWeek" class="h-full" :day="2" :event-info="eventInfo" />
      <calendar-col :day-count="daysPerWeek" class="h-full" :day="3" :event-info="eventInfo" />
      <calendar-col :day-count="daysPerWeek" class="h-full" :day="4" :event-info="eventInfo" />
      <calendar-col :day-count="daysPerWeek" class="h-full" :day="5" :event-info="eventInfo" />
    </div>
    <div v-else class="grid grid-cols-7 gap-2 w-full min-h-full">
      <calendar-col :day-count="daysPerWeek"class="h-full" :day="0" :event-info="eventInfo" />
      <calendar-col :day-count="daysPerWeek" class="h-full" :day="1" :event-info="eventInfo" />
      <calendar-col :day-count="daysPerWeek" class="h-full" :day="2" :event-info="eventInfo" />
      <calendar-col :day-count="daysPerWeek" class="h-full" :day="3" :event-info="eventInfo" />
      <calendar-col :day-count="daysPerWeek" class="h-full" :day="4" :event-info="eventInfo" />
      <calendar-col :day-count="daysPerWeek" class="h-full" :day="5" :event-info="eventInfo" />
      <calendar-col :day-count="daysPerWeek" class="h-full" :day="6" :event-info="eventInfo" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    titleOfCalendar: string,
    themeColor: string,
    userEmail: string,
    daysPerWeek: number
  }>();
  var eventInfo: any;
  const getEventInfo = async () => {
    const result = await $fetch('/api/events')
    eventInfo.results = result
  }
  getEventInfo()
</script>

<style>

</style>