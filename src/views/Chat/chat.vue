<template>
  <div
    class="chat-container"
    :style="{
      left: position.x + 'px',
      top: position.y + 'px',
      width: size.width + 'px',
      height: size.height + 'px'
    }"
    :class="{ dragging: isDragging, resizing: isResizing }"
    ref="chatContainer"
  >
    <div class="chat-header" @mousedown="startDrag">
      <div class="header-left">
        <h2>Chat Room</h2>
        <div class="online-count">
          <i class="fas fa-users"></i>
          {{ onlineCount }} online
        </div>
      </div>
      <div class="online-status">
        <span class="status-dot" :class="{ online: isConnected }"></span>
        {{ isConnected ? 'Online' : 'Connecting...' }}
      </div>
    </div>

    <div class="chat-messages" ref="messageContainer">
      <div v-for="(message, index) in messages" :key="index" class="message-wrapper" :class="{ 'my-message': message.user === currentUser }">
        <div class="avatar">
          <img :src="getAvatarUrl(message.user)" :alt="message.user" />
        </div>
        <div class="message">
          <div class="message-header">
            <span class="username">{{ message.user }}</span>
            <span class="time">{{ formatTime(message.timestamp) }}</span>
          </div>
          <div class="message-content">
            {{ message.text }}
          </div>
        </div>
      </div>
    </div>

    <div class="chat-input">
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." :disabled="!isConnected" />
      <button @click="sendMessage" :disabled="!isConnected">Send</button>
    </div>

    <div class="resize-handle" @mousedown.stop="startResize" @dblclick="resetSize"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { io } from 'socket.io-client'

const socket = io(import.meta.env.VITE_WebSocket_API, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
})

// 聊天相关的状态
const messages = ref([])
const newMessage = ref('')
const messageContainer = ref(null)
const isConnected = ref(false)
const currentUser = ref(`User_${Math.floor(Math.random() * 1000)}`)
const onlineCount = ref(0)

// 拖动相关的状态
const chatContainer = ref(null)
const position = ref({ x: 20, y: 20 })
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })

// 调整大小相关的状态
const size = ref({ width: 800, height: 600 })
const isResizing = ref(false)
const resizeStart = ref({ x: 0, y: 0, width: 0, height: 0 })

// 最小尺寸限制
const MIN_WIDTH = 400
const MIN_HEIGHT = 300

// 拖动相关的方法
const startDrag = e => {
  isDragging.value = true
  const rect = chatContainer.value.getBoundingClientRect()
  dragOffset.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
  // 添加全局事件监听
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = e => {
  if (isDragging.value) {
    const maxX = window.innerWidth - size.value.width
    const maxY = window.innerHeight - size.value.height

    position.value = {
      x: Math.min(Math.max(0, e.clientX - dragOffset.value.x), maxX),
      y: Math.min(Math.max(0, e.clientY - dragOffset.value.y), maxY)
    }
    saveState()
  }
}

const stopDrag = () => {
  isDragging.value = false
  // 移除全局事件监听
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// 调整大小相关的方法
const startResize = e => {
  isResizing.value = true
  resizeStart.value = {
    x: e.clientX,
    y: e.clientY,
    width: size.value.width,
    height: size.value.height
  }

  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
}

const onResize = e => {
  if (!isResizing.value) return

  // 计算新的宽度和高度
  const newWidth = Math.max(MIN_WIDTH, resizeStart.value.width + (e.clientX - resizeStart.value.x))
  const newHeight = Math.max(MIN_HEIGHT, resizeStart.value.height + (e.clientY - resizeStart.value.y))

  // 确保不会超出窗口边界
  const maxWidth = window.innerWidth - position.value.x
  const maxHeight = window.innerHeight - position.value.y

  size.value = {
    width: Math.min(newWidth, maxWidth),
    height: Math.min(newHeight, maxHeight)
  }
  saveState()
}

const stopResize = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
}

const resetSize = () => {
  size.value = { width: 800, height: 600 }
  saveState()
}

// 保存和恢复状态
const saveState = () => {
  localStorage.setItem(
    'chatWindowState',
    JSON.stringify({
      position: position.value,
      size: size.value
    })
  )
}

const loadState = () => {
  const savedState = localStorage.getItem('chatWindowState')
  if (savedState) {
    const state = JSON.parse(savedState)
    position.value = state.position
    size.value = state.size
  }
}

// 聊天相关的方法
const scrollToBottom = async () => {
  await nextTick()
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

const formatTime = timestamp => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const getAvatarUrl = username => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
}

const addMessage = messageData => {
  messages.value.push({
    ...messageData,
    timestamp: messageData.timestamp || new Date().toISOString()
  })
  scrollToBottom()
}

const sendMessage = () => {
  if (newMessage.value.trim() !== '') {
    const messageData = {
      user: currentUser.value,
      text: newMessage.value,
      timestamp: new Date().toISOString()
    }

    socket.emit('message', messageData)
    newMessage.value = ''
  }
}

// 初始化历史消息
const initializeHistory = (historyMessages) => {
  console.log('Initializing history messages:', historyMessages)
  messages.value = [] // 清空现有消息
  historyMessages.forEach(message => {
    addMessage(message)
  })
}

// 生命周期钩子
onMounted(() => {
  // 加载保存的状态
  loadState()

  // Socket 事件监听
  socket.on('connect', () => {
    console.log('Connected to server')
    isConnected.value = true
    // 连接成功后请求历史消息
    socket.emit('getHistory')
  })

  socket.on('disconnect', () => {
    console.log('Disconnected from server')
    isConnected.value = false
  })

  socket.on('connect_error', error => {
    console.error('Connection error:', error)
    isConnected.value = false
  })

  // 监听历史消息
  socket.on('history', (historyMessages) => {
    console.log('Received history messages:', historyMessages)
    initializeHistory(historyMessages)
  })

  socket.on('message', message => {
    console.log('Received message:', message)
    addMessage(message)
  })

  // 监听在线人数更新
  socket.on('userCount', count => {
    console.log('Online users:', count)
    onlineCount.value = count
  })

  // 错误处理
  socket.on('error', error => {
    console.error('Socket error:', error)
  })
})

onUnmounted(() => {
  // 清理所有事件监听器
  socket.off('connect')
  socket.off('disconnect')
  socket.off('connect_error')
  socket.off('message')
  socket.off('history')
  socket.off('userCount')
  socket.off('error')
  // 断开连接
  socket.disconnect()
})
</script>

<style scoped>
.chat-container {
  position: fixed;
  min-width: 400px;
  min-height: 300px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  background: #fff;
  transition: all 0.1s ease;
}

.chat-container.dragging,
.chat-container.resizing {
  transition: none;
  opacity: 0.95;
}

.chat-header {
  padding: 15px 20px;
  background: #4a90e2;
  color: white;
  border-radius: 10px 10px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
  user-select: none;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-left h2 {
  margin: 0;
  font-size: 18px;
}

.online-count {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(46, 204, 113, 0.2);
  padding: 3px 8px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.resize-handle {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 15px;
  height: 15px;
  cursor: se-resize;
  z-index: 1000;
}

.resize-handle::after {
  content: '';
  position: absolute;
  right: 4px;
  bottom: 4px;
  width: 7px;
  height: 7px;
  border-right: 2px solid #666;
  border-bottom: 2px solid #666;
}

.online-status {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
  background: #ccc;
}

.status-dot.online {
  background: #2ecc71;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f5f5f5;
  min-height: 200px;
}

.message-wrapper {
  margin-bottom: 15px;
  display: flex;
  align-items: flex-start;
}

.message-wrapper.my-message {
  justify-content: flex-end;
}

.avatar {
  width: 40px;
  height: 40px;
  margin: 0 10px;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.my-message .avatar {
  order: 1;
  margin-left: 10px;
}

.message {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 15px;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.my-message .message {
  background: #4a90e2;
  color: white;
}

.message-header {
  margin-bottom: 5px;
  font-size: 0.9em;
}

.username {
  font-weight: bold;
  margin-right: 8px;
}

.time {
  color: #888;
  font-size: 0.8em;
}

.my-message .time {
  color: rgba(255, 255, 255, 0.8);
}

.message-content {
  word-break: break-word;
  line-height: 1.4;
}

.chat-input {
  padding: 15px;
  background: white;
  border-top: 1px solid #eee;
  border-radius: 0 0 10px 10px;
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  outline: none;
}

input:focus {
  border-color: #4a90e2;
}

button {
  padding: 10px 20px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #357abd;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>