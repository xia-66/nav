<template>
  <Clock> </Clock>
  <h1 class="text-3xl font-bold  px-2">
    Hello world!
  </h1>
  <Sidebar> </Sidebar>

</template>
<script setup>
import { ref } from 'vue';
import Head from "@/views/Index/index.vue"
import Clock from '@/components/clock/Clock.vue';
import Sidebar from "@/components/sidebar/Sidebar.vue";
 // const headBgConfig = reactive({
    //   clear: true,
    //   white: false,
    //   grossGlass: false,
    // }) 
</script>


