<template>
  <div class="flex flex-col w-full h-full text-center bg-transparent border-2 border-black">
    <div class=" top-0 border-2 border-black">
    {{ dayTitle }}, (DATE HERE)
  </div>
    <div class="flex-1 relative items-stretch justify-items-stretch">
      <div v-for="(event, index) in eventList" :key="index">
        <calendar-event @open-menu="handleChildData" :hours-shown="24" :event-title="event.title" :id="event.id" :event-desc="event.desc" :event-count="dayCount" :hour="event.hour" :chunk="event.chunk"></calendar-event>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CalendarEvent } from '~/models/CalendarEvent';


 const emitResult = defineEmits(['sendToBack'])
 const props = defineProps<{
  recall: boolean
  day: number,
  dayCount: number,
  calendarTZ: string,
 }>();
const recall = ref(props.recall)

 //date calculation
 const page = 1;
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
 var currentDay = new Date()
 var dayTitle = dateCall(props.day)
 const getDateRelation = () => {
  var day = currentDay.getDay()
  var currentMD = currentDay.toDateString()
  var currentDayNum = parseInt(currentMD.substring(8, 10))
  var currentMonNum = currentMD.substring(4, 7)
  var currentYearNum = parseInt(currentMD.substring(11))
 }
 //var shownDate;
 //week and extra calendar support for future

 //handling child data
 const handleChildData = (payload: object) => {
   emitResult('sendToBack', payload)
   console.log(payload)
 }

 //handling event API info
  var eventInfo: CalendarEvent[];
  const getEventInfo = async () => {
    const result = await $fetch<{ events: CalendarEvent[] }>('/api/events/events', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({
        userSettings: {
          timezonePref: props.calendarTZ
        }
      })
    })
    console.log('OUR RESULT:', result)
    eventInfo = result.events
    validateList();
    recall.value = true
  }

 const eventList = ref<{id: string, title: string, hour: number; chunk: number, desc: string}[]>([])
 const validateList = async () => {
  console.log(eventInfo)
    if(eventInfo != null){

console.log(props.calendarTZ, 'MYTZ')
  eventInfo.forEach(element => {
     var dateString = element.start.dateTime.substring(0, 10);
     let date = new Date(dateString)
     //console.log('date string', dateString)
     //console.log('date test', date)
     //num math
     var startNumString = element.start.dateTime.substring(11, 13);
     var endNumString = element.end.dateTime.substring(11, 13);
     var startNum = parseFloat(startNumString) + (parseFloat(element.start.dateTime.substring(14,16))/60)
     var endNum = parseFloat(endNumString) + (parseFloat(element.end.dateTime.substring(14,16))/60)

     var elementHour = Math.trunc(startNum) //truncates to a full number
     var elementChunk: number;
     var isContinual = false
     var finalChunk = 0
     var extraDayCount = 0
     if(endNum < startNum){
        elementChunk = (endNum+24) - (startNum)
     } else {
        elementChunk = endNum - startNum
     }
     if(date.getDay() == props.day){
      var newItem = {
        id: element.id,
        title: element.summary,
        hour: elementHour,
        chunk: elementChunk,
        continual: isContinual,
        continualInfo: {
          extraDays: extraDayCount,
          finalChunk: finalChunk
        },
        desc: element.description
      }
      eventList.value.push(newItem)
     }
  });
    }
 }
 onMounted(() => {
    getEventInfo()
})
</script>

<style>

</style>