<template>
  <div class="flex flex-col content-center bg-funkygreen min-w-50 hover:border-synsyl-darkgreen border-6 border-transparent rounded">
    <div class="text-center p-1 font-bold text-3xl">{{props.title.replaceAll('-', ' ') ?? 'No Name Johns'}}</div>
    <div class="text-center p-1 font-bold text-2xl">GROUP LEAD: {{ finalLead }}</div>
    <div v-if="userList.length >= 1" class="text-center p-1 font-bold text-lg">Members: <span class="px-1 text-wrap text-lg" v-for="(item, index) in userList">
      {{item}}<span v-if="index < userList.length - 1">, </span><!--DO NOT RENDER THE COMMA IF INDEX IS LESS THAN MAX-->
    </span></div>
    <div v-if="permittedRoles.length >= 1" class="text-center p-1 font-bold text-xl">Permitted Roles: <span class="px-1 text-wrap text-lg" v-for="(item, index) in permittedRoles">
      {{item}}<span v-if="index < permittedRoles.length - 1">, </span><!--DO NOT RENDER THE COMMA IF INDEX IS LESS THAN MAX-->
    </span></div>
  <div class="flex flex-col">
    <button
            @click="editGroup"
            class="m-1 px-4 py-2 bg-sky-100 rounded hover:bg-sky-200 hover:border-synsyl-darkgreen border-2 border-transparent font-bold"
          >
            Edit group
          </button>

    <button
          @click="deleteGroup"
          class="m-1 px-4 py-2 bg-sky-100 rounded hover:bg-sky-200 hover:border-synsyl-darkgreen border-2 border-transparent font-bold"
        >
          Delete group
        </button>
  </div>
  </div>
</template>

<script lang="ts" setup>
import type { InferSchemaType } from 'mongoose';
import type User from '~/pages/calendar/[user].vue';
type UserDoc = InferSchemaType<typeof User.schema>
const finalLead = ref('')

//doing any due to data access
const props = defineProps<{
  title: string,
  members: UserDoc[],
  lead: string,
  permittedRoles: string[],
  groupStatus: number
}>();

let userList = ref<string[]>([])


const editGroup = async () => {

}
const deleteGroup = async () => {
  
}

onMounted(async () => {
  //parse and get users
  const returnedResults: string[] = [];
  for (const member of props.members) {
    try {
      const result = await $fetch<{info: any, status: number, code: string}>(`/api/accessUser/getUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          _id: member
        })
      });
      
    console.log('made it back: ', result);
    if(result.status == 400){
      console.error(result.code)
      return 'ERROR'
    }
    var finalString: string = ''
    var fName = result.info.userInfo.fName ?? null
    var lName = result.info.userInfo.lName ?? null
    console.log('my human name is: ', fName, lName)
    if(fName){
      finalString += fName
    }
    if(lName){
      finalString += (' ' + lName)
    }
    if(!fName && !lName){
      finalString += result.info.userInfo.username
    }
    if(finalString === ''){
      finalString += 'ERROR'
    }
    returnedResults.push(finalString)
  } catch (error){
    console.error('something went wrong: ', error)
  }};
  //get grouplead 

  const result = await $fetch<{info: any, status: number, code: string}>(`/api/accessUser/getUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          _id: props.lead
        })
      });
  var finalString: string = ''
    var fName = result.info.userInfo.fName ?? null
    var lName = result.info.userInfo.lName ?? null
    console.log('my human name is: ', fName, lName)
    if(fName){
      finalString += fName
    }
    if(lName){
      finalString += (' ' + lName)
    }
    if(!fName && !lName){
      finalString += result.info.userInfo.username
    }
    if(finalString === ''){
      finalString += 'ERROR'
    }
  finalLead.value = finalString
  userList.value = returnedResults
})
</script>

<style>

</style>