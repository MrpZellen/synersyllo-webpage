<template>
  <div class="flex flex-col w-full h-full text-center border-2 border-black">
    <div class=" top-0 border-2 border-black">
    {{ dayItem }}
  </div>
    <div class="flex-1 relative items-stretch justify-items-stretch">
      <div v-for="event in eventList">
        <calendar-event :event-title="event.title" :event-count="dayCount" :hour="event.hour" :chunk="event.chunk"></calendar-event>
      </div>
      <calendar-event :event-title="eventTitles[0]" :event-count="dayCount" :hour="1" :chunk="1"></calendar-event>
      <calendar-event :event-title="eventTitles[1]" :event-count="dayCount" :hour="2" :chunk="0.5"></calendar-event>
      <calendar-event :event-title="eventTitles[2]" :event-count="dayCount" :hour="3" :chunk="0.25"></calendar-event>
      <calendar-event :event-title="eventTitles[3]" :event-count="dayCount" :hour="5" :chunk="2"></calendar-event>
      <calendar-event :event-title="eventTitles[4]" :event-count="dayCount" :hour="6" :chunk="1.5"></calendar-event>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CalendarEvent from './calendarEvent.vue';
 const props = defineProps<{
  day: number,
  dayCount: number,
  eventInfo: typeof CalendarEvent[],
 }>();
 //date calculation
 var currentTime = new Date().toDateString()
 var dayItem = currentTime.substring(0, 2).toUpperCase();

 var eventList = new Array();
 const validateList = async () => {
  props.eventInfo.forEach(element => {
     var dateString = element.start.dateTime.substring(0, 9);
     //num math
     var startNumString = element.start.dateTime.substring(11, 13);
     var endNumString = element.end.dateTime.substring(11, 13);

     var startNum = parseFloat(startNumString) + (parseFloat(element.start.dateTime.substring(15,17))/60)
     var endNum = parseFloat(endNumString) + (parseFloat(element.end.dateTime.substring(15,17))/60)

     var elementHour = Math.trunc(startNum) //truncates to a full number
     var elementChunk = endNum - startNum

     let date = new Date(dateString)
     if(date.getDay() == props.day){
      var newItem = {
        title: element.summary,
        hour: elementHour,
        chunk: elementChunk,
      }
      eventList.concat(newItem)
     }
  });
 }
 await validateList();

 const eventTitles = [
  'john event',
  'michael its your bday',
  'all hands meeting',
  'no hands meeting',
  'whose idea was this'
 ]
</script>

<style>

</style>