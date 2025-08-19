<template>
  <div v-if="!props.isInBG" class="flex w-full min-h-dvh justify-center w-100 border-2 border-black bg-transparent">
    <div class="grid grid-cols-{{ daysPerWeek }} gap-4 w-full min-h-full" v-for="(day, index) in dayCounted">
      <calendar-col @send-to-back="retrieveBackData" :day-string="calculateDay(day+1).toString().substring(0, 10)" :calendarTZ="calendarPref" :day-count="daysPerWeek" class="h-full" :day="calculateDay(day)" :key="index" :recall="props.recall"/>
    </div>
  </div>
  <div v-else class="flex w-full min-h-dvh justify-center w-100 border-2 border-black bg-transparent">
    <div class="flex w-full min-h-dvh justify-center w-100 border-2 border-black blur-xs">
    <div class="grid grid-cols-{{ daysPerWeek }} gap-4 w-full min-h-full" v-for="(day, index) in dayCounted">
      <calendar-col @send-to-back="retrieveBackData" :dayString="calculateDay(day+1).toString().substring(0, 10)" :calendarTZ="calendarPref" :day-count="daysPerWeek" class="h-full" :day="calculateDay(day)" :key="index" :recall="props.recall"/>
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
    calendarPref: string,
    pageCount: number
  }>();

  const currentpage = computed(() => props.pageCount);
  const gimmeSunday = (notSunday: Date) => {
  //first, find sunday
  for(var i = notSunday.getDay(); i > 0; i--){
    notSunday.setDate(notSunday.getDate() - 1) //sends back a day.
  }
  if(notSunday.getDay() !== 0){
    console.log('DAY MATH WRONG FIX IT', notSunday.getDay())
    return notSunday
  } else {
    return notSunday
  }
 }
  const theFuturisticPagINATOR = () => {
    var dayToUseINATOR = new Date()
    //FIRST, GET SUNDAY
    const sunday = gimmeSunday(dayToUseINATOR) //turns it into the closest sunday
    const result = new Date(sunday)
    if(currentpage.value >= 0){
      for(var i = (currentpage.value); i > 0; i--){
        result.setDate(result.getDate() + props.daysPerWeek)
      }
    } else {
      for(var i = (currentpage.value); i < 0; i++){
        result.setDate(result.getDate() - props.daysPerWeek)
      }
    }
    //now we have set it to the sunday of the proper week
    return result
    }

  const calculateDay = (index: number): Date => {
    const baseDay = theFuturisticPagINATOR();
    var returnedDay = new Date(baseDay)
    for(var i = index; i > 0; i--){
      returnedDay.setDate(returnedDay.getDate() + 1)
    }
    return returnedDay
  }

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

  const dateCall = (num: number) => {
    var dayItem = 'WHA'
    switch (num) {
    case 0:
      dayItem = 'SUN'
      break;
    case 1:
      dayItem = 'MON'
      break;
    case 2:
      dayItem = 'TUE'
      break;
    case 3:
      dayItem = 'WED'
      break;
    case 4:
      dayItem = 'THU'
      break;
    case 5:
      dayItem = 'FRI'
      break;
    case 6:
      dayItem = 'SAT'
      break;
  }
  return dayItem
  }


</script>

<style>

</style>