<template>
  <div>
    <div class="text-center p-4 font-bold text-lg">Welcome in, {{ admin }}! What would you like to do?</div>
    <div>
      <button
            @click="createGroup"
            class="m-1 px-4 py-2 bg-sky-100 rounded hover:bg-sky-300 hover:border-black border-2 border-transparent font-bold"
          >
            Create a group
          </button>
      <button
            @click="editGroup"
            class="m-1 px-4 py-2 bg-sky-100 rounded hover:bg-sky-300 hover:border-black border-2 border-transparent font-bold"
          >
            Edit a group
          </button>
      <button
            @click="deleteGroup"
            class="m-1 px-4 py-2 bg-sky-100 rounded hover:bg-sky-300 hover:border-black border-2 border-transparent font-bold"
          >
            Delete a group
          </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const router = useRoute();
const admin = router.query.admin
const CID = router.params.CID

const createGroup = () => {

}
const editGroup = () => {

}
const deleteGroup = () => {
  
}
</script>

<style>

</style>