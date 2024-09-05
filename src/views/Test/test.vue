<!-- <script setup>
import Login from "@/components/login/Login.vue";
</script>

<template>
  <Login></Login>
</template> -->
<template>
  <div id="test">
     <h1>WebSocket Test</h1>
     <input v-model="message" placeholder="Enter message" />
     <button @click="sendMessage">Send Message</button>
     <ul>
       <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
     </ul>
  </div>
 </template>

 <script setup>
 import { ref, onMounted } from 'vue';
 import { io } from 'socket.io-client';
     const socket = ref(null);
     const message = ref('');
     const messages = ref([]);

     const sendMessage = () => {
       if (message.value) {
         socket.value.emit('message', message.value);
         message.value = '';
       }
     };
     onMounted(() => {
       socket.value = io('https://bbb.heiyu.fun/chat');
       socket.value.on('connect', () => {
         console.log('Connected to WebSocket server');
       });
       socket.value.on('message', (msg) => {
         messages.value.push(msg);
       });
       socket.value.on('disconnect', () => {
         console.log('Disconnected from WebSocket server');
       });
    });



 </script>

 <style scoped>
 #test {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
 }
 </style>
 