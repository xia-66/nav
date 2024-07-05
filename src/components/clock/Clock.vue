<template>
  <div class="hs-clock">
    <div class="time">
      <span ref="hour" class="hour">{{ hours }}</span>
      <div class="text">时</div>
      <span ref="minute" class="minute">{{ minutes }}</span>
      <div class="text">分</div>
      <span ref="second" class="second">{{ seconds }}</span>
      <div class="text">秒</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const hours = ref('00')
const minutes = ref('00')
const seconds = ref('00')

onMounted(() => {
  // 组件挂载后执行定时任务每隔一秒执行
  setInterval(clock, 1000);
})
const clock = () => {
  let h = new Date().getHours();
  let m = new Date().getMinutes();
  let s = new Date().getSeconds();
  // 设置格式
  hours.value = h < 10 ? '0' + h : h;
  minutes.value = m < 10 ? '0' + m : m;
  seconds.value = s < 10 ? '0' + s : s;
}
</script>

<style lang="scss" scoped>
.hs-clock {
  // width: 100%;
  // height: 100%;
  .time {
    width: 140px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    span {
      display: inline-block;
      width: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      font-weight: 500;
    }
    .text {
      font-size: 14px;
      margin: 0 4px;
    }
  }
}
</style>