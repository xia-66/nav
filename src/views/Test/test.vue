<!-- <script setup>
import Login from "@/components/login/Login.vue";
</script>

<template>
  <Login></Login>
</template> -->
<template>
  <div id="test">
    <h1>即时聊天 Test</h1>
    <h1 style="font-size: 20px;">当前在线人数 999</h1>
    <ul>
      <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
    </ul>
    <div class="inputValue">
      <input v-model="message" placeholder="Enter message" @keydown.enter.prevent="sendMessage"/>
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { io } from 'socket.io-client'
const socket = ref(null)
const message = ref('')
const messages = ref([])

const sendMessage = () => {
  if (message.value) {
    socket.value.emit('message', message.value)
    message.value = ''
  }
}
onMounted(() => {
  socket.value = io('https://bbb.heiyu.fun/chat')
  socket.value.on('connect', () => {
    console.log('Connected to WebSocket server')
  })
  socket.value.on('message', msg => {
    messages.value.push(msg)
  })
  socket.value.on('disconnect', () => {
    console.log('Disconnected from WebSocket server')
  })
})
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
.inputValue {
  position: fixed;
  bottom: 20px;
  left: 50%;
  translate: -50% -50%;
}
.inputValue input {
  width: 260px;
  height: 40px;
  border-radius: 5px;
  border: 1px solid skyblue;
}
input:focus {
  outline: none; /* 去掉默认的焦点边框 */
  box-shadow: none; /* 如果有的话，移除box-shadow效果 */
}
button {
  width:70px;
  height: 40px;
  background-color: green;
  /* border: 1px solid green */
  margin-left: 10px;
  border-radius: 5px;
}
</style>
