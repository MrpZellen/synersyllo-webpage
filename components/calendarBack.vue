<template>
  <div v-if="!props.isInBG" class="flex w-full min-h-dvh justify-center w-100 border-2 border-black">
    <div class="grid h-full min-h-dvh" :style="{ gridTemplateRows: `repeat(${hoursTotal}, 1fr)` }">
      <div v-for="hour in hoursArray" :key="hour" class="flex items-center">
        <hr class="border-gray-300 border-t-2 w-full" />
      </div>
    </div>

    <div class="grid grid-cols-{{ daysPerWeek }} gap-4 w-full min-h-full" v-for="(day, index) in dayCounted">
      <calendar-col @send-to-back="retrieveBackData" :calendarTZ="calendarPref" :day-count="daysPerWeek" class="h-full" :day="day" :key="index" :recall="props.recall"/>
    </div>
  </div>
  <div v-else class="flex w-full min-h-dvh justify-center w-100 border-2 border-black">
    <div class="grid h-full min-h-dvh" :style="{ gridTemplateRows: `repeat(${hoursTotal}, 1fr)` }">
      <div v-for="hour in hoursArray" :key="hour" class="flex items-center">
        <hr class="border-gray-300 border-t-2 w-full" />
      </div>
    </div>

    <div class="flex w-full min-h-dvh justify-center w-100 border-2 border-black blur-xs">
    <div class="grid grid-cols-{{ daysPerWeek }} gap-4 w-full min-h-full" v-for="(day, index) in dayCounted">
      <calendar-col @send-to-back="retrieveBackData" :calendarTZ="calendarPref" :day-count="daysPerWeek" class="h-full" :day="day" :key="index" :recall="props.recall"/>
    </div>
  </div>
  </div>
</template>

<script lang="ts" setup>

  const props = defineProps<{
    hoursTotal: number,
    recall: boolean,
    titleOfCalendar: string,
    themeColor: string,
    userEmail: string,
    daysPerWeek: number,
    isInBG: boolean,
    calendarPref: string
  }>();
  const hoursArray = computed(() => Array.from({ length: props.hoursTotal }, (_, num) => num)) //value and num are the same, only one needed
  var dayCounted: number[] = []
  if(props.daysPerWeek == 5){
    dayCounted = [1, 2, 3, 4, 5]
  } else {
    dayCounted = [0, 1, 2, 3, 4, 5, 6]
  }
  const emitToMain = defineEmits(['emitFinal'])
  const isInBG = ref(props.isInBG)
  const retrieveBackData = (payload: any) => {
    isInBG.value = true
    emitToMain('emitFinal', payload)
    console.log('emitted full!')
  }

</script>

<style>

</style>