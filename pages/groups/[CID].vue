<template>
  <div>
    <div class="text-center p-4 font-bold text-lg">Welcome in! What would you like to do?</div>
    <div v-if="groupStorage">
      <div v-for="group in groupStorage">
        <group-item :title="group.name" :members="group.members" :lead="group.groupLead" :permittedRoles="group.permittedRoles ?? ['all']" :status="group.groupStatus"/>
      </div>
    </div>
    <div>
      <button
            @click="createGroup"
            class="m-1 px-4 py-2 bg-sky-100 rounded hover:bg-sky-300 hover:border-black border-2 border-transparent font-bold"
          >
            Create a group
          </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Group from '~/models/Group';

const router = useRoute();
const admin = router.query.admin
const CID = router.params.CID
var groupStorage: any = ref([])

const createGroup = async () => {

}
const getGroup = async () => {
  const res = await $fetch<{groups: typeof Group[]}>(`/api/groups/getGroup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }, 
    body: JSON.stringify({
      CID: CID
    })
  })
  if(!res.groups){
    console.error('error retrieving groups!!!')
  }
  //now we have the groups, use em
  groupStorage.value = res.groups
  console.log(groupStorage.value)
}

onMounted(() => {
  getGroup()
}) 
</script>

<style>

</style>