<template>
  <div class="flex flex-grow justify-around items-center space-y-4 space-x-4 flex-col">
    <DIV class="text-2xl font-bold p-3">Log into SynerSyllo</DIV>
    <div
      class="p-5 rounded-sm bg-blue-300 border-2 border-black shadow-lg flex flex-col space-x-4 space-y-4"
     >
      <div class="text-xl rounded-sm p-2 bg-sky-100">
        User: <input type="text" v-model="loginInfo.username" />
        <div v-if="failedUser" class="text-red-500 text-xs font-bold">a valid username must be at least 8 characters long!</div>
      </div>
      <div class="text-xl rounded-sm p-2 bg-sky-100">
        Pass: <input type="password" v-model="loginInfo.password" />
        <div v-if="failedPass" class="text-red-500 text-xs font-bold">a vaild password must have more than 8 characters, 1 uppercase character, 1 lowercase, 1 number, and 1 special character!</div>
      </div>
      <button @click="submitLogin"
            class="m-1 px-4 py-2 bg-sky-100 rounded hover:bg-sky-300 hover:border-black border-2 border-transparent font-bold"
          >Submit Results</button>
    </div>
    </div>
</template>

<script setup lang="ts">
import * as z from 'zod';


const emailVal = z.string().email()
const passwordVal = z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/) //8 char, 1 special, 1 upper, 1 lower, 1 number
const usernameVal =  z.string().regex(/^.{8,}$/) //at least 8 char
const failedEmail = ref(false)
const failedPass = ref(false)
const failedUser = ref(false)
const loginInfo = ref<{
  password: string,
  username: string
}>({
  password: '',
  username: ''
});

const submitLogin = async () => {
  try {
    console.log(loginInfo.value.password, loginInfo.value.username)
    failedEmail.value = false
    failedPass.value = false
    failedUser.value = false
    console.log('registering...')
    //reset in case of failed input later down the line
    const UserVal = z.object({
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/), //8 char, 1 special, 1 upper, 1 lower, 1 number
    username: z.string().regex(/^.{8,}$/) //at least 8 char
    });

    const validatedUser = UserVal.parse(loginInfo.value)
    const result = await $fetch('/api/accessUser/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(validatedUser)
  }).then((data) => {
    if(data){
      console.log('success')
    } else {
      console.error('failed to fetch result, submit failed!')
    }
  })
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