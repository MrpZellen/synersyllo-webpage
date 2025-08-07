<template>
  <div v-if="isAdmin" class="flex flex-col content-center bg-funkygreen hover:border-synsyl-darkgreen border-6 border-transparent rounded">
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
            @click="() => {openEditMenu = true}"
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

  <div v-if="openEditMenu == true"
      class="absolute z-50 p-5 top-2/10 left-4/10 min-w-[250px] min-h-[400px] rounded-sm bg-synsyl-lightblue border-2 border-synsyl-nilbog shadow-lg">
      <div class="text-2xl p-2">
        Change Name: <input v-model="editVars.name" />
      </div>
      <div class="text-2xl p-2">
        Change Leader: <input v-model="editVars.groupLead"/>
      </div>
      <div class="flex flex-col text-xl p-2">
        Add members (separated by commas!):
        <textarea class="border-2 border-synsyl-darkgreen my-1 p-1 h-[100px]"
          v-model="editVars.addMem"
          placeholder="enter members..."
        />
      </div>
      <div class="flex flex-col text-xl p-2">
        Remove members (separated by commas!):
        <textarea class="border-2 border-synsyl-darkgreen my-1 p-1 h-[100px]"
          v-model="editVars.remMem"
          placeholder="enter members..."
        />
      </div>
      <div class="flex flex-col text-xl p-2">
        Add Roles
        <textarea class="border-2 border-synsyl-darkgreen my-1 p-1 h-[100px]"
          v-model="editVars.addRoles"
          placeholder="If left empty, any will be assumed ok!"
        />
      </div>
      <div class="flex flex-col text-xl p-2">
        Remove Roles
        <textarea class="border-2 border-synsyl-darkgreen my-1 p-1 h-[100px]"
          v-model="editVars.remRoles"
          placeholder="If left empty, any will be assumed ok!"
        />
      </div>
      <div class="text-md p-2 flex flex-col">
        <div>Would you like to add additional Questions??
          <input type="checkbox" v-model="additionalSelection"/>
          <div v-if="additionalSelection">
            <button v-if="!editVars.surveyAdditions?.length || editVars.surveyAdditions.length < 31"
                  @click="upClick"
                  class="m-1 px-4 py-2 bg-sky-100 rounded hover:bg-sky-200 hover:border-synsyl-darkgreen border-2 border-transparent font-bold"
                >
                  Add Question
                </button>
            <div v-for="(newQuestion, index) in editVars.surveyAdditions" :key="index">
                <div class="font-bold py-2">
                  Input Type: 
                  <div>
                    choice 
                    <input 
                      type="radio" 
                      :name="`newQuestion-${index}`"
                      value="choice" 
                      v-model="newQuestion.qType" 
                    />
                  </div>
                  <div>
                    multiple choice 
                    <input 
                      type="radio" 
                      :name="`newQuestion-${index}`"
                      value="multiplechoice" 
                      v-model="newQuestion.qType" 
                    />
                  </div>
                  <div>
                    slider 
                    <input 
                      type="radio" 
                      :name="`newQuestion-${index}`"
                      value="slider" 
                      v-model="newQuestion.qType" 
                    />
                  </div>
                  <div class="mt-2">
                      The Question: 
                      <input 
                        type="text" 
                        v-model="newQuestion.question" 
                        class="border-2 border-synsyl-darkgreen p-1"
                        placeholder="question here...."
                      />
                    </div>
                  </div>
                  <div class="mt-2" v-if="!(newQuestion.qType === 'slider')">
                    <button @click="responseAdd(index)"
                  class="m-1 text-xs px-4 py-2 bg-sky-100 rounded hover:bg-sky-200 hover:border-synsyl-darkgreen border-2 border-transparent font-bold"
                >
                  Add Response
                </button>
                    <div v-for="(newResponse, respIndex) in editVars.surveyAdditions![index].responses" :key="respIndex">
                      <input type="text"
                      v-model="newResponse[respIndex]"
                      :name="`newResponse-${respIndex}`"
                      class="p-1 text-sm border-1 border-synsyl-darkgreen"
                      placeholder="add response...." >
                      <button v-if="editVars.surveyAdditions![index].responses?.length! > 1" @click="responseRemove(index)"
                        class="m-1 text-xs px-4 py-2 bg-sky-100 rounded hover:bg-sky-200 hover:border-synsyl-darkgreen border-2 border-transparent font-bold"
                      >
                        Remove Response
                      </button>
                    </div>
                  </div>
            <button v-if="editVars.surveyAdditions?.length"
                  @click="downClick"
                  class="m-1 px-4 py-2 bg-sky-100 rounded hover:bg-sky-200 hover:border-synsyl-darkgreen border-2 border-transparent font-bold"
                >
                  Remove Question
                </button>
            </div>
          </div>
        </div>
      </div>
      <button
            @click="closeWindow"
            class="m-1 px-4 py-2 bg-sky-100 rounded hover:bg-sky-200 hover:border-synsyl-darkgreen border-2 border-transparent font-bold"
          >
            Back
          </button>
      <button
            @click="editGroup"
            class="m-1 px-4 py-2 bg-sky-100 rounded hover:bg-sky-200 hover:border-synsyl-darkgreen border-2 border-transparent font-bold"
          >
            Finalize
          </button>
      </div>
  </div>
  <div v-if="!isAdmin" class="flex flex-col content-center bg-funkygreen hover:border-synsyl-darkgreen border-6 border-transparent rounded">
    <div class="text-center p-1 font-bold text-3xl">{{props.title.replaceAll('-', ' ') ?? 'No Name Johns'}}</div>
    <div class="text-center p-1 font-bold text-2xl">GROUP LEAD: {{ finalLead }}</div>
    <div v-if="userList.length >= 1" class="text-center p-1 font-bold text-lg">Members: <span class="px-1 text-wrap text-lg" v-for="(item, index) in userList">
      {{item}}<span v-if="index < userList.length - 1">, </span><!--DO NOT RENDER THE COMMA IF INDEX IS LESS THAN MAX-->
    </span></div>
    <div v-if="permittedRoles.length >= 1" class="text-center p-1 font-bold text-xl">Permitted Roles: <span class="px-1 text-wrap text-lg" v-for="(item, index) in permittedRoles">
      {{item}}<span v-if="index < permittedRoles.length - 1">, </span><!--DO NOT RENDER THE COMMA IF INDEX IS LESS THAN MAX-->
    </span></div>
  </div>
</template>

<script lang="ts" setup>
import type { InferSchemaType } from 'mongoose';
import type User from '~/pages/calendar/[user].vue';
type UserDoc = InferSchemaType<typeof User.schema>
const finalLead = ref('')
const additionalSelection = ref(false)

//doing any due to data access
const props = defineProps<{
  isAdmin: boolean,
  adminOfPage: string,
  groupID: string,
  title: string,
  members: UserDoc[],
  lead: string,
  permittedRoles: string[],
  groupStatus: number,
  currentSurveyItems: any
}>();

const editVars = reactive<{
  name: string,
  groupLead: string,
  addMem: string,
  remMem: string,
  addRoles: string,
  remRoles: string,
  surveyAdditions: any
}>({
  name: props.title,
  groupLead: '',
  addMem: '',
  remMem: '',
  addRoles: '',
  remRoles: '',
  surveyAdditions: props.currentSurveyItems
});

let userList = ref<string[]>([])

const openEditMenu = ref(false)

const editGroup = async () => {
  const result = await $fetch<{info: any, status: number, code: string}>('/api/groups/editGroups', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }, 
    body: {
      updatedGroup: editVars,
      GID: props.groupID
    }
  })
  if(result.status === 400){
    console.error('problem deleting group!!!!')
  } else {
    console.log('group deleted successfully')
    closeWindow()
    reloadNuxtApp()
  }
}
const deleteGroup = async () => {
  const result = await $fetch<{info: any, status: number, code: string}>(`/api/groups/deleteGroups`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      gid: props.groupID,
      admin: props.adminOfPage
    })
  })
  if(result.status === 400){
    console.error('problem deleting group!!!!')
  } else {
    console.log('group deleted successfully')
    reloadNuxtApp()
  }
}
const closeWindow = () => {
  openEditMenu.value = false;
  console.log('hit')
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

//HANDLING CLICK FOR EVENT ADDITION
const upClick = () => {
  if (!editVars.surveyAdditions) {
    editVars.surveyAdditions = [];
  }
  editVars.surveyAdditions.push({
    qType: 'choice',
    question: '',
    responses: null
  });
  console.log('how many?????, ', editVars.surveyAdditions.length);
};
const downClick = () => {
  if (editVars.surveyAdditions && editVars.surveyAdditions.length > 0) {
    editVars.surveyAdditions.pop();
  }
  console.log('i wonder how many, ', editVars.surveyAdditions?.length);
};

//HANDLING CLICK FOR RESPONSE ADDITION
const responseAdd = (ourCurrentSurveyNumber: number) => {
  if ((editVars.surveyAdditions![ourCurrentSurveyNumber].responses!.length <= 12)) { //max of 12 responses
    editVars.surveyAdditions![ourCurrentSurveyNumber].responses!.push('');
    //CHUNKY AS HELL, but multiple non-nulls assumed as variables must exist at this point, else lets return an error
  } else {
    console.error('CANT REMOVE THIS RESPONSE')
  }
  console.log('i wonder how many, ', editVars.surveyAdditions);
};
const responseRemove = (ourCurrentSurveyNumber: number) => {
  if (editVars.surveyAdditions![ourCurrentSurveyNumber].responses!.length > 1) { //must have at least 1 selectable response
    editVars.surveyAdditions![ourCurrentSurveyNumber].responses!.pop();
    //CHUNKY AS HELL, but multiple non-nulls assumed as variables must exist at this point, else lets return an error
  } else {
    console.error('CANT REMOVE THIS RESPONSE')
  }
  console.log('i wonder how many, ', editVars.surveyAdditions);
};
</script>

<style>

</style>