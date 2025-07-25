<template>
  <div>
    <div>Welcome in, {{ admin }}! What would you like to do?</div>
    <div>
      <button
            @click="addRoles"
            class="m-1 px-4 py-2 bg-sky-100 rounded hover:bg-sky-300 hover:border-black border-2 border-transparent font-bold"
          >
            Add Roles
          </button>
      <button
            @click="deleteRoles"
            class="m-1 px-4 py-2 bg-sky-100 rounded hover:bg-sky-300 hover:border-black border-2 border-transparent font-bold"
          >
            Delete Roles
          </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const router = useRoute();
const admin = router.query.admin
const CID = router.params.CID

const addRoles = () => {

}
const deleteRoles = () => {
  
}
</script>

<style>

</style>