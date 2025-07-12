<template>
  <div>Yay! We are authorized!!!</div>
  <button
    v-if="isInBG == false"
    @click="openWindow"
    class="px-4 py-2 m-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold"
  >
    Make A New Event
  </button>
  <div class="w-full">
    <div
      v-if="openAddWindow == true"
      class="absolute z-50 p-5 top-1/3 left-1/3 w-[400px] h-[350px] rounded-sm bg-blue-300 border-2 border-black shadow-lg"
     >
     <div v-if="!goodFields" class="text-red-500 text-md font-bold">please input all fields!</div>
      <div class="text-xl p-2">
        Title: <input v-model="popOutValues.eventTitle" />
      </div>
      <div class="text-xl p-2">
        Description:
        <textarea
          v-model="popOutValues.eventDesc"
          placeholder="enter desc..."
        />
      </div>
      <div class="text-md p-2 flex flex-col">
        <div>
          Start Time:
          <input type="datetime-local" v-model="popOutValues.startHour" />
        </div>
        <div>
          End Time: 
          <input type="datetime-local" v-model="popOutValues.endHour" />
        </div>
      </div>
      <button
            @click="backNew"
            class="m-1 px-4 py-2 bg-sky-100 rounded hover:bg-sky-300 hover:border-black border-2 border-transparent font-bold"
          >
            Back
          </button>
      <button
            @click="addEvent"
            class="m-1 px-4 py-2 bg-sky-100 rounded hover:bg-sky-300 hover:border-black border-2 border-transparent font-bold"
          >
            Add Event
          </button>
    </div>
    <div v-if="isInBG == true">
      <div
        class="absolute z-50 p-5 top-1/3 left-1/3 w-[400px] h-[250px] rounded-sm bg-blue-300 border-2 border-black shadow-lg"
      >
        <div class="text-xl font-bold p-2">{{ popOutValues!.eventTitle }}</div>
        <div class="text-lg bg-white rounded-sm p-2">
          {{ popOutValues!.eventDesc }}
        </div>
        <div class="text-md flex justify-end p-1 text-end">
          {{ startHourCalc }} - {{ endHourCalc }}
        </div>
        <div class="flex flex-row">
          <button
            @click="back"
            class="m-1 px-4 py-2 bg-sky-100 rounded hover:bg-sky-300 hover:border-black border-2 border-transparent font-bold"
          >
            Back
          </button>
          <button
            @click="removeEvent"
            class="m-1 px-4 py-2 bg-sky-100 rounded hover:bg-sky-300 hover:border-black border-2 border-transparent font-bold"
          >
            Remove Event
          </button>
        </div>
      </div>
    </div>
    <calendar-back
      @emit-final="retrieveBackData"
      :isInBG="isInBG"
      :title-of-calendar="items.titleOfCalendar"
      :theme-color="items.themeColor"
      :user-email="items.userEmail"
      :days-per-week="7"
    />
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod';
const checkValues = z.object({
  eventTitle: z.string(),
  eventDesc: z.string(),
  startHour: z.string(),
  endHour: z.string(),
})
var goodFields = ref(true)
var openAddWindow = ref(false);
const openWindow = () => {
  openAddWindow.value = true;
  console.log("hit");
};
// a little confusing, bgInBG goes back to calendarBack
const getCalendar = () => {
  navigateTo("/api/calendars");
};
const getEvent = () => {
  navigateTo("/api/events");
};
//NEW CONCEPT: a reactive allows it to be changed post build
const items = reactive({
  titleOfCalendar: "",
  themeColor: "",
  userEmail: "",
  daysPerWeek: 7,
});

const popOutValues = ref<{
  eventTitle: '',
  eventDesc: '',
  startHour: 0,
  endHour: 0,
}>({
  eventTitle: '',
  eventDesc: '',
  startHour: 0,
  endHour: 0,
});
var startHourCalc = "0 PM";
var endHourCalc = "1 PM";

//change state on bg render
const isInBG = ref(false);

const retrieveBackData = (payload: any) => {
  isInBG.value = true;
  popOutValues.value = payload;
  startHourCalc = calcResult(payload.startHour);
  endHourCalc = calcResult(payload.endHour);
  console.log("emitted full!");
};

const calcResult = (hour: number) => {
  var min = ((hour - Math.floor(hour)) * 60).toString();
  if (min == "0") {
    min = "00";
  }
  if (hour < 12 && hour != 0) {
    return hour + ":" + min + " AM";
  } else if (hour > 12) {
    return (hour % 12) + ":" + min + " PM";
  } else if (hour == 12) {
    return hour + ":" + min + " PM";
  } else {
    return "12 AM";
  }
};

const buildCalendar = async () => {
  const result = await $fetch<{
    id: string;
    summary: string;
    description?: string;
    backgroundColor: string;
  }>("/api/calendars");
  items.titleOfCalendar = result.summary;
  items.themeColor = result.backgroundColor;
  items.userEmail = result.id;
  items.daysPerWeek = 7;
};
buildCalendar();

const back = () => {
  isInBG.value = false;
};
const backNew = () => {
  openAddWindow.value = false;
}

//ADD EVENT
const addEvent = async () => {
  try{
  checkValues.parse({
    eventTitle: popOutValues.value.eventTitle,
    eventDesc: popOutValues.value.eventDesc,
    startHour: popOutValues.value.startHour,
    endHour: popOutValues.value.endHour,
  })
  //then post it:
  const response = await $fetch('/api/addEvent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      eventTitle: popOutValues.value.eventTitle,
      eventDesc: popOutValues.value.eventDesc,
      startHour: popOutValues.value.startHour,
      endHour: popOutValues.value.endHour,
    })
  }).then(() => {
    console.log(response)
    backNew()
  })
  } catch(error) {
    goodFields.value = false
  }
};

//REMOVE EVENT
</script>
