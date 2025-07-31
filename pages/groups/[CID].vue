<template>
  <div>
    <div class="text-center p-7 font-bold text-4xl">Welcome in {{ admin }}! Manage your groups:</div>
    <div v-if="openAddWindow == true"
      class="absolute z-50 p-5 top-2/10 left-4/10 min-w-[250px] min-h-[400px] rounded-sm bg-synsyl-lightblue border-2 border-synsyl-nilbog shadow-lg">
      <div v-if="!goodFields" class="text-red-500 text-md font-bold">please input all fields!</div>
      <div class="text-2xl p-2">
        Group Name: <input v-model="groupVars.name" />
      </div>
      <div class="text-2xl p-2">
        Group Leader: <input v-model="groupVars.groupLead"/>
      </div>
      <div class="flex flex-col text-xl p-2">
        List your members (separated by commas!):
        <textarea class="border-2 border-synsyl-darkgreen my-1 p-1 h-[100px]"
          v-model="groupVars.members"
          placeholder="enter members..."
        />
      </div>
      <div class="flex flex-col text-xl p-2">
        Any permitted Roles?
        <textarea class="border-2 border-synsyl-darkgreen my-1 p-1 h-[100px]"
          v-model="groupVars.permittedRoles"
          placeholder="If left empty, any will be assumed ok!"
        />
      </div>
      <div class="text-md p-2 flex flex-col">
        <div>Would you like to add additional Questions??
          <input type="checkbox" v-model="additionalSelection"/>
          <div v-if="additionalSelection">
            <button v-if="!groupVars.surveyAdditions?.length || groupVars.surveyAdditions.length < 31"
                  @click="upClick"
                  class="m-1 px-4 py-2 bg-sky-100 rounded hover:bg-sky-200 hover:border-synsyl-darkgreen border-2 border-transparent font-bold"
                >
                  Add Question
                </button>
            <div v-for="(newQuestion, index) in groupVars.surveyAdditions" :key="index">
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
                    <div v-for="(newResponse, respIndex) in groupVars.surveyAdditions![index].responses" :key="respIndex">
                      <input type="text"
                      v-model="newResponse[respIndex]"
                      :name="`newResponse-${respIndex}`"
                      class="p-1 text-sm border-1 border-synsyl-darkgreen"
                      placeholder="add response...." >
                      <button v-if="groupVars.surveyAdditions![index].responses?.length! > 1" @click="responseRemove(index)"
                        class="m-1 text-xs px-4 py-2 bg-sky-100 rounded hover:bg-sky-200 hover:border-synsyl-darkgreen border-2 border-transparent font-bold"
                      >
                        Remove Response
                      </button>
                    </div>
                  </div>
            <button v-if="groupVars.surveyAdditions?.length"
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
            @click="createGroup"
            class="m-1 px-4 py-2 bg-sky-100 rounded hover:bg-sky-200 hover:border-synsyl-darkgreen border-2 border-transparent font-bold"
          >
            Add Group
          </button>
    </div>


    <div class="flex flex-grow justify-center self-end">
      <button
            @click="openWindow"
            class="m-1 px-7 py-3 min-w-100 bg-sky-100 rounded hover:bg-sky-200 hover:border-synsyl-darkgreen border-2 border-synsyl-nilbog font-bold text-2xl"
          >
            Create a group
          </button>
    </div>
    <div v-if="groupStorage">
      <div class="grid grid-cols-4 m-4" v-for="(group) in groups">
        <group-item class="p-5" :title="group.name" :members="group.members" :lead="group.groupLead?.toString()" :permittedRoles="group.permittedRoles ?? ['all']" :groupStatus="group.GroupStatus!"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Group from '~/models/Group';
import { ObjectId } from 'bson';
import { generateRandomID } from '~/server/utils/stringGenerator';
import type { InferSchemaType } from 'mongoose';
import type { GroupType } from '~/models/GroupInterface';
//defined a type for my Group schema, more efficient and clean
console.log('reached page /groups')
const router = useRoute();
const admin = router.query.username
const CID = router.params.CID
var groupStorage = ref<GroupType[]>([])
const groups = computed(() => groupStorage.value);

const additionalSelection = ref(false)
const openAddWindow = ref(false)
const goodFields = ref(true)
const openWindow = () => {
  openAddWindow.value = true;
  console.log("hit");
};
const closeWindow = () => {
  openAddWindow.value = false;
  console.log('hit')
}

const groupVars = reactive<{
  name: string | null;
  members: string;
  permittedRoles: string[];
  groupLead: string;
  groupStatus: number;
  surveyAdditions: {
    qType: 'choice' | 'multiplechoice' | 'slider';
    question: string;
    responses: string[] | null;
  }[] | null; //choice required IF adding a survey addition, and string as a key is the added question.
}>({
  name: null,
  members: '',
  permittedRoles: [],
  groupLead: '',
  groupStatus: 3,
  surveyAdditions: [{
    qType: 'choice',
    question: '',
    responses: ['']
  }]
});

const createGroup = async () => {
  console.log('creating a group!')
  //first, parse users input into actual members:
  const resultMemberIDS = await Promise.all(groupVars.members.replaceAll(' ', '').split(',').map(async (member, index) => { //regex splits on NEW LINE AND COMMA
    //WE NEED TO GET ALL MEMBERS BACK AS ID's
    const memberID = await $fetch<{info: any}>('/api/accessUser/getUserByUsername', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: member
      })
    })
    return await memberID.info!._id
  }));
  if(!resultMemberIDS){
    console.error('issue getting memberIDS!')
  }

  console.log('searching for our lead now!')
  const resultOfLeadUser = await $fetch<{info: any}>('/api/accessUser/getUserByUsername', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: groupVars.groupLead[0]
    })
  })
  if(!resultOfLeadUser){
    console.error('something went wrong! leadUser not found')
  }
  console.log('resultOfLeadUser: ', resultOfLeadUser)
  let leadUser = await (resultOfLeadUser).info._id
  const res = await $fetch<{group: typeof Group}>(`/api/groups/createGroup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }, 
    body: JSON.stringify({
      admin: admin,
      newGroup: {
        CID: CID,
        name: groupVars.name ?? `default`,
        members: resultMemberIDS,
        permittedRoles: groupVars.permittedRoles,
        groupLead: [leadUser],
        BobID: 'BOB-' + generateRandomID(9), //generate a BOB ID TODO: create the bob instance in company, tie it to that
        GroupStatus: groupVars.groupStatus,
        surveyAdditions: groupVars.surveyAdditions?.map(surveyItem => ({
          qType: surveyItem.qType,
          question: surveyItem.question,
          responses: surveyItem.qType === "slider" ? undefined : surveyItem.responses
        })) ?? undefined
      }
    })
  })
  if(!res.group){
    console.error('error making the new group!!!')
  } else {
    console.log('group created successfully!!')
    groupStorage.value.push(res.group)
  }
  openAddWindow.value = false;
  console.log('hit')
}
const getGroup = async () => {
  const res = await $fetch<{groups: GroupType[]}>(`/api/groups/getGroup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }, 
    body: JSON.stringify({
      CID: CID,
      admin: admin
    })
  })
  if(!res.groups){
    console.error('error retrieving groups!!!')
  }
  //now we have the groups, use em
  groupStorage.value = res.groups

}


//HANDLING CLICK FOR EVENT ADDITION
const upClick = () => {
  if (!groupVars.surveyAdditions) {
    groupVars.surveyAdditions = [];
  }
  groupVars.surveyAdditions.push({
    qType: 'choice',
    question: '',
    responses: null
  });
  console.log('how many?????, ', groupVars.surveyAdditions.length);
};
const downClick = () => {
  if (groupVars.surveyAdditions && groupVars.surveyAdditions.length > 0) {
    groupVars.surveyAdditions.pop();
  }
  console.log('i wonder how many, ', groupVars.surveyAdditions?.length);
};

//HANDLING CLICK FOR RESPONSE ADDITION
const responseAdd = (ourCurrentSurveyNumber: number) => {
  if ((groupVars.surveyAdditions![ourCurrentSurveyNumber].responses!.length <= 12)) { //max of 12 responses
    groupVars.surveyAdditions![ourCurrentSurveyNumber].responses!.push('');
    //CHUNKY AS HELL, but multiple non-nulls assumed as variables must exist at this point, else lets return an error
  } else {
    console.error('CANT REMOVE THIS RESPONSE')
  }
  console.log('i wonder how many, ', groupVars.surveyAdditions);
};
const responseRemove = (ourCurrentSurveyNumber: number) => {
  if (groupVars.surveyAdditions![ourCurrentSurveyNumber].responses!.length > 1) { //must have at least 1 selectable response
    groupVars.surveyAdditions![ourCurrentSurveyNumber].responses!.pop();
    //CHUNKY AS HELL, but multiple non-nulls assumed as variables must exist at this point, else lets return an error
  } else {
    console.error('CANT REMOVE THIS RESPONSE')
  }
  console.log('i wonder how many, ', groupVars.surveyAdditions);
};

onMounted(async () => {
  await getGroup()
  console.log('OUR GROUP STORED: ', groups, groups.value)
}) 
</script>

<style>

</style>