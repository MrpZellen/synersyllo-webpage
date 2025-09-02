<template>
  <div v-if="!isLoading" class="flex flex-col w-full h-full">
  <div class=" text-center p-4 font-bold text-lg">What are your plans today, {{ username }}?</div>
  <div v-if="isAdmin" class="text-center p-4 font-bold text-xl">Signed in as Admin.</div>
  <div v-if="surveyReady" @click="surveyRedirect" class="p-2 text-center hover:text-funkygreen font-bold text-lg text-synsyl-darkgreen animate-bounce">You have a survey ready! Click here to take it!!</div>
  <div class="w-full flex justify-center bg-transparent h-full">
    <div
      v-if="openAddWindow == true"
      class="absolute z-50 p-5 top-1/3 left-1/3 w-[440px] h-fit rounded-sm bg-blue-300 border-2 border-black shadow-lg"
     >
     <div v-if="!goodFields" class="text-red-500 text-md font-bold">please input all fields!</div>
      <div class="text-xl p-2">
        Title: <input class="bg-sky-100 rounded-md m-2 p-2" v-model="popOutValues.eventTitle" />
      </div>
      <div class="text-xl p-2">
        Description:
        <textarea class="bg-sky-100 rounded-md m-2 p-2"
          v-model="popOutValues.eventDesc"
          placeholder="enter desc..."
        />
      </div>
      <div class="text-md p-2 flex flex-col">
        <div>
          Start Time:
          <input class="bg-sky-100 rounded-md m-2 p-2" type="datetime-local" v-model="popOutValues.startHour" />
        </div>
        <div>
          End Time: 
          <input class="bg-sky-100 rounded-md m-2 p-2" type="datetime-local" v-model="popOutValues.endHour" />
        </div>
      </div>
      <div> Change Timezone?
        <input type="checkbox" v-model="changeTimezone"/>
        <div v-if="changeTimezone">
          <div>
          Timezone:
          <v-select class="bg-sky-100 rounded-md m-2 p-2" :options="TZoptions" ></v-select>
        </div>
        </div>
      </div>
      <div class="text-md p-2 flex flex-col">
        <div>Is It Recurring?
          <input type="checkbox" v-model="popOutValues.isRecurring"/>
          <div class="flex flex-col" v-if="popOutValues.isRecurring">
            <div class="bg-sky-100 rounded-md m-2 p-2">What interval?
              Daily <input type="radio" name="recurring" value="daily" v-model="repetitionValues.interval" />
              Weekly <input type="radio" name="recurring" value="weekly" v-model="repetitionValues.interval" />
              Biweekly <input type="radio" name="recurring" value="biweekly" v-model="repetitionValues.interval" />
              Monthly <input type="radio" name="recurring" value="monthly" v-model="repetitionValues.interval" />
              Yearly <input type="radio" name="recurring" value="yearly" v-model="repetitionValues.interval" />
            </div>
            <div>When should it end?
              Never <input type="checkbox" value="never" v-model="repetitionValues.endsOn" v-on:click="showEndMenu" />
              <div v-if="ends">
                <input class="bg-sky-100 rounded-md m-2 p-2" type="datetime-local" v-model="repetitionValues.endsOn" />
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
    <div class="content-center" @mouseover="leftButtonShown = true" @mouseleave="leftButtonShown = false" @click="pageUp(false)">
      <img class="h-10/12" v-if="!leftButtonShown" src="/assets/icons/arrows/leftArrowDeactive.png" />
      <img class="h-10/12 " v-if="leftButtonShown" src="/assets/icons/arrows/leftArrowActive.png" />
    </div>
    <keep-alive>
      <div class="w-full justify-center flex flex-row">
      <div class="content-end">
        <div class="grid h-23/24 text-center pl-2 ml-2 pr-2 mr-2 font-bold" :style="{ gridTemplateRows: `repeat(${items.hoursTotal-1}, 1fr)` }">
          <div v-for="hour in hoursArray" :key="hour" class="flex flex-grow h-full ">
            <div v-if="hour == 0">12 AM</div>
            <div v-if="hour < 12 && hour > 0">{{ hour }} AM</div>
            <div v-if="hour == 12">12 PM</div>
            <div v-if="hour > 12 && hour < 24">{{ hour - 12 }} PM</div>
            <div v-if="hour == 24">12 AM</div>
          </div>
        </div>
      </div>
      <div class="w-11/12 relative z-10 h-full">
        <div class="absolute z-0 inset-0 content-end">
        <div class="grid h-23/24" :style="{ gridTemplateRows: `repeat(${items.hoursTotal-1}, 1fr)` }">
          <div v-for="hour in hoursArray" :key="hour" class="flex flex-grow h-full">
            <hr class="border-black/60 border-b-2 w-full" />
          </div>
        </div>
     </div>
        <calendar-back v-if="items.calendarPref != ''" class="relative z-20"
        @emit-final="retrieveBackData"
        :calendar-pref="items.calendarPref"
        :hours-total="items.hoursTotal"
        :recall="menuClosed"
        :isInBG="isInBG"
        :title-of-calendar="items.titleOfCalendar"
        :theme-color="items.themeColor"
        :user-email="items.userEmail"
        :days-per-week="items.daysPerWeek"
        :page-count="page"
      />
      </div>
      </div>
    </keep-alive>
    <div class="content-center" @mouseover="rightButtonShown = true"  @mouseleave="rightButtonShown = false" @click="pageUp(true)">
      <img class="h-10/12 " v-if="!rightButtonShown" src="/assets/icons/arrows/rightArrowDeactive.png" />
      <img class="h-10/12 " v-if="rightButtonShown" src="/assets/icons/arrows/rightArrowActive.png" />
    </div>
  </div>
  <button
    v-if="isInBG == false"
    @click="openWindow"
    class="px-4 content-center self-center w-1/2 py-2 m-5 bg-funkygreen text-white rounded hover:bg-darkfunk font-bold"
  >
    Make A New Event
  </button>
  </div>
</template>

<script setup lang="ts">
import { isValidObjectId } from 'mongoose';
import vSelect from 'vue-select';
import * as z from 'zod';
import type { Calendar } from '~/models/Calendar'
import type { UserType } from '~/models/UserType';
import { TZoptions } from '~/models/TZoptions';
import { getData, setData } from 'nuxt-storage/local-storage';
//get user
const route = useRoute()
var username = ref(route.params.user)
const page = ref(0)
const resultsGained = ref(false)
const isAdmin = ref(false)
const isLoading = ref(true)
const changeTimezone = ref(false)
const leftButtonShown = ref(false)
const rightButtonShown = ref(false)


var myCookie = useCookie('google_tokens').value
const menuClosed = ref(true)
const checkValues = z.object({
  eventTitle: z.string(),
  eventDesc: z.string(),
  startHour: z.string(),
  endHour: z.string(),
}).refine((data) => {
  const timeRes = ((new Date(data.endHour).getTime()) - (new Date(data.startHour).getTime())) / 6000 //gives time i am looking for 30 min or more
  console.log('timeRes: ', timeRes, new Date(data.startHour).getTime(), new Date(data.endHour).getTime())
  return timeRes >= 15

}, {
  message: 'event must be 15 minutes or longer!'
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

const surveyRedirect = () => {
  navigateTo(`/bob/${username.value}`)
}

const pageUp = async (isUp: boolean) => {
  console.log('paging up! ', isUp)
  let res = await getData(String(username))
  if(isUp){
    await setData(String(username), (res + 1))
  } else {
    await setData(String(username), (res - 1))
  }
  page.value = await getData(String(username))
}
//NEW CONCEPT: a reactive allows it to be changed post build
const items = reactive({
  hoursTotal: 0,
  titleOfCalendar: "",
  themeColor: "",
  userEmail: "",
  daysPerWeek: 7,
  calendarPref: ''
});
const hoursArray = computed(() => Array.from({ length: items.hoursTotal }, (_, num) => num)) //value and num are the same, only one needed


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
  startHour: 0,
  endHour:0,
  isRecurring: boolean,
  timezone: string
}>({
  eventID: '',
  eventTitle: '',
  eventDesc: '',
  startHour: 0,
  endHour: 0,
  isRecurring: false,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
});
var startHourCalc = "0 PM";
var endHourCalc = "1 PM";

//change state on bg render
const isInBG = ref(false);
//change showcase of survey options
const surveyReady = ref(false)



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
  if (hour < 12 && hour > 1) {
    return Math.floor(hour) + ":" + min + " AM";
  } else if (hour > 12 && hour < 24) {
    return Math.floor(hour % 12) + ":" + min + " PM";
  } else if (hour >= 12 && hour < 13) {
    return Math.floor(hour) + ":" + min + " PM";
  } else if ((hour > 24 && hour < 25) ||(hour > 0 && hour < 1)) {
    return "12:" + min + " AM";
  } else if(hour >= 25) {
    return Math.floor(hour-24) + ":" + min + " AM";
  } else {
    return "12 AM";
  }
};

const buildCalendar = async () => {
  console.log('first we mine...')
  const result = await $fetch<{ calendars: Calendar, status: number }>(`/api/events/getCalendar`, {
    credentials: 'include'
  }).then((result) => {
    if(result.status == 400){
      navigateTo('/logout')
      console.error('not signed in!')
      //error page handling
    }
    items.titleOfCalendar = result.calendars.summary;
    items.themeColor = result.calendars.backgroundColor;
    items.userEmail = result.calendars.id;
    items.calendarPref = result.calendars.timeZone;
    console.log('TIMEZONE FROM SOURCE: ', items.calendarPref )
    items.daysPerWeek = 5;
    items.hoursTotal = 24 + 1;
    console.log('ITEMS HERE!!!!  ', result)
    resultsGained.value = true
  })
};

const back = () => {
  popOutValues.value = {
  eventID: '',
  eventTitle: '',
  eventDesc: '',
  startHour: 0,
  endHour: 0,
  isRecurring: false,
  timezone: items.calendarPref
  };
  menuClosed.value = false
  isInBG.value = false;
};
const backNew = () => {
  menuClosed.value = false;
  openAddWindow.value = false;
}

//ADD EVENT
const addEvent = async () => {
  console.log('we addin')
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
  console.log(popOutValues.value)
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
      timezone: popOutValues.value.timezone,
      status: 'confirmed',
      recurrence: popOutValues.value.isRecurring ?? false,
      recurrenceItems: {
        endsOn: repetitionValues.value.endsOn ?? 'never',
        interval: repetitionValues.value.interval ?? null
      },
    })
  }).then(() => {
    console.log('DID WE ADD EVENT?')
    backNew()
    reloadNuxtApp()
  })
  } catch(error) {
    console.log('whybadevent?', error)
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
      calendarID: items.userEmail
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

const checkSurvey = async () => {
  try{
    const response = await $fetch<{ status: number, info: UserType }>('/api/accessUser/getUserByUsername', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username.value
      })
    })
    if(response.status == 200){
      surveyReady.value = response.info.employeeData.availableSurvey
      console.log('surveyValue: ', surveyReady.value)
    }
  }catch(error){
    console.error('FAILED TO RETRIEVE SURVEY STATUS', error)
    navigateTo('/logout')
  }
}


emitRes('sendLoginUpdate', (myCookie ? true : false))

onMounted(async () => {
  const res = await $fetch<{ isLoggedIn: boolean, isAdmin: boolean }>('/api/checkLoginStatus')
  isAdmin.value = res.isAdmin
  console.log('is logged in: ', res.isLoggedIn, 'Is admin: ', res.isAdmin)
  page.value = await getData(String(username))
  if(!resultsGained.value){
  await buildCalendar();
  }
  await checkSurvey();
  
  isLoading.value = false
})
</script>