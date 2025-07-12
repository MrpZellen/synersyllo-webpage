<template>
  <div v-if="!props.isInBG" class="flex w-full min-h-dvh justify-center w-100 border-2 border-black p-2">
    <div class="grid grid-cols-{{ daysPerWeek }} gap-4 w-full min-h-full" v-for="(day, index) in dayCounted">
      <calendar-col @send-to-back="retrieveBackData" :day-count="daysPerWeek" class="h-full" :day="day" :key="index"/>
    </div>
  </div>
  <div v-else>
    <div class="flex w-full min-h-dvh justify-center w-100 border-2 border-black p-2 blur-xs">
    <div class="grid grid-cols-{{ daysPerWeek }} gap-4 w-full min-h-full" v-for="(day, index) in dayCounted">
      <calendar-col @send-to-back="retrieveBackData" :day-count="daysPerWeek" class="h-full" :day="day" :key="index"/>
    </div>
  </div>
  </div>
</template>

<script lang="ts" setup>

  const props = defineProps<{
    titleOfCalendar: string,
    themeColor: string,
    userEmail: string,
    daysPerWeek: number,
    isInBG: boolean
  }>();
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