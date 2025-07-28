<template>
  <div>
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
</template>

<script lang="ts" setup>

const editGroup = async () => {

}
const deleteGroup = async () => {
  
}
</script>

<style>

</style>