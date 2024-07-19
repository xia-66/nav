import { defineStore } from "pinia";

export const useMainStore = defineStore("mainStore", {
  state: () => {
    return {
      isShowDrawer: false,
      site: [],
      menu: [

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

      ],
      searchs: [
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
      ]
    };
  },
  getters: {},
  actions: {},

  persist: true,
});
