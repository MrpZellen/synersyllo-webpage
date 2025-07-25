<template>
  <div class="flex flex-grow justify-around items-center space-y-4 space-x-4 flex-col m-5">
    <div class="text-xl">You have created a new company! Your ID is: <span class="font-bold bg-black hover:bg-white">{{ companyID }}</span>.
    </div>
      <div class="font-bold">DO NOT SHARE THIS WITH ANYONE OUTSIDE YOUR COMPANY.</div>
    <div class="text-2xl font-bold p-3">Register An Admin Account for {{ companyName }}</DIV>
    <div
      class="p-5 rounded-sm bg-blue-300 border-2 border-black shadow-lg flex flex-col space-x-4 space-y-4"
     >
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
const failedUser = ref(false)
const failedPass = ref(false)
const route = useRoute()
const companyID = route.params.companyID
const registrationInfo = ref<{
  username: string,
  password: string
}>({
  username: '',
  password: ''
});

const submitRegistration = async () => {
  try {
    console.log(registrationInfo.value.username)
    failedUser.value = false
    failedPass.value = false
    console.log('registering...')
    //reset in case of failed input later down the line
    const UserVal = z.object({
    username: z.string().regex(/^.{8,}$/), //at least 8 char
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/), //8 char, 1 special, 1 upper, 1 lower, 1 number
    });

    const validatedUser = UserVal.parse(registrationInfo.value)
    //BUT FIRST, set user:
    const id = uuidv4()

    //ALONG WITH ALL OTHER USUAL REGISTRATION SETS, WE SET AN ISADMIN TO TRUE
    const admin = await $fetch(`/api/adminstatus/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      admin: true,
      state: id
    })
  })

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
   //now we set the CURRENT CID
  const CID = await $fetch(`/api/cidstatus/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      companyID: companyID, //uses our current one rather than input
      state: id
    })
  })

    console.log('userstuff:',  user)
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
      });
    }
  }
}
var companyName = ref('');
const getCompany = async () => {
  const result = await $fetch<{ status: number, company: any }>(`/api/company/getCompany`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      CID: companyID
    })
  })
  if(result.status !== 400){
    console.log('name retrieved')
    companyName.value = result.company.companyInfo.name
  } else {
    console.error('error fetching Company name')
  }
}

onMounted(() => {
  getCompany()
})
</script>