 <template>
  <div class="head" style="position: fixed; top: 0; left: 50%; transform: translateX(-50%); width: 200px">
    <h1 style="text-align: center">即时聊天 Test</h1>
    <h1 style="font-size: 20px; text-align: center">当前在线人数 {{ connectionCount }}</h1>
  </div>
  <div id="test">
    <ul ref="messageList" style="overflow-y: auto; max-height: 65vh;padding: 0;">
      <li v-for="(msg, index) in messages" :key="index" style="height: 40px;background-color: skyblue;line-height: 40px;width: 15vw;margin: 0 auto;margin-bottom: 20px;">{{ msg }}</li>
    </ul>
  </div>
  <div class="inputValue">
    <input v-model="message" placeholder="Enter message" @keydown.enter.prevent="sendMessage" />
    <button @click="sendMessage">发送</button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { io } from 'socket.io-client'

const socket = ref(null)
const message = ref('')
const messages = ref([])
const connectionCount = ref(0)
const messageList = ref(null)
let userId = localStorage.getItem('userId')
if (!userId) {
  userId = 'user_' + Math.random().toString(36).substr(2, 9)
  localStorage.setItem('userId', userId)
}
// 连接时发送这个 userId

const sendMessage = () => {
  if (message.value) {
    socket.value.emit('message', message.value)
    ;(message.value = ''),
      // 发送消息后滚动到最底部
      nextTick(() => {
        if (messageList.value) {
          messageList.value.scrollTop = messageList.value.scrollHeight // 向下滚动到最新消息
        }
      })
  }
}
// 监视 messages 的变化
watch(messages, newMessages => {
  console.log('Messages updated:', newMessages) // 确认 watch 被触发
  // 在 DOM 更新后滚动到最后一个元素
  nextTick(() => {
    if (messages.value) {
      messageList.value.scrollTop = messageList.value.scrollHeight
    }
  })
})
onMounted(() => {
  console.log(messageList.value)
  ;(socket.value = io(import.meta.env.VITE_WebSocket_API)),
    {
      query: {
        userId: userId
      }
    }
  socket.value.on('connect', () => {
    console.log('Connected to WebSocket server')
    // 当连接建立后，发送join事件获取历史消息
    socket.value.emit('join')
  })
  socket.value.on('message', msg => {
    messages.value.push(msg)
    // 接收到新消息后滚动到最底部
    nextTick(() => {
      if (messageList.value) {
        messageList.value.scrollTop = messageList.value.scrollHeight // 向下滚动到最新消息
      }
    })
  })
  socket.value.on('connectionCount', count => {
    connectionCount.value = count
  })
  socket.value.on('history', historyMsgs => {
    // 加载历史消息
    messages.value = historyMsgs.reverse()
  })
  socket.value.on('disconnect', () => {
    console.log('Disconnected from WebSocket server')
  })
})
</script>

<style scoped>
#test {
  /* height: 65vh; */
  /* overflow-y: auto; 只在需要时显示垂直滚动条 */
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 150px;
}
.inputValue {

  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}
.inputValue input {
  width: 30vw;
  height: 10vh;
  height: 40px;
  border-radius: 5px;
  border: 2px solid #EDF2FA;
}
input:focus {
  outline: none; /* 去掉默认的焦点边框 */
  box-shadow: none; /* 如果有的话，移除box-shadow效果 */
}
button {
  width: 70px;
  height: 40px;
  color: #fff;
  background-color: green;
  /* border: 1px solid green */
  margin-left: 10px;
  border-radius: 5px;
}
</style>
<!-- <template>
  <el-container style="height: 100vh">
    <el-header>
      <h1 style="text-align: center; margin: 0">即时聊天</h1>
      <h3 style="text-align: center">当前在线人数: {{ connectionCount }}</h3>
    </el-header>
    <el-main>
      <el-scrollbar ref="messageList" style="max-height: calc(100vh - 120px);overflow-y: auto;">
        <el-card v-for="(msg, index) in messages" :key="index" class="message-card">
          <p>{{ msg }}</p>
        </el-card>
      </el-scrollbar>
    </el-main>
    <el-footer>
      <el-input v-model="message" placeholder="输入消息..." @keydown.enter.prevent="sendMessage" clearable>
        <template #append>
          <el-button type="primary" @click="sendMessage">发送</el-button>
        </template>
      </el-input>
    </el-footer>
  </el-container>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { io } from 'socket.io-client'

const socket = ref(null)
const message = ref('')
const messages = ref([])
const connectionCount = ref(0)
const messageList = ref(null)
let userId = localStorage.getItem('userId')
if (!userId) {
  userId = 'user_' + Math.random().toString(36).substr(2, 9)
  localStorage.setItem('userId', userId)
}
// 连接时发送这个 userId

const sendMessage = () => {
  if (message.value) {
    socket.value.emit('message', message.value)
    ;(message.value = ''),
      // 发送消息后滚动到最底部
      nextTick(() => {
        if (messageList.value) {
          messageList.value.scrollTop = messageList.value.scrollHeight // 向下滚动到最新消息
        }
      })
  }
}
// 监视 messages 的变化
watch(messages, newMessages => {
  console.log('Messages updated:', newMessages) // 确认 watch 被触发
  // 在 DOM 更新后滚动到最后一个元素
  nextTick(() => {
    if (messageList.value) {
      messageList.value.scrollTop = messageList.value.scrollHeight
    }
  })
})
onMounted(() => {
  console.log(messageList.value)
  ;(socket.value = io(import.meta.env.VITE_WebSocket_API)),
    {
      query: {
        userId: userId
      }
    }
  socket.value.on('connect', () => {
    console.log('Connected to WebSocket server')
    // 当连接建立后，发送join事件获取历史消息
    socket.value.emit('join')
  })
  socket.value.on('message', msg => {
    messages.value.push(msg)
    // 接收到新消息后滚动到最底部
    nextTick(() => {
      if (messageList.value) {
        messageList.value.scrollTop = messageList.value.scrollHeight // 向下滚动到最新消息
      }
    })
  })
  socket.value.on('connectionCount', count => {
    connectionCount.value = count
  })
  socket.value.on('history', historyMsgs => {
    // 加载历史消息
    messages.value = historyMsgs.reverse()
  })
  socket.value.on('disconnect', () => {
    console.log('Disconnected from WebSocket server')
  })
})
</script>

<style>
.message-card {
  margin: 10px 0;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style> -->
<!-- <template>
  <el-container style="height: 100vh">
    <el-header>
      <h1 style="text-align: center; margin: 0">即时聊天</h1>
      <h3 style="text-align: center">当前在线人数: {{ connectionCount }}</h3>
    </el-header>
    <el-main>
      <el-scrollbar ref="messageList" style="max-height: calc(100vh - 120px); overflow-y: auto">
        <div class="message-container">
          <el-card v-for="(msg, index) in messages" :key="index" class="message-card">
            <p>{{ msg }}</p>
          </el-card>
        </div>
      </el-scrollbar>
    </el-main>
    <el-footer>
      <el-input v-model="message" placeholder="输入消息..." @keydown.enter.prevent="sendMessage" clearable>
        <template #append>
          <el-button type="primary" @click="sendMessage">发送</el-button>
        </template>
      </el-input>
    </el-footer>
  </el-container>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { io } from 'socket.io-client'

const socket = ref(null)
const message = ref('')
const messages = ref([])
const connectionCount = ref(0)
const messageList = ref(null)
let userId = localStorage.getItem('userId')
if (!userId) {
  userId = 'user_' + Math.random().toString(36).substr(2, 9)
  localStorage.setItem('userId', userId)
}
// 连接时发送这个 userId

const sendMessage = () => {
  if (message.value) {
    socket.value.emit('message', message.value)
    ;(message.value = ''),
      // 发送消息后滚动到最底部
      nextTick(() => {
        if (messageList.value) {
          messageList.value.scrollTop = messageList.value.scrollHeight // 向下滚动到最新消息
        }
      })
  }
}
// 监视 messages 的变化
watch(messages, newMessages => {
  console.log('Messages updated:', newMessages) // 确认 watch 被触发
  // 在 DOM 更新后滚动到最后一个元素
  nextTick(() => {
    if (messages.value) {
      messageList.value.scrollTop = messageList.value.scrollHeight
    }
  })
})
onMounted(() => {
  console.log(messageList.value)
  ;(socket.value = io(import.meta.env.VITE_WebSocket_API)),
    {
      query: {
        userId: userId
      }
    }
  socket.value.on('connect', () => {
    console.log('Connected to WebSocket server')
    // 当连接建立后，发送join事件获取历史消息
    socket.value.emit('join')
  })
  socket.value.on('message', msg => {
    messages.value.push(msg)
    // 接收到新消息后滚动到最底部
    nextTick(() => {
      if (messageList.value) {
        messageList.value.scrollTop = messageList.value.scrollHeight // 向下滚动到最新消息
      }
    })
  })
  socket.value.on('connectionCount', count => {
    connectionCount.value = count
  })
  socket.value.on('history', historyMsgs => {
    // 加载历史消息
    messages.value = historyMsgs.reverse()
  })
  socket.value.on('disconnect', () => {
    console.log('Disconnected from WebSocket server')
  })
})
</script>

<style>
.message-container {
  display: flex;
  flex-direction: column;
}

.message-card {
  margin: 5px 0; /* 增加消息之间的间距 */
}
</style> -->
