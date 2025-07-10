<template>
  <div class="flex p-3 bg-sky-500/50 ml-2 mr-2 border-transparent border-3 hover:border-sky-500 rounded-md absolute"
  :style="{height: `calc(${(props.chunk!) / 12 * 100}%)`,
  width: `90%`,
  top: `calc(${(((props.hour!)+(0.1))*100)/12}%)`
  }">
    <div v-if="(props.chunk!) >= thresholdTime && width > 1100 && height > 600" class="flex flex-col justify-top">
      <div class="flex w-full text-center truncate text-ellipsis text-shadow-lg">{{ props.eventTitle }}</div>
      <div v-if="(props.chunk!) >= 1">
        <div class="text-xs">{{ totalLength }} hours</div>
      </div>
      <div v-if="(props.chunk!) < 1">
        <div class="text-xs">{{ totalLength }} minutes</div>
      </div>
    </div>
    <div v-else class="flex w-full flex-row pr-2 items-center justify-around">
      <div class="flex w-2/3 truncate text-center text-sm overflow-hidden text-ellipsis text-shadow-lg">{{ props.eventTitle }}</div>
      <div v-if="(props.chunk!) >= 1">
        <div class="text-xs">{{ totalLength }} hours</div>
      </div>
      <div v-if="(props.chunk!) < 1">
        <div class="text-xs">{{ totalLength }} min</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useWindowSize } from '@vueuse/core'

  const { width, height } = useWindowSize()
  const thresholdTime = 1
  const props = defineProps({
    chunk: Number,
    hour: Number,
    eventCount: Number,
    eventTitle: String,
  })
  var totalLength: Number; //defaults to 1 hour
  if (props.chunk! >= 1){
    totalLength = props.chunk!
  } else {
    totalLength = 60 * props.chunk!
  }
</script>

<style>

</style>