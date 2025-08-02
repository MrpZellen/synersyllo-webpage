<template>
  <div v-if="!isLoading">
  <div v-if="!isValidLogin" class="text-red-500 flex flex-grow place-content-center items-center">
    <div class="text-start p-7 font-bold text-4xl flex flex-col">Sorry but you cannot access this page.
    <div class="text-start font-bold text-4xl"> This is due to one of the following: </div>
      <div class="text-start p-7 font-bold text-2xl"> - Wrong CID or User. </div>      
      <div class="text-start p-7 font-bold text-2xl"> - You are not logged in. </div>
      <div class="text-start p-7 font-bold text-2xl"> - You are not permitted to view this page. </div>
    </div>
    
  </div>
  <div v-if="isValidLogin">
    <div class="text-center p-7 font-bold text-4xl">{{ user }}'s groups:</div>
    <div v-if="groupStorage" class="m-5 grid grid-cols-4 row-auto gap-4">
      <div v-for="(group) in groups">
        <group-item class="p-5" :isAdmin="false" :adminOfPage="String(user)" :groupID="group.GID" :title="group.name" :members="group.members" :lead="group.groupLead?.toString()" :permittedRoles="group.permittedRoles ?? ['all']" :groupStatus="group.GroupStatus!"/>
      </div>
    </div>
  </div>
  </div>
</template>

<script lang="ts" setup>
import type { GroupType } from '~/models/GroupInterface'

const router = useRoute()
const user =  router.params.user

const isLoggedIn = ref(false)
const username = ref('')
const CID = ref('')
const isLoading = ref(true)

var groupStorage = ref<GroupType[]>([])
const groups = computed(() => groupStorage.value);

const isValidLogin = ref(false)

const getGroup = async () => {
  const res = await $fetch<{groups: GroupType[], status: number}>(`/api/groups/getGroup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }, 
    body: JSON.stringify({
      CID: CID.value,
      admin: user,
      isAdmin: false
    })
  })
  if(res.status === 400){
    console.error('error retrieving groups!!!')
  }
  //now we have the groups, use em
  groupStorage.value = res.groups
  reloadNuxtApp();
}

onMounted(async () => {
  const res = await $fetch<{ isLoggedIn: boolean, cid: string, username: string }>('/api/checkLoginStatus')
  isLoggedIn.value = res.isLoggedIn
  username.value = res.username
  CID.value = res.cid
  console.log('is logged in: ', res.isLoggedIn)
  
  getGroup()

  if (!isLoggedIn || username.value !== user){
    console.log('login: ', isLoggedIn, ' user values: ', username.value, user)
    isValidLogin.value = false
  } else {
    isValidLogin.value = true
  }
  isLoading.value = false
  })
</script>

<style>

</style>