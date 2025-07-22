<template>
  <div class="flex flex-grow justify-around items-center space-y-4 space-x-4 flex-col">
    <div class="text-2xl font-bold p-3">Register for SynerSyllo</DIV>
    <div
      class="p-5 rounded-sm bg-blue-300 border-2 border-black shadow-lg flex flex-col space-x-4 space-y-4"
     >
      <div class="text-xl rounded-sm p-2 bg-sky-100">
        User: <input type="text" v-model="registrationInfo.username" />
        <div v-if="failedUser" class="text-red-500 text-xs font-bold">a valid username must be at least 8 characters long!</div>
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
import { setUser, getUser } from '~/server/utils/sessionStorage'
import { v4 as uuidv4 } from 'uuid'
const failedUser = ref(false)
const registrationInfo = ref<{
  username: string
}>({
  username: ''
});

const submitRegistration = async () => {
  try {
    console.log(registrationInfo.value.username)
    failedUser.value = false
    console.log('registering...')
    //reset in case of failed input later down the line
    const UserVal = z.object({
    username: z.string().regex(/^.{8,}$/) //at least 8 char
    });

    const validatedUser = UserVal.parse(registrationInfo.value)
    //TODO: clean failed cookie handling
    const trueUser = {
      signUp: true,
      signIn: false,
      userInfo: validatedUser
    }
    //BUT FIRST, set user:
    const id = uuidv4()
    await setUser(id, trueUser.userInfo.username)
    console.log('userstuff:',  getUser(id))
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
      });
    }
  }
}
</script>