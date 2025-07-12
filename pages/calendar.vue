<template>
    <div>Yay! We are authorized!!!</div>
    <button v-if="isInBG == false" @click="addEvent" class="px-4 py-2 m-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold" >Make A New Event</button>
    <div class="w-full">
    <div v-if="isInBG == true">
    <div class="absolute z-50 p-5 top-1/3 left-1/3 w-[400px] h-[250px] rounded-sm bg-blue-300 border-2 border-black shadow-lg">
      <div class="text-xl font-bold p-2">{{ popOutValues.eventTitle }}</div>
      <div class="text-lg bg-white rounded-sm p-2">{{ popOutValues.eventDesc }}</div>
      <div class="text-md flex justify-end p-1 text-end">{{ startHourCalc }} - {{ endHourCalc }}</div>
      <div class="flex flex-row">
        <button @click="back" class="m-1 px-4 py-2 bg-sky-100 rounded hover:bg-sky-300 hover:border-black border-2 border-transparent font-bold">Back</button>
        <button @click="removeEvent" class="m-1 px-4 py-2 bg-sky-100 rounded hover:bg-sky-300 hover:border-black border-2 border-transparent font-bold">Remove Event</button>
      </div>
    </div>
    </div>
    <calendar-back @emit-final="retrieveBackData" :isInBG="isInBG" :title-of-calendar="items.titleOfCalendar" :theme-color="items.themeColor" :user-email="items.userEmail" :days-per-week="7"/>
  </div>
</template>

<script setup lang="ts">
// a little confusing, bgInBG goes back to calendarBack
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

const popOutValues = ref({
      eventTitle: String,
      eventDesc: String,
      startHour: Number,
      endHour: Number
  })
  var startHourCalc = '0 PM'
  var endHourCalc = '1 PM'

//change state on bg render
  const isInBG = ref(false)

  const retrieveBackData = (payload: any) => {
    isInBG.value = true
    popOutValues.value = payload
    startHourCalc = calcResult(payload.startHour)
    endHourCalc = calcResult(payload.endHour)
    console.log('emitted full!')
  }


  const calcResult = (hour: number) => {
    var min = ((hour - Math.floor(hour))*60).toString()
    if(min == '0'){
      min = '00'
    }
    if(hour < 12 && hour != 0){
      return hour + ':'+ min + ' AM'
    } else if (hour > 12) {
      return hour%12 + ':'+ min + ' PM'
    } else if(hour == 12) {
      return hour + ':'+ min + ' PM'
    } else {
      return '12 AM'
    }
  }

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

const back = () => {
  isInBG.value = false
}

//ADD EVENT

//REMOVE EVENT

</script>