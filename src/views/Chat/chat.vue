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

    <div class="resize-handle" @mousedown.stop="startResize" @dblclick="resetSize" v-if="!isMobileDevice"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { io } from 'socket.io-client'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

// 生成用户ID的函数
const generateUserId = async () => {
  const savedUserId = localStorage.getItem('chatUserId')
  if (savedUserId) {
    return savedUserId
  }

  try {
    const fp = await FingerprintJS.load()
    const result = await fp.get()

    const deviceInfo = {
      platform: navigator.platform,
      userAgent: navigator.userAgent,
      fingerprint: result.visitorId,
      timestamp: new Date().getTime()
    }

    const userId = `User_${btoa(JSON.stringify(deviceInfo)).slice(0, 8)}`
    localStorage.setItem('chatUserId', userId)
    return userId
  } catch (error) {
    console.error('Error generating user ID:', error)
    return `User_${Math.floor(Math.random() * 1000)}`
  }
}

// Socket 连接
const socket = io(import.meta.env.VITE_WebSocket_API, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
})

// 状态管理
const messages = ref([])
const newMessage = ref('')
const messageContainer = ref(null)
const isConnected = ref(false)
const currentUser = ref('')
const onlineCount = ref(0)
const isMobileDevice = ref(false)

// 拖动状态
const chatContainer = ref(null)
const position = ref({ x: 20, y: 20 })
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })

// 大小调整状态
const size = ref({ width: 800, height: 600 })
const isResizing = ref(false)
const resizeStart = ref({ x: 0, y: 0, width: 0, height: 0 })

// 常量
const MIN_WIDTH = 400
const MIN_HEIGHT = 300

// 检测是否为移动设备
const checkMobileDevice = () => {
  const isMobile = window.innerWidth <= 768
  isMobileDevice.value = isMobile
  return isMobile
}

// 保存状态
const saveState = () => {
  if (!isMobileDevice.value) {
    localStorage.setItem(
      'chatWindowState',
      JSON.stringify({
        position: position.value,
        size: size.value
      })
    )
  }
}

// 加载状态
const loadState = () => {
  if (checkMobileDevice()) {
    position.value = { x: 0, y: 0 }
    size.value = {
      width: window.innerWidth,
      height: window.innerHeight
    }
  } else {
    const savedState = localStorage.getItem('chatWindowState')
    if (savedState) {
      const state = JSON.parse(savedState)
      position.value = state.position
      size.value = state.size
    }
  }
}

// 窗口大小变化处理
const handleResize = () => {
  if (checkMobileDevice()) {
    position.value = { x: 0, y: 0 }
    size.value = {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }
}

// ... 继续下一部分
// 拖动相关方法
const startDrag = e => {
  if (isMobileDevice.value) return
  isDragging.value = true
  const rect = chatContainer.value.getBoundingClientRect()
  dragOffset.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
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
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// 调整大小相关方法
const startResize = e => {
  if (isMobileDevice.value) return
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

  const newWidth = Math.max(MIN_WIDTH, resizeStart.value.width + (e.clientX - resizeStart.value.x))
  const newHeight = Math.max(MIN_HEIGHT, resizeStart.value.height + (e.clientY - resizeStart.value.y))

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
  if (isMobileDevice.value) return
  size.value = { width: 800, height: 600 }
  saveState()
}

// 聊天相关方法
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
const initializeHistory = historyMessages => {
  messages.value = []
  historyMessages.forEach(message => {
    addMessage(message)
  })
}

// 生命周期钩子
onMounted(async () => {
  // 初始化用户ID
  currentUser.value = await generateUserId()

  // 检查设备类型并加载状态
  checkMobileDevice()
  loadState()

  // 添加窗口大小变化监听
  window.addEventListener('resize', handleResize)

  // Socket 事件监听
  socket.on('connect', () => {
    console.log('Connected to server')
    isConnected.value = true
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

  socket.on('history', historyMessages => {
    initializeHistory(historyMessages)
  })

  socket.on('message', message => {
    addMessage(message)
  })

  socket.on('userCount', count => {
    onlineCount.value = count
  })

  socket.on('error', error => {
    console.error('Socket error:', error)
  })
})

onUnmounted(() => {
  // 清理事件监听器
  window.removeEventListener('resize', handleResize)

  // 清理 socket 事件
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

/* 移动端样式 */
@media (max-width: 768px) {
  .chat-container {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100% !important;
    height: 100% !important;
    min-width: unset;
    min-height: unset;
    border-radius: 0;
    margin: 0;
  }

  .chat-header {
    border-radius: 0;
    padding: 10px 15px;
  }

  .header-left h2 {
    font-size: 16px;
  }

  .online-count {
    font-size: 11px;
  }

  .resize-handle {
    display: none;
  }
}

/* 适配刘海屏 */
@supports (padding-top: env(safe-area-inset-top)) {
  @media (max-width: 768px) {
    .chat-container {
      padding-top: env(safe-area-inset-top);
      padding-bottom: env(safe-area-inset-bottom);
    }

    .chat-header {
      padding-top: calc(10px + env(safe-area-inset-top));
    }

    .chat-input {
      padding-bottom: calc(10px + env(safe-area-inset-bottom));
    }
  }
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
  -webkit-overflow-scrolling: touch;
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

/* 横屏模式优化 */
@media (max-width: 768px) and (orientation: landscape) {
  .chat-header {
    padding: 5px 15px;
  }
  
  .chat-messages {
    padding: 10px;
  }
  
  .message-wrapper {
    margin-bottom: 10px;
  }
  
  .avatar {
    width: 28px;
    height: 28px;
  }
  
  .chat-input {
    padding: 8px;
  }
  
  input {
    padding: 6px 10px;
  }
  
  button {
    padding: 6px 15px;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .chat-container {
    background: #1a1a1a;
  }
  
  .chat-messages {
    background: #2a2a2a;
  }
  
  .message {
    background: #333;
    color: #fff;
  }
  
  .my-message .message {
    background: #4a90e2;
  }
  
  .time {
    color: #aaa;
  }
  
  input {
    background: #333;
    color: #fff;
    border-color: #444;
  }
  
  input:focus {
    border-color: #4a90e2;
  }
  
  .chat-input {
    background: #1a1a1a;
    border-top-color: #333;
  }
}

</style>
