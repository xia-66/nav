<template>
  <div v-if="!selectedUser" class="login-container">
    <h2>选择用户</h2>
    <div class="user-buttons">
      <button @click="selectUser('user1')" :class="{ active: selectedUser === 'user1' }">用户1</button>
      <button @click="selectUser('user2')" :class="{ active: selectedUser === 'user2' }">用户2</button>
    </div>
  </div>

  <div v-else class="chat-container" ref="chatContainer">
    <!-- 聊天头部 -->
    <div class="chat-header">
      <div class="header-left">
        <div class="chat-info">
          <h2>与 {{ targetUserId }} 的对话</h2>
          <div class="online-status">
            <span class="status-dot" :class="{ online: isTargetOnline }"></span>
            {{ isTargetOnline ? '在线' : '离线' }}
          </div>
        </div>
      </div>
      <div class="header-right">
        <div v-if="unreadCount > 0" class="unread-count">{{ unreadCount }} 条未读</div>
        <div v-if="isTyping" class="typing-status">正在输入...</div>
      </div>
    </div>

    <!-- 消息列表 -->
    <div class="chat-messages" ref="messageContainer" @scroll="handleScroll">
      <div
        v-for="(message, index) in messages"
        :key="message.id || index"
        class="message-wrapper"
        :class="{
          'my-message': message.from === selectedUser,
          unread: !message.isRead && message.to === selectedUser
        }"
      >
        <div class="message-time" v-if="showMessageDate(index, message)">
          {{ formatMessageDate(message.timestamp) }}
        </div>

        <div class="message-content">
          <div class="avatar">
            <img :src="getAvatarUrl(message.from)" :alt="message.from" />
          </div>
          <div class="message-bubble">
            <div class="message-text">{{ message.message }}</div>
            <div class="message-meta">
              <span class="time">{{ formatTime(message.timestamp) }}</span>
              <span v-if="message.from === selectedUser" class="status">
                {{ message.isRead ? '已读' : '未读' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="chat-input">
      <input v-model="newMessage" @keyup.enter="sendMessage" @input="handleTyping" placeholder="输入消息..." :disabled="!isConnected" />
      <button @click="sendMessage" :disabled="!isConnected || !newMessage.trim()">发送</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue'
import { io } from 'socket.io-client'
import { format, isToday, isYesterday, isSameDay } from 'date-fns'
import { zhCN } from 'date-fns/locale'

// 状态管理
const selectedUser = ref('')
const messages = ref([])
const newMessage = ref('')
const messageContainer = ref(null)
const isConnected = ref(false)
const unreadCount = ref(0)
const isTyping = ref(false)
const typingTimeout = ref(null)
const onlineUsers = ref(new Set())

// 计算目标用户ID
const targetUserId = computed(() => (selectedUser.value === 'user1' ? 'user2' : 'user1'))

// 计算目标用户在线状态
const isTargetOnline = computed(() => onlineUsers.value.has(targetUserId.value))

// Socket 连接
const socket = io('http://localhost:3002/chat', {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
})
// 用户选择
const selectUser = async userId => {
  selectedUser.value = userId
  await initializeChat()
}

// 清理状态
const cleanupState = () => {
  selectedUser.value = ''
  messages.value = []
  onlineUsers.value.clear()
  unreadCount.value = 0
  isTyping.value = false
  isConnected.value = false
}

// 初始化聊天
const initializeChat = async () => {
  if (!socket.connected) {
    socket.connect()
  }

  socket.emit('join', selectedUser.value, response => {
    if (response.status === 'joined') {
      isConnected.value = true
      onlineUsers.value = new Set(response.onlineUsers)
      loadMessages()
    }
  })
}

// 加载消息
const loadMessages = async () => {
  socket.emit(
    'getHistory',
    {
      user1: selectedUser.value,
      user2: targetUserId.value
    },
    response => {
      if (response && response.messages) {
        messages.value = response.messages

        // 计算实际的未读消息数量
        const unreadMessagesCount = messages.value.filter(msg => !msg.isRead && msg.to === selectedUser.value).length

        unreadCount.value = unreadMessagesCount

        // 如果有未读消息，立即标记为已读
        if (unreadMessagesCount > 0) {
          socket.emit('markAsRead', {
            from: targetUserId.value,
            to: selectedUser.value
          })
        }
      }
      scrollToBottom()
    }
  )
}

// 发送消息
const sendMessage = async () => {
  if (!newMessage.value.trim() || !isConnected.value) return

  const messageData = {
    from: selectedUser.value,
    to: targetUserId.value,
    message: newMessage.value.trim()
  }

  socket.emit('private-message', messageData, response => {
    if (response.status === 'success') {
      messages.value.push(response.message)
      scrollToBottom()
    } else {
      console.error('Failed to send message:', response.message)
    }
  })

  newMessage.value = ''
}

// 处理输入状态
const handleTyping = () => {
  socket.emit('typing', {
    from: selectedUser.value,
    to: targetUserId.value
  })

  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value)
  }

  typingTimeout.value = setTimeout(() => {
    socket.emit('stopTyping', {
      from: selectedUser.value,
      to: targetUserId.value
    })
  }, 1000)
}

// 页面关闭处理
const handleBeforeUnload = () => {
  if (selectedUser.value) {
    socket.emit('leave')
    socket.disconnect()
  }
}

// 获取头像
const getAvatarUrl = username => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
}

// 格式化时间
const formatTime = timestamp => {
  if (!timestamp) return ''
  return format(new Date(timestamp), 'HH:mm')
}

// 格式化消息日期
const formatMessageDate = timestamp => {
  const date = new Date(timestamp)
  if (isToday(date)) {
    return '今天'
  }
  if (isYesterday(date)) {
    return '昨天'
  }
  return format(date, 'yyyy年MM月dd日', { locale: zhCN })
}

// 判断是否显示日期
const showMessageDate = (index, message) => {
  if (index === 0) return true
  const prevMessage = messages.value[index - 1]
  const currentDate = new Date(message.timestamp)
  const prevDate = new Date(prevMessage.timestamp)
  return !isSameDay(currentDate, prevDate)
}

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

// 生命周期钩子
onMounted(() => {
  // 添加页面关闭事件监听
  window.addEventListener('beforeunload', handleBeforeUnload)

  // 连接事件
  socket.on('connect', () => {
    console.log('Connected to server')
    isConnected.value = true
  })

  // 断开连接事件
  socket.on('disconnect', () => {
    console.log('Disconnected from server')
    isConnected.value = false
    onlineUsers.value.clear()
  })

  // 接收消息
  socket.on('private-message', message => {
    if (!Array.isArray(messages.value)) {
      messages.value = []
    }
    messages.value.push(message)

    // 只有当消息是发给当前用户且未读时才增加未读计数
    if (message.to === selectedUser.value && !message.isRead) {
      unreadCount.value++
      // 立即标记为已读
      socket.emit('markAsRead', {
        from: message.from,
        to: message.to
      })
    }
    scrollToBottom()
  })

  // 消息已读状态更新
  socket.on('messagesRead', ({ from, to }) => {
    let unreadMessagesCount = 0
    messages.value = messages.value.map(msg => {
      // 如果是被标记为已读的消息
      if (msg.from === from && msg.to === to && !msg.isRead) {
        return { ...msg, isRead: true }
      }
      // 统计剩余未读消息
      if (msg.to === selectedUser.value && !msg.isRead) {
        unreadMessagesCount++
      }
      return msg
    })
    // 更新未读计数
    unreadCount.value = unreadMessagesCount
  })

  // 输入状态
  socket.on('typing', data => {
    if (data.from === targetUserId.value) {
      isTyping.value = true
    }
  })

  socket.on('stopTyping', data => {
    if (data.from === targetUserId.value) {
      isTyping.value = false
    }
  })

  // 用户上线事件
  socket.on('userConnected', userId => {
    onlineUsers.value.add(userId)
  })

  // 用户下线事件
  socket.on('userDisconnected', userId => {
    onlineUsers.value.delete(userId)
  })
})

onUnmounted(() => {
  // 移除页面关闭事件监听
  window.removeEventListener('beforeunload', handleBeforeUnload)

  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value)
  }

  // 确保在组件卸载时断开连接
  if (selectedUser.value) {
    socket.emit('leave')
  }

  socket.off('connect')
  socket.off('disconnect')
  socket.off('private-message')
  socket.off('messagesRead')
  socket.off('typing')
  socket.off('stopTyping')
  socket.off('userConnected')
  socket.off('userDisconnected')
  socket.disconnect()
})

// 监听消息变化，处理未读状态
watch(
  () => messages.value,
  newMessages => {
    if (!Array.isArray(newMessages)) return

    // 计算当前未读消息数量
    const unreadMessages = newMessages.filter(msg => msg && !msg.isRead && msg.to === selectedUser.value)

    // 更新未读计数
    unreadCount.value = unreadMessages.length

    // 如果有未读消息，标记为已读
    if (unreadMessages.length > 0) {
      socket.emit('markAsRead', {
        from: targetUserId.value,
        to: selectedUser.value
      })
    }
  },
  { deep: true }
)
</script>

<style scoped>
/* 登录容器样式 */
.login-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  max-width: 400px;
  padding: 20px;
  text-align: center;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.user-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
}

.user-buttons button {
  padding: 10px 30px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f0f0f0;
}

.user-buttons button.active {
  background: #4a90e2;
  color: white;
}

/* 聊天容器样式 */
.chat-container {
  max-width: none;
  height: 100vh;
  margin: 0;
  border-radius: 0;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  background: white;
  overflow: hidden;
}

/* 头部样式 */
.chat-header {
  padding: 15px 20px;
  background: #4a90e2;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.back-button {
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.back-button i {
  font-size: 20px;
}

.chat-info h2 {
  margin: 0;
  font-size: 18px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.unread-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.typing-status {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.online-status {
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ccc;
  transition: background-color 0.3s ease;
}

.status-dot.online {
  background: #2ecc71;
}

/* 消息列表样式 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f5f5f5;
}

.message-wrapper {
  margin-bottom: 20px;
}

.message-wrapper.unread .message-bubble {
  border-left: 3px solid #4a90e2;
  background-color: #f8f9fa;
}

.message-time {
  text-align: center;
  margin: 20px 0;
  color: #666;
  font-size: 12px;
}

.message-content {
  display: flex;
  gap: 10px;
  max-width: 70%;
}

.my-message .message-content {
  flex-direction: row-reverse;
  margin-left: auto;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-bubble {
  background: white;
  padding: 10px 15px;
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
  word-break: break-word;
}

.my-message .message-bubble {
  background: #4a90e2;
  color: white;
}

.message-meta {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.my-message .message-meta {
  color: rgba(255, 255, 255, 0.8);
}

/* 输入区域样式 */
.chat-input {
  padding: 15px;
  background: white;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  outline: none;
}

.chat-input input:focus {
  border-color: #4a90e2;
}

.chat-input button {
  padding: 10px 20px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.chat-input button:hover:not(:disabled) {
  background: #357abd;
}

.chat-input button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .chat-container {
    margin: 0;
    height: 100vh;
    border-radius: 0;
  }

  .message-content {
    max-width: 85%;
  }
}
</style>
