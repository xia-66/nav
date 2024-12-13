<template>
  <div class="music-player">
    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-input-wrapper">
        <i class="fas fa-search search-icon"></i>
        <input type="text" v-model="searchQuery" @keyup.enter="searchAndPlay" placeholder="输入歌曲名称后按回车键搜索..." />
        <button class="search-btn" @click="searchAndPlay" :disabled="isLoading">
          <i :class="isLoading ? 'fas fa-spinner fa-spin' : 'fas fa-search'"></i>
        </button>
      </div>
    </div>

    <!-- 播放器主体 -->
    <div class="player-container">
      <!-- 左侧：封面和基本信息 -->
      <div class="left-section">
        <div class="cover-section">
          <img :src="currentSong.cover" :class="{ rotating: isPlaying }" @error="handleImageError" />
        </div>

        <div class="info-section">
          <div class="song-info">
            <h2>{{ currentSong.song || '未选择歌曲' }}</h2>
            <p>{{ currentSong.singer }} {{ currentSong.album ? '- ' + currentSong.album : '' }}</p>
          </div>

          <!-- 进度条 -->
          <div class="progress-bar">
            <div class="progress" :style="{ width: progress + '%' }"></div>
            <input type="range" min="0" max="100" v-model="progress" @input="handleProgressChange" />
            <div class="time">
              <span>{{ formatTime(currentTime) }}</span>
              <span>{{ formatTime(duration) }}</span>
            </div>
          </div>

          <!-- 控制按钮 -->
          <div class="controls">
            <button class="control-btn" @click="prev" title="上一首">
              <i class="fas fa-step-backward"></i>
            </button>
            <button class="control-btn play-btn" @click="togglePlay" :title="isPlaying ? '暂停' : '播放'">
              <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
            </button>
            <button class="control-btn" @click="next" title="下一首">
              <i class="fas fa-step-forward"></i>
            </button>
            <button class="control-btn download-btn" @click="downloadSong" title="下载" :disabled="!currentSong.url">
              <i class="fas fa-download"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧：歌词显示 -->
      <div class="lyrics-container" ref="lyricsContainer">
        <div v-for="(line, index) in lyrics" :key="index" :class="{ active: currentLyricIndex === index }" class="lyric-line">
          {{ line.name }}
        </div>
      </div>
    </div>

    <!-- 音频元素 -->
    <audio ref="audioPlayer" :src="currentSong.url" @timeupdate="updateProgress" @loadedmetadata="setDuration" @ended="handleEnded" @error="handleAudioError"></audio>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import axios from 'axios'
import '@fortawesome/fontawesome-free/css/all.css'
const audioPlayer = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const progress = ref(0)
const currentSong = ref({})
const searchQuery = ref('')
const isLoading = ref(false)

// 添加歌词相关的响应式变量
const lyrics = ref([])
const currentLyricIndex = ref(0)
const lyricsContainer = ref(null)

// 修改获取歌词的函数
const fetchLyrics = async mid => {
  try {
    console.log('Fetching lyrics for mid:', mid)
    // 使用新的 API 端点
    const url = `https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?songmid=${mid}&g_tk=5381&format=json&nobase64=1`

    // 使用 fetch API 发送请求
    const response = await fetch(url, {
      method: 'GET',
      mode: 'no-cors', // 添加 no-cors 模式
      credentials: 'omit', // 不发送 cookies
      headers: {
        Accept: 'application/json'
      }
    })

    // 如果使用 no-cors 模式无法获取响应内容，尝试使用 JSONP
    if (!response.ok) {
      return await fetchLyricsWithJsonp(mid)
    }

    const data = await response.json()
    if (data && data.lyric) {
      const decodedLyric = decodeURIComponent(escape(atob(data.lyric)))
      const parsedLyrics = parseLyric(decodedLyric)
      lyrics.value = parsedLyrics
      console.log('Parsed lyrics:', lyrics.value)
    } else {
      lyrics.value = [{ time: '00:00', name: '暂无歌词' }]
    }
  } catch (error) {
    console.error('获取歌词失败，尝试使用 JSONP:', error)
    // 如果主方法失败，尝试使用 JSONP 方法
    await fetchLyricsWithJsonp(mid)
  }
}

// 使用 JSONP 获取歌词的备用方法
const fetchLyricsWithJsonp = mid => {
  return new Promise((resolve, reject) => {
    const callbackName = `jsonp_lyrics_${Date.now()}`
    const url = `https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?callback=${callbackName}&songmid=${mid}&g_tk=5381&format=jsonp`

    window[callbackName] = res => {
      try {
        if (res.lyric) {
          const decodedLyric = decodeURIComponent(escape(atob(res.lyric)))
          const parsedLyrics = parseLyric(decodedLyric)
          lyrics.value = parsedLyrics
          console.log('Parsed lyrics (JSONP):', lyrics.value)
        } else {
          lyrics.value = [{ time: '00:00', name: '暂无歌词' }]
        }
      } catch (error) {
        console.error('解析歌词失败:', error)
        lyrics.value = [{ time: '00:00', name: '暂无歌词' }]
      } finally {
        // 清理
        document.body.removeChild(script)
        delete window[callbackName]
        resolve()
      }
    }

    const script = document.createElement('script')
    script.src = url
    script.onerror = error => {
      document.body.removeChild(script)
      delete window[callbackName]
      console.error('JSONP 请求失败:', error)
      lyrics.value = [{ time: '00:00', name: '暂无歌词' }]
      reject(error)
    }

    document.body.appendChild(script)
  })
}

// 添加歌词解析函数
const parseLyric = lrc => {
  const lyrics = []
  const lines = lrc.split('\n')

  const timeExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

  for (let line of lines) {
    const matches = timeExp.exec(line)
    if (matches) {
      const minutes = matches[1]
      const seconds = matches[2]
      const milliseconds = matches[3].padEnd(3, '0')

      const time = `${minutes}:${seconds}.${milliseconds}`
      const text = line.replace(timeExp, '').trim()

      if (text) {
        lyrics.push({
          time: time,
          name: text
        })
      }
    }
  }

  return lyrics
}

// 从链接中提取 songmid
const extractSongMid = link => {
  const match = link.match(/songmid=([^&]+)/)
  return match ? match[1] : null
}

// 修改搜索并播放函数
const searchAndPlay = async () => {
  if (!searchQuery.value.trim()) return

  isLoading.value = true
  try {
    const response = await axios.get(`https://api.lolimi.cn/API/qqdg/?word=${searchQuery.value}&n=1`)
    console.log('Search response:', response.data)

    if (response.data.code === 200) {
      currentSong.value = response.data.data

      // 从 link 中提取 songmid
      const songmid = extractSongMid(currentSong.value.link)
      console.log('Extracted songmid:', songmid)

      // 获取歌词
      if (songmid) {
        await fetchLyrics(songmid)
      } else {
        console.log('No songmid found in link')
        lyrics.value = [{ time: '00:00', name: '暂无歌词' }]
      }

      await nextTick()

      if (audioPlayer.value) {
        audioPlayer.value.load()
        try {
          await audioPlayer.value.play()
          isPlaying.value = true
        } catch (error) {
          console.error('自动播放失败:', error)
          isPlaying.value = false
        }
      }
    }
  } catch (error) {
    console.error('搜索音乐失败:', error)
    lyrics.value = [{ time: '00:00', name: '暂无歌词' }]
  } finally {
    isLoading.value = false
  }
}

// 播放/暂停
const togglePlay = () => {
  if (!currentSong.value.url) {
    return
  }
  if (audioPlayer.value.paused) {
    audioPlayer.value.play().catch(error => {
      console.error('播放失败:', error)
    })
    isPlaying.value = true
  } else {
    audioPlayer.value.pause()
    isPlaying.value = false
  }
}

// 更新进度
const updateProgress = () => {
  currentTime.value = audioPlayer.value.currentTime
  progress.value = (currentTime.value / duration.value) * 100

  // 更新当前歌词
  updateCurrentLyric()
}

// 更新当前歌词
const updateCurrentLyric = () => {
  const currentTime = audioPlayer.value.currentTime

  // 查找当前时间对应的歌词
  for (let i = lyrics.value.length - 1; i >= 0; i--) {
    const lyricTime = timeToSeconds(lyrics.value[i].time)
    if (currentTime >= lyricTime) {
      if (currentLyricIndex.value !== i) {
        currentLyricIndex.value = i
        scrollToCurrentLyric()
      }
      break
    }
  }
}

// 将时间字符串转换为秒数
const timeToSeconds = timeStr => {
  const [minutes, seconds] = timeStr.split(':')
  return parseInt(minutes) * 60 + parseFloat(seconds)
}

// 滚动到当前歌词
const scrollToCurrentLyric = () => {
  if (!lyricsContainer.value) return

  const activeElement = lyricsContainer.value.children[currentLyricIndex.value]
  if (activeElement) {
    activeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }
}

// 设置音频总时长
const setDuration = () => {
  duration.value = audioPlayer.value.duration
}

// 处理进度条改变
const handleProgressChange = e => {
  const time = (duration.value * e.target.value) / 100
  audioPlayer.value.currentTime = time
}

// 格式化时间
const formatTime = time => {
  if (!time) return '0:00'
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// 处理播放结束
const handleEnded = () => {
  isPlaying.value = false
  progress.value = 0
}

// 处理图片加载错误
const handleImageError = e => {
  e.target.src = 'default-cover.jpg' // 设置默认封面图片
}

// 处理音频加载错误
const handleAudioError = () => {
  console.error('音频加载失败')
  isPlaying.value = false
}

// 添加下载功能
const downloadSong = async () => {
  if (!currentSong.value.url) {
    return
  }

  try {
    // 创建一个链接
    const link = document.createElement('a')
    link.href = currentSong.value.url
    // 设置文件名
    const fileName = `${currentSong.value.song} - ${currentSong.value.singer}.mp3`
    link.download = fileName
    // 添加到文档中
    document.body.appendChild(link)
    // 触发点击
    link.click()
    // 清理
    document.body.removeChild(link)
  } catch (error) {
    console.error('下载失败:', error)
  }
}

onMounted(async () => {
  // 初始加载一首歌曲
  searchQuery.value = '可惜没如果'
  await searchAndPlay()
})
</script>

<style scoped>
.music-player {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.search-section {
  margin-bottom: 20px;
  position: relative;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.search-input-wrapper input {
  flex: 1;
  padding: 10px 10px 10px 35px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input-wrapper input:focus {
  border-color: #31c27c;
}

.search-btn {
  padding: 10px 20px;
  background: #31c27c;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.search-btn:hover {
  background: #2ca970;
  transform: scale(1.05);
}

.search-btn:active {
  transform: scale(0.95);
}

.player-container {
  display: flex;
  gap: 20px;
}

.left-section {
  flex: 1;
  min-width: 300px;
}

.cover-section {
  width: 300px;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cover-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.rotating {
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.info-section {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.song-info {
  margin-bottom: 20px;
}

.song-info h2 {
  margin: 0 0 5px;
  font-size: 24px;
  color: #333;
  font-weight: 600;
}

.song-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.progress-bar {
  position: relative;
  height: 4px;
  background: #eee;
  margin: 20px 0;
  border-radius: 2px;
  cursor: pointer;
}

.progress {
  position: absolute;
  height: 100%;
  background: #31c27c;
  border-radius: 2px;
  transition: width 0.1s linear;
}

.progress-bar:hover .progress {
  background: #2ca970;
}

.time {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  font-size: 12px;
  color: #999;
}

.controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: auto;
  flex-wrap: wrap;
}

.control-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #31c27c;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: 0 2px 6px rgba(49, 194, 124, 0.2);
}

.play-btn {
  width: 50px;
  height: 50px;
  font-size: 20px;
}

.control-btn:hover {
  background: #2ca970;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(49, 194, 124, 0.3);
}

.control-btn:active {
  transform: scale(0.95);
}

input[type='range'] {
  width: 100%;
  position: absolute;
  top: -2px;
  left: 0;
  opacity: 0;
  cursor: pointer;
  height: 8px;
  margin: 0;
  padding: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .music-player {
    padding: 15px;
  }

  .player-container {
    flex-direction: column;
  }

  .cover-section {
    width: 100%;
    height: auto;
    aspect-ratio: 1;
  }

  .info-section {
    padding: 20px 0;
  }

  .controls {
    margin-top: 20px;
  }

  .search-input-wrapper {
    flex-direction: column;
  }

  .search-btn {
    width: 100%;
  }
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .music-player {
    background: #1a1a1a;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  }

  .search-input-wrapper input {
    background: #2a2a2a;
    border-color: #333;
    color: #fff;
  }

  .song-info h2 {
    color: #fff;
  }

  .song-info p {
    color: #999;
  }

  .progress-bar {
    background: #333;
  }

  .time {
    color: #666;
  }
}

/* 美化滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #31c27c;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #2ca970;
}

/* 添加下载按钮样式 */
.download-btn {
  background: #ff7043;
  margin-left: 10px;
}

.download-btn:hover {
  background: #f4511e;
}

.download-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* 修改控制按钮区域样式以适应新按钮 */
.controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: auto;
  flex-wrap: wrap;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .controls {
    gap: 10px;
  }

  .control-btn {
    width: 36px;
    height: 36px;
  }

  .play-btn {
    width: 46px;
    height: 46px;
  }
}

/* 添加歌词相关样式 */
.lyrics-container {
  flex: 1;
  height: 400px;
  overflow-y: auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  scroll-behavior: smooth;
}

.lyric-line {
  padding: 8px 0;
  text-align: center;
  color: #666;
  transition: all 0.3s;
}

.lyric-line.active {
  color: #31c27c;
  font-size: 1.1em;
  font-weight: bold;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .player-container {
    flex-direction: column;
  }

  .lyrics-container {
    height: 200px;
  }
}

/* 美化滚动条 */
.lyrics-container::-webkit-scrollbar {
  width: 6px;
}

.lyrics-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

.lyrics-container::-webkit-scrollbar-thumb {
  background: #31c27c;
  border-radius: 3px;
}


/* 修改响应式设计部分 */
@media (max-width: 768px) {
  .music-player {
    padding: 10px;
    margin: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    border-radius: 0;
  }

  .search-section {
    margin-bottom: 10px;
    padding: 0 5px;
  }

  .search-input-wrapper {
    flex-direction: row;
    gap: 5px;
  }

  .search-input-wrapper input {
    height: 40px;
  }

  .search-btn {
    width: auto;
    padding: 0 15px;
    height: 40px;
    white-space: nowrap;
  }

  .player-container {
    flex-direction: column;
    flex: 1;
    overflow: hidden;
  }

  .left-section {
    min-width: unset;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .cover-section {
    width: 200px;
    height: 200px;
    margin: 0 auto;
  }

  .info-section {
    padding: 10px 5px;
  }

  .song-info {
    margin-bottom: 10px;
    text-align: center;
  }

  .song-info h2 {
    font-size: 18px;
    margin-bottom: 5px;
  }

  .song-info p {
    font-size: 12px;
  }

  .controls {
    margin: 10px 0;
    gap: 12px;
  }

  .control-btn {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }

  .play-btn {
    width: 44px;
    height: 44px;
    font-size: 18px;
  }

  .lyrics-container {
    height: 150px;
    padding: 10px;
    margin-top: 10px;
    flex-shrink: 0;
  }

  .lyric-line {
    padding: 6px 0;
    font-size: 14px;
  }

  .lyric-line.active {
    font-size: 16px;
  }

  .progress-bar {
    margin: 10px 0;
  }

  .time {
    font-size: 10px;
  }

  /* 优化触摸区域 */
  input[type='range'] {
    height: 20px;
    top: -8px;
  }

  .control-btn:active {
    transform: scale(0.9);
  }
}

/* 针对更小屏幕的优化 */
@media (max-width: 320px) {
  .cover-section {
    width: 150px;
    height: 150px;
  }

  .controls {
    gap: 8px;
  }

  .control-btn {
    width: 32px;
    height: 32px;
  }

  .play-btn {
    width: 40px;
    height: 40px;
  }

  .lyrics-container {
    height: 120px;
  }
}

/* 针对横屏模式的优化 */
@media (max-width: 768px) and (orientation: landscape) {
  .music-player {
    height: auto;
    min-height: 100vh;
  }

  .player-container {
    flex-direction: row;
    gap: 10px;
  }

  .cover-section {
    width: 150px;
    height: 150px;
  }

  .left-section {
    flex: 0 0 auto;
    width: 50%;
  }

  .lyrics-container {
    height: 300px;
    margin-top: 0;
  }
}

/* 优化暗色模式 */
@media (prefers-color-scheme: dark) {
  .lyrics-container {
    background: rgba(255, 255, 255, 0.03);
  }

  .lyric-line {
    color: #888;
  }

  .lyric-line.active {
    color: #31c27c;
  }

  .search-input-wrapper input {
    color: #fff;
    background: #2a2a2a;
  }

  .search-icon {
    color: #666;
  }
}

/* 优化触摸反馈 */
@media (hover: none) {
  .control-btn:hover {
    transform: none;
    box-shadow: none;
  }

  .search-btn:hover {
    transform: none;
  }
}
</style>
