<template>
  <div class="head">
    <ul class="menu">
      <li>
        <i class="iconfont icon-md-menu" style="margin-right: 5px;"></i>
        <span style="margin-right: 80px;"></span>
      </li>
      <li v-for="item in menu" :key="item.index">
        <i :class="item.iconClass" style="margin-right: 5px;"></i>
        <span style="margin-right: 60px;">{{ item.name }}</span>
      </li>
    </ul>
    <Clock></Clock>
    <div class="flex-grow" />
    <ul class="my">
      <li>默认订阅</li>
      <li style="margin-left: 80px">注册登录</li>

    </ul>
  </div>
</template>
<script setup>
import Clock from '../clock/Clock.vue';
const menu = [

  {
    index: 1,
    name: '首页',
    iconClass: 'iconfont icon-md-home'
  },
  {
    index: 2,
    name: '更新日志',
    iconClass: 'iconfont icon-iconset0278'
  },
  {
    index: 3,
    name: '关于我们',
    iconClass: 'iconfont icon-iconset0156'
  },

]
const searchs = [
  {
    url: 'https://www.baidu.com/s',
    key: 'word',
    params: {},
    name: '百度',
    iconClass: 'iconfont icon-baidu',
  },
  {
    url: 'https://www.google.com/search',
    key: 'q',
    params: {},
    name: '谷歌',
    iconClass: 'iconfont icon-chrome',
  },
  {
    url: 'https://cn.bing.com/search',
    key: 'q',
    params: {},
    name: '必应',
    iconClass: 'iconfont icon-yingyong',
  },
  {
    url: 'https://dict.youdao.com/search',
    key: 'q',
    params: {},
    name: '翻译',
    iconClass: 'iconfont icon-translate',
  },
  {
    url: 'https://xueshu.baidu.com/s',
    key: 'wd',
    params: {},
    name: '学术',
    iconClass: 'iconfont icon-md-school',
  },
  {
    url: 'https://image.baidu.com/search/index',
    key: 'word',
    params: {
      tn: 'baiduimage',
    },
    name: '搜图',
    iconClass: 'iconfont icon-md-image',
  },
  {
    url: 'https://duckduckgo.com/',
    key: 'q',
    params: {},
    name: '匿名',
    iconClass: 'iconfont icon-md-cube',
  },
  {
    url: 'localhost',
    key: 'instation',
    params: {},
    name: '站内',
    iconClass: 'iconfont icon-md-planet',
  },
  // {
  //   url: "https://quark.sm.cn/s",
  //   key: "q",
  //   params: {},
  //   name: "夸克",
  //   iconClass: "iconfont icon-md-planet",
  // },
];
</script>
<style lang="scss" scoped>
.head {
  display: flex;
  height: 75px;
  line-height: 75px;
  padding: 0 40px;
  background-color: transparent;
  color: #fff;
  .menu {
    display: flex;
  }
  .my {
    display: flex;
  }
  .flex-grow {
    flex-grow: 1;
  }
}
</style>