<template>
  <div v-if="!selectedUser" class="login-container">
    <h2>选择用户</h2>
    <div class="user-buttons">
      <button @click="selectUser('user1')" :class="{ active: selectedUser === 'user1' }">用户1</button>
      <button @click="selectUser('user2')" :class="{ active: selectedUser === 'user2' }">用户2</button>
    </div>
  </div>

  <div v-else class="main-container">
    <!-- 侧边栏 -->
    <div class="sidebar">
      <div class="search-container">
        <div class="search-wrapper">
          <input type="text" v-model="searchQuery" placeholder="搜索用户..." class="search-input" />
          <button class="add-chat-btn" @click="showNewChatDialog = true">
            <i class="plus-icon">+</i>
          </button>
        </div>
      </div>
      <div class="chat-list">
        <template v-if="!showEmptyState">
          <div v-for="chat in filteredChatList" :key="chat.userId" class="chat-item" :class="{ active: chat.userId === targetUserId }" @click="switchChat(chat.userId)">
            <div class="chat-item-avatar">
              <img :src="getAvatarUrl(chat.userId)" :alt="chat.userId" />
              <span class="status-dot" :class="{ online: onlineUsers.has(chat.userId) }"></span>
            </div>
            <div class="chat-item-info">
              <div class="chat-item-name">{{ chat.userId }}</div>
              <div class="chat-item-last-message">{{ chat.lastMessage || '暂无消息' }}</div>
            </div>
            <div v-if="chat.unreadCount" class="chat-item-badge">{{ chat.unreadCount }}</div>
          </div>
        </template>
        <div v-else class="empty-state">
          <div class="empty-message">
            暂无聊天
            <div class="empty-hint">点击右上角"+"添加新的聊天</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 聊天区域 -->
    <div class="chat-container" ref="chatContainer">
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
            'system-message': isSystemMessage(message),
            unread: !message.isRead && message.to === selectedUser
          }"
        >
          <div class="message-time" v-if="showMessageDate(index, message)">
            {{ formatMessageDate(message.timestamp) }}
          </div>

          <div class="message-content" :class="{ 'system-content': isSystemMessage(message) }">
            <template v-if="!isSystemMessage(message)">
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
            </template>
            <template v-else>
              <div class="system-message-bubble">
                <div class="message-text">{{ message.message }}</div>
                <div class="message-meta">
                  <span class="time">{{ formatTime(message.timestamp) }}</span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="chat-input">
        <input v-model="newMessage" @keyup.enter="sendMessage" @input="handleTyping" placeholder="输入消息..." :disabled="!isConnected" />
        <button @click="sendMessage" :disabled="!isConnected || !newMessage.trim()">发送</button>
      </div>
    </div>
  </div>

  <!-- 新建聊天弹出框 -->
  <div v-if="showNewChatDialog" class="dialog-overlay">
    <div class="dialog-content">
      <h3>新建聊天</h3>
      <input type="text" v-model="newChatUserId" placeholder="请输入用户ID" class="dialog-input" @keyup.enter="createNewChat" />
      <div class="dialog-buttons">
        <button @click="showNewChatDialog = false">取消</button>
        <button @click="createNewChat" :disabled="!newChatUserId.trim()" class="primary">确认</button>
      </div>
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

// 添加搜索相关的状态
const searchQuery = ref('')

// 新建聊天相关的状态
const showNewChatDialog = ref(false)
const newChatUserId = ref('')

// 修改聊天列表初始化
const chatList = ref([]) // 初始化为空数组

// 修改 targetUserId 计算属性
const targetUserId = computed(() => {
  // 从当前活跃的聊天中获取目标用户ID
  const activeChat = chatList.value.find(chat => chat.active)
  return activeChat ? activeChat.userId : ''
})

// 修改过滤后的聊天列表计算属性，添加空状态处理
const filteredChatList = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return chatList.value

  return chatList.value.filter(chat => chat.userId.toLowerCase().includes(query))
})

// 添加空状态展示
const showEmptyState = computed(() => {
  return chatList.value.length === 0
})

// 计算目标用户在线状态
const isTargetOnline = computed(() => onlineUsers.value.has(targetUserId.value))

// Socket 连接
const socket = io('http://localhost:3002', {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
})
// 用户选择
const selectUser = async userId => {
  // 检查用户是否在聊天列表中
  const existingChat = chatList.value.find(chat => chat.userId === userId)
  if (!existingChat) {
    // 如果不在列表中，添加到聊天列表
    chatList.value.push({
      userId,
      lastMessage: '',
      unreadCount: 0,
      active: true
    })
  } else {
    // 如果已存在，将其设为活跃
    chatList.value.forEach(chat => {
      chat.active = chat.userId === userId
    })
  }

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

  // 先加入聊天
  socket.emit('join', selectedUser.value, response => {
    if (response.status === 'joined') {
      isConnected.value = true
      onlineUsers.value = new Set(response.onlineUsers)

      // 如果有目标用户，初始化聊天空间
      if (targetUserId.value) {
        socket.emit(
          'initializeChat',
          {
            user1: selectedUser.value,
            user2: targetUserId.value
          },
          response => {
            if (response.status === 'success') {
              console.log('Chat initialized:', response.namespace)
              loadMessages() // 加载消息历史
            }
          }
        )
      }
    }
  })
}

// 加载消息
const loadMessages = async () => {
  if (!targetUserId.value) return

  socket.emit(
    'getHistory',
    {
      user1: selectedUser.value,
      user2: targetUserId.value
    },
    response => {
      if (response && response.messages) {
        messages.value = response.messages
        unreadCount.value = response.unreadCount || 0

        // 如果有未读消息，立即标记为已读
        if (unreadCount.value > 0) {
          socket.emit('markAsRead', {
            from: selectedUser.value,
            to: targetUserId.value
          })
        }
      }
      scrollToBottom()
    }
  )
}

// 发送消息
const sendMessage = async () => {
  if (!newMessage.value.trim() || !isConnected.value || !targetUserId.value) return

  const messageData = {
    from: selectedUser.value,
    to: targetUserId.value,
    message: newMessage.value.trim()
  }

  socket.emit('private-message', messageData, response => {
    if (response.status === 'success') {
      messages.value.push(response.message)

      // 更新聊天列表中的最后一条消息
      const chatItem = chatList.value.find(chat => chat.userId === targetUserId.value)
      if (chatItem) {
        chatItem.lastMessage = messageData.message
      }

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
    updateChatStatus(message)
    scrollToBottom()
  })

  // 消息已读状态更新
  socket.on('messagesRead', ({ from, to }) => {
    handleMessagesRead(from, to)
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

  // 监听命名空间清理事件
  socket.on('namespaceCleanup', namespace => {
    console.log('Namespace cleaned up:', namespace)
    // 可以在这里处理命名空间被清理的情况
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

    // 新聊天列表的最后消息
    const lastMessage = newMessages[newMessages.length - 1]
    if (lastMessage) {
      const chatItem = chatList.value.find(chat => chat.userId === (lastMessage.from === selectedUser.value ? lastMessage.to : lastMessage.from))
      if (chatItem) {
        chatItem.lastMessage = lastMessage.message
      }
    }
  },
  { deep: true }
)

// 换聊天对象
const switchChat = async userId => {
  if (userId === selectedUser.value) return

  // 清空当前消息
  messages.value = []
  unreadCount.value = 0

  // 更新选中用户
  selectedUser.value = userId

  // 更新聊天列表中的活跃状态
  chatList.value.forEach(chat => {
    chat.active = chat.userId === userId
  })

  // 初始化新的聊天
  socket.emit(
    'initializeChat',
    {
      user1: selectedUser.value,
      user2: userId
    },
    response => {
      if (response.status === 'success') {
        console.log('Switched to chat namespace:', response.namespace)
        loadMessages() // 加载新的消息历史
      }
    }
  )
}

// 更新现有的 watch，以更新聊天列表的最后消息和未读数
watch(
  () => messages.value,
  newMessages => {
    if (!Array.isArray(newMessages)) return

    // 新聊天列表的最后消息
    const lastMessage = newMessages[newMessages.length - 1]
    if (lastMessage) {
      const chatItem = chatList.value.find(chat => chat.userId === (lastMessage.from === selectedUser.value ? lastMessage.to : lastMessage.from))
      if (chatItem) {
        chatItem.lastMessage = lastMessage.message
      }
    }
  },
  { deep: true }
)

// 创建新的聊天
const createNewChat = () => {
  const userId = newChatUserId.value.trim()
  if (!userId || userId === selectedUser.value) {
    console.warn('Cannot chat with yourself')
    return
  }

  // 检查是否已存在该聊天
  const existingChat = chatList.value.find(chat => chat.userId === userId)
  if (!existingChat) {
    // 取消所有天的活跃状态
    chatList.value.forEach(chat => (chat.active = false))

    // 添加新的聊天
    chatList.value.push({
      userId,
      lastMessage: '',
      unreadCount: 0,
      active: true
    })
  } else {
    // 如果聊天已存在，将其设为活跃
    chatList.value.forEach(chat => {
      chat.active = chat.userId === userId
    })
  }

  // 更新选中用户
  selectedUser.value = userId

  // 初始化新的聊天
  socket.emit(
    'initializeChat',
    {
      user1: selectedUser.value,
      user2: userId
    },
    response => {
      if (response.status === 'success') {
        console.log('New chat initialized:', response.namespace)
        loadMessages() // 加载消息历史
      }
    }
  )

  // 重置状态
  newChatUserId.value = ''
  showNewChatDialog.value = false
}

const updateChatStatus = message => {
  const chatUserId = message.from === selectedUser.value ? message.to : message.from
  const chatItem = chatList.value.find(chat => chat.userId === chatUserId)

  if (chatItem) {
    chatItem.lastMessage = message.message
    // 只有当这条消息不是当前用户发送的，且是发给当前用户的未读消息时才更新计数
    if (message.from !== selectedUser.value && message.to === selectedUser.value && !message.isRead) {
      chatItem.unreadCount = (chatItem.unreadCount || 0) + 1

      // 如果是当前活跃的聊天，立即标记为已读
      if (chatItem.active) {
        socket.emit('markAsRead', {
          from: selectedUser.value,
          to: message.from
        })
      }
    }
  }
}

// 添加一个新的函数来处理消息已读状态
const handleMessagesRead = (from, to) => {
  // 更新消息列表中的已读状态
  messages.value = messages.value.map(msg => {
    if (msg.from === from && msg.to === to && !msg.isRead) {
      return { ...msg, isRead: true }
    }
    return msg
  })

  // 更新聊天列表中的未读计数
  const chatItem = chatList.value.find(chat => chat.userId === from)
  if (chatItem) {
    chatItem.unreadCount = 0
  }
}

// 添加一个计算属性来判断是否为系统消息
const isSystemMessage = message => {
  return message.type === 'system' || message.message.includes('Chat session created')
}
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
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: white;
  overflow: hidden; /* 防止整体出现滚动条 */
}

/* 头部样式 */
.chat-header {
  padding: 15px 20px;
  background: #4a90e2;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0; /* 防止头部被压缩 */
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
  align-items: flex-start;
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
  min-width: 100px;
}

.my-message .message-bubble {
  background: white;
  color: #333;
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 我方消息的文本和元数据样式 */
.my-message .message-meta {
  color: #666;
}

.my-message .message-bubble .message-meta {
  color: #666;
}

.my-message .message-bubble .status {
  color: #666;
}

.my-message .message-bubble .time {
  color: #666;
}

.my-message.unread .message-bubble {
  border-left: none;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.3);
}

.message-meta {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  opacity: 0.8;
}

/* 输入区域样式 */
.chat-input {
  padding: 15px;
  background: white;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
  flex-shrink: 0; /* 防止输入区域被压缩 */
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

/* 添加新的样式 */
.main-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden; /* 防止出现滚动条 */
}

.sidebar {
  width: 300px;
  border-right: 1px solid #eee;
  background: white;
  display: flex;
  flex-direction: column;
  flex-shrink: 0; /* 防止侧边栏被压缩 */
}

.search-container {
  padding: 15px;
  background: #fff;
  border-bottom: 1px solid #eee;
}

.search-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #4a90e2;
}

.add-chat-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: #4a90e2;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.add-chat-btn:hover {
  background: #357abd;
}

.chat-list {
  flex: 1;
  overflow-y: auto;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 15px;
  cursor: pointer;
  transition: background-color 0.3s;
  position: relative;
  border-bottom: 1px solid #f5f5f5;
}

.chat-item:hover {
  background-color: #f5f5f5;
}

.chat-item.active {
  background-color: #e3f2fd;
}

.chat-item-avatar {
  position: relative;
  margin-right: 15px;
}

.chat-item-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.chat-item-info {
  flex: 1;
  overflow: hidden;
}

.chat-item-name {
  font-weight: 500;
  margin-bottom: 5px;
}

.chat-item-last-message {
  color: #666;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-item-badge {
  background: #4a90e2;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

/* 弹出框样式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.dialog-content h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.dialog-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 15px;
  font-size: 14px;
}

.dialog-input:focus {
  border-color: #4a90e2;
  outline: none;
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.dialog-buttons button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.dialog-buttons button:not(.primary) {
  background: #f5f5f5;
  color: #333;
}

.dialog-buttons button.primary {
  background: #4a90e2;
  color: white;
}

.dialog-buttons button:hover:not(:disabled) {
  opacity: 0.9;
}

.dialog-buttons button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  text-align: center;
  padding: 20px;
}

.empty-message {
  font-size: 16px;
}

.empty-hint {
  font-size: 14px;
  margin-top: 8px;
  color: #666;
}

/* 添加系统消息的样式 */
.system-message {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}

.system-content {
  justify-content: center !important;
  max-width: none !important;
}

.system-message-bubble {
  background: rgba(74, 144, 226, 0.1);
  padding: 8px 15px;
  border-radius: 15px;
  text-align: center;
  color: #666;
  max-width: 80%;
  margin: 0 auto;
}

.system-message-bubble .message-text {
  font-size: 14px;
}

.system-message-bubble .message-meta {
  margin-top: 4px;
  font-size: 12px;
  color: #999;
  justify-content: center;
}

/* 消息文本样式 */
.message-text {
  word-break: break-word;
  line-height: 1.4;
  margin-bottom: 2px;
}

/* 未读消息样式 */
.unread .message-bubble {
  border-left: 3px solid #4a90e2;
}
</style>
