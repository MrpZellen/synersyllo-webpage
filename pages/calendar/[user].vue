<template>
  <div class=" text-center p-4 font-bold text-lg">What are your plans today, {{ username }}?</div>
  <div class="w-full">
    <div
      v-if="openAddWindow == true"
      class="absolute z-50 p-5 top-1/3 left-1/3 w-[400px] h-[500px] rounded-sm bg-blue-300 border-2 border-black shadow-lg"
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
      <div class="text-md p-2 flex flex-col">
        <div>Is It Recurring?
          <input type="checkbox" v-model="popOutValues.isRecurring"/>
          <div class="flex flex-col" v-if="popOutValues.isRecurring">
            <div>What interval?
              Daily <input type="radio" name="recurring" value="daily" v-model="repetitionValues.interval" />
              Weekly <input type="radio" name="recurring" value="weekly" v-model="repetitionValues.interval" />
              Biweekly <input type="radio" name="recurring" value="biweekly" v-model="repetitionValues.interval" />
              Monthly <input type="radio" name="recurring" value="monthly" v-model="repetitionValues.interval" />
              Yearly <input type="radio" name="recurring" value="yearly" v-model="repetitionValues.interval" />
            </div>
            <div>When should it end?
              Never <input type="checkbox" value="never" v-model="repetitionValues.endsOn" v-on:click="showEndMenu" />
              <div v-if="ends">
                <input type="datetime-local" v-model="repetitionValues.endsOn" />
              </div>
            </div>
          </div>
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
        <div class="text-sm bg-white rounded-sm p-2">
          {{ popOutValues!.eventDesc ?? 'No Description...' }}
        </div>
        <div class="text-md flex justify-end p-1 text-end">
          {{ startHourCalc }} - {{ endHourCalc }}
        </div>
        <div class="flex flex-row">
          <button
            @click="back"
            class="m-1 px-4 py-2 bg-funkygreen rounded hover:bg-darkfunk hover:border-black border-2 border-transparent font-bold text-white"
          >
            Back
          </button>
          <button
            @click="removeEvent"
            class="m-1 px-4 py-2 bg-funkygreen rounded hover:bg-darkfunk hover:border-red-500 border-2 border-transparent font-bold text-white"
          >
            Remove Event
          </button>
        </div>
      </div>
    </div>
    <keep-alive>
      <calendar-back
        @emit-final="retrieveBackData"
        :recall="menuClosed"
        :isInBG="isInBG"
        :title-of-calendar="items.titleOfCalendar"
        :theme-color="items.themeColor"
        :user-email="items.userEmail"
        :days-per-week="7"
      />
    </keep-alive>
  </div>
  <button
    v-if="isInBG == false"
    @click="openWindow"
    class="px-4 content-center w-1/2 py-2 m-3 bg-funkygreen text-white rounded hover:bg-darkfunk font-bold"
  >
    Make A New Event
  </button>
</template>

<script setup lang="ts">
import * as z from 'zod';
import type { Calendar } from '~/models/Calendar'

reloadNuxtApp();

var myCookie = useCookie('google_tokens').value
const menuClosed = ref(true)
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
const ends = ref(true)
const showEndMenu = () => {
  ends.value = !ends.value
}
//get user
const route = useRoute()
var username = ref(route.params.user)
//NEW CONCEPT: a reactive allows it to be changed post build
const items = reactive({
  titleOfCalendar: "",
  themeColor: "",
  userEmail: "",
  daysPerWeek: 7,
});
const repetitionValues = ref<{
  interval: string,
  endsOn: string,
}>({
  interval: '',
  endsOn: '',
});

const popOutValues = ref<{
  eventID: string,
  eventTitle: string,
  eventDesc: string,
  startHour: number,
  endHour: number,
  isRecurring: boolean
}>({
  eventID: '',
  eventTitle: '',
  eventDesc: '',
  startHour: 0,
  endHour: 0,
  isRecurring: false
});
var startHourCalc = "0 PM";
var endHourCalc = "1 PM";

//change state on bg render
const isInBG = ref(false);


//EMIT HANDLES
const emitRes = defineEmits(['sendLoginUpdate'])
const retrieveBackData = (payload: any) => {
  isInBG.value = true;
  popOutValues.value = payload;
  startHourCalc = calcResult(payload.startHour);
  endHourCalc = calcResult(payload.endHour);
  console.log("emitted full!");
};


//CALCULATION MATH FOR CALENDAR TIMES
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

  const result = await $fetch<{ calendars: Calendar }>(`/api/calendar/${username}`, {
    credentials: 'include'
  }).then((result) => {
    if(!result){
      console.error('not signed in!')
      //error page handling
    }
    items.titleOfCalendar = result.calendars.summary;
    items.themeColor = result.calendars.backgroundColor;
    items.userEmail = result.calendars.id;
    items.daysPerWeek = 7;
    console.log('ITEMS HERE!!!!  ', result)
  })
};

const back = () => {
  menuClosed.value = false
  isInBG.value = false;
};
const backNew = () => {
  menuClosed.value = false;
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
  if(popOutValues.value.isRecurring){
    if(repetitionValues.value.endsOn === ''){
      repetitionValues.value.endsOn = 'never'
    }
  }
  //then post it:
  const response = await $fetch('/api/events/addEvent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      eventTitle: popOutValues.value.eventTitle,
      eventDesc: popOutValues.value.eventDesc,
      startHour: popOutValues.value.startHour,
      endHour: popOutValues.value.endHour,
      status: 'confirmed',
      recurrence: popOutValues.value.isRecurring ?? false,
      recurrenceItems: {
        endsOn: repetitionValues.value.endsOn ?? 'never',
        interval: repetitionValues.value.interval ?? null
      },
    })
  }).then(() => {
    backNew()
  })
  } catch(error) {
    goodFields.value = false
  }
};

//REMOVE EVENT
const removeEvent = async () => {
  try{
  //then post it:
  const response = await $fetch('/api/events/deleteEvent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      eventID: popOutValues.value.eventID,
      calendarID: 'work@benleonard.net' //todo: get user info from mongodb
    })
  }).then(() => {
    console.log(response)
    back()
  })
  } catch(error) {
    console.log(error)
    back()
  }
};


emitRes('sendLoginUpdate', (myCookie ? true : false))

onMounted(async (event: any) => {
  await buildCalendar();
})
</script>