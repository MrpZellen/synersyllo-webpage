<template>
  <div @click="optionMenu" class="flex p-3 transition delay-100 duration-300 ease-in-out bg-synsyl-lightblue/50 ml-2 mr-2 border-transparent border-3 
  hover:border-blue-200 hover:scale-105 hover:z-100 hover:bg-blue-300/75 rounded-md absolute"
  :style="{height: `calc(${(props.chunk!) /  props.hoursShown! * 100}%)`,
  width: `90%`,
  top: `calc(${(((props.hour!)+(0.1))*100)/props.hoursShown!}%)`
  }">
    <div v-if="(props.chunk!) > thresholdTime && width > 1100 && height > 600" class="flex flex-col justify-top">
      <div class="flex w-full text-center text-ellipsis overflow-hidden text-shadow-lg">{{ props.eventTitle }}</div>
      <div v-if="(props.chunk!) >= 1">
        <div :style="{fontSize: `14px`}">{{ totalLength }} hours</div>
      </div>
      <div v-if="(props.chunk!) < 1">
        <div :style="{fontSize: `14px`}">{{ totalLength }} minutes</div>
      </div>
    </div>
    <div v-else class="flex w-full flex-row pr-2 items-center justify-around">
      <div class="flex w-full text-center text-ellipsis overflow-hidden text-shadow-lg text-sm">{{ props.eventTitle }}</div>
      <div v-if="(props.chunk!) >= 1">
        <div :style="{fontSize: `10px`}">{{ totalLength }} hours</div>
      </div>
      <div v-if="(props.chunk!) < 1">
        <div :style="{fontSize: `8px`}">{{ totalLength }} min</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useWindowSize } from '@vueuse/core'

  const { width, height } = useWindowSize()
  const emitresult = defineEmits(['open-menu'])

  const optionMenu = () => {
    var resultItem = {
      eventID: props.id,
      eventTitle: props.eventTitle,
      eventDesc: props.eventDesc,
      startHour: props.hour,
      endHour: props.hour! + props.chunk!,
    }
    emitresult('open-menu', resultItem)
  }
  const thresholdTime = 1.5
  const props = defineProps({
    chunk: Number,
    hour: Number,
    id: String,
    eventCount: Number,
    eventTitle: String,
    eventDesc: String,
    hoursShown: Number
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