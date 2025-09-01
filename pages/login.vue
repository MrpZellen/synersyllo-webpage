<template>
  <div class="flex flex-grow justify-around items-center space-y-4 space-x-4 flex-col">
    <div class="text-2xl font-bold p-3">Log into SynerSyllo</div>
    <div v-if="googleFail" class="text-red-500 text-xs font-bold">Please login with your linked google account!</div>
    <div
      class="p-5 rounded-sm bg-blue-300 border-2 border-black shadow-lg flex flex-col space-x-4 space-y-4"
     >
      <div class="text-xl rounded-sm p-2 bg-sky-100">
        User: <input type="text" v-model="loginInfo.username" />
        <div v-if="failedUser" class="text-red-500 text-xs font-bold">a valid username must be at least 8 characters long! No emai, just username!</div>
      </div>
      <div class="text-xl rounded-sm p-2 bg-sky-100">
        Pass: <input type="password" v-model="loginInfo.password" />
        <div v-if="failedPass" class="text-red-500 text-xs font-bold">a vaild password must have more than 8 characters, 1 uppercase character, 1 lowercase, 1 number, and 1 special character!</div>
      </div>
      <button @click="submitLogin"
            class="m-1 px-4 py-2 bg-sky-100 rounded hover:bg-sky-300 hover:border-black border-2 border-transparent font-bold"
          >Submit Results</button>
    </div>
    <div class="text-sm text-red-500 py-4"><i>Google Authorization is required, and you will need to recheck to access your calendar.</i></div>
    </div>
</template>

<script setup lang="ts">
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid'
const route = useRoute()
const failedPass = ref(false)
const failedUser = ref(false)
const googleFail = computed(() => route.query.floppedLogin === 'true')

if(googleFail){
    const result = await $fetch('/api/accessUser/logout')
  if(!(result.status === 200)){
    console.log('LITERALLY HOW.')
  } 
}
const loginInfo = ref<{
  password: string,
  username: string
}>({
  password: '',
  username: ''
});

const submitLogin = async () => {
  try {
    failedPass.value = false
    failedUser.value = false
    const id = uuidv4()
    console.log('logging in...')
    //reset in case of failed input later down the line
    const UserVal = z.object({
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/), //8 char, 1 special, 1 upper, 1 lower, 1 number
    username: z.string().regex(/^(?!.*@).{8,}$/) //at least 8 char AND NO @
    });

    const validatedUser = UserVal.parse(loginInfo.value)
    //ESTABLISH USER, PASS, and REGISTRATION:
    const isRegistered = await $fetch(`/api/statusManagement/registerstatus/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        isRegistered: false,
        state: id
      })
    })
    const pass = await $fetch(`/api/statusManagement/passstatus/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pass: loginInfo.value.password,
        state: id
      })
    })
    const user = await $fetch(`/api/statusManagement/session/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user: loginInfo.value.username,
      state: id
    })
  })
  //ESTABLISH CID TOO
  const cid = await $fetch(`/api/accessUser/getUserCID`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user: loginInfo.value.username
    })
  })
  const resultCID = await $fetch(`/api/statusManagement/cidstatus/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        companyID: cid,
        state: id
      })
    })
    console.log('api status check. User: ', user, '\nPass: ', pass, '\nisRegistered: ', isRegistered)
    const clientId = encodeURIComponent('431685922807-kr6tslc5l1if280ht90bqgh8h03m4rmb.apps.googleusercontent.com')
    const redirectUri = encodeURIComponent('http://localhost:3000/api/redirectAuth')
    const scope = [ 'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
     ].join(' ')
    const url = `https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=${encodeURIComponent(scope)}&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${id}`
    //goes to auth
    window.location.href = url
  } catch (err) {
    console.error(err)
    if(err instanceof z.ZodError){
      err.issues.forEach(issue => {
        if(issue.path[0] == 'password'){
          failedPass.value = true
        }
        if(issue.path[0] == 'username'){
          failedUser.value = true
        }
      });
    }
  }
}
</script>