<template>
  <div class="flex flex-grow justify-around items-center space-y-4 space-x-4 flex-col">
    <div class="text-2xl font-bold p-3">Register for SynerSyllo</DIV>
    <div
      class="p-5 rounded-sm bg-blue-300 border-2 border-black shadow-lg flex flex-col space-x-4 space-y-4"
     >
      <div class="text-xl rounded-sm p-2 bg-sky-100">
        Company ID: <input type="text" v-model="registrationInfo.companyID" />
        <div v-if="failedCompany" class="text-red-500 text-xs font-bold">Please input a valid company ID!</div>
      </div>
      <div class="text-xl rounded-sm p-2 bg-sky-100">
        User: <input type="text" v-model="registrationInfo.username" />
        <div v-if="failedUser" class="text-red-500 text-xs font-bold">a valid username must be at least 8 characters long!</div>
      </div>
      <div class="text-xl rounded-sm p-2 bg-sky-100">
        Pass: <input type="password" v-model="registrationInfo.password" />
        <div v-if="failedPass" class="text-red-500 text-xs font-bold">a vaild password must have more than 8 characters, 1 uppercase character, 1 lowercase, 1 number, and 1 special character!</div>
      </div>
      <button @click="submitRegistration"
            class="m-1 px-4 py-2 bg-sky-100 rounded hover:bg-sky-300 hover:border-black border-2 border-transparent font-bold"
          >Submit Results</button>
    </div>
    <div class="text-sm text-red-500 py-4"><i>Google Authorization is required.</i></div>
    </div>
</template>

<script setup lang="ts">
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid'
const failedPass = ref(false)
const failedUser = ref(false)
const failedCompany = ref(false)
const registrationInfo = ref<{
  username: string,
  password: string,
  companyID: string
}>({
  username: '',
  password: '',
  companyID: '',
});

const submitRegistration = async () => {
  try {
    console.log(registrationInfo.value.username)
    failedUser.value = false
    failedCompany.value = false
    failedPass.value = false
    console.log('registering...')
    //reset in case of failed input later down the line
    const UserVal = z.object({
    username: z.string().regex(/^(?!.*@).{8,}$/), //at least 8 char
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/), //8 char, 1 special, 1 upper, 1 lower, 1 number
    companyID: z.string().regex(/^COM-[A-Za-z0-9]{9}$/) // regex for COM- followed by 9 random characters
    });

    const validatedUser = UserVal.parse(registrationInfo.value)
    //BUT FIRST, set user:
    const id = uuidv4()
    const user = await $fetch(`/api/session/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user: registrationInfo.value.username,
      state: id
    })
  })
  const pass = await $fetch(`/api/passstatus/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      pass: registrationInfo.value.password,
      state: id
    })
  })
  //now we set registration status
  const isRegistered = await $fetch(`/api/registerstatus/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      isRegistered: true,
      state: id
    })
  })
  const companyID = await $fetch(`/api/cidstatus/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      companyID: registrationInfo.value.companyID,
      state: id
    })
  })

    //CHECKING FOR A VALID CID
    const result = await $fetch(`/api/company/checkCID`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        CID: registrationInfo.value.companyID
      })
    })
    if(!result.validID){
      failedCompany.value = true
      return
    }
    console.log('userstuff:',  user, pass)
    console.log('registering? ', isRegistered)
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
        if(issue.path[0] == 'username'){
          failedUser.value = true
        }
        if(issue.path[0] == 'password'){
          failedPass.value = true
        }
        if(issue.path[0] == 'companyID'){
          failedCompany.value = true
        }
      });
    }
  }
}
</script>