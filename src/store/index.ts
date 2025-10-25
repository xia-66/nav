import { defineStore } from 'pinia'

export const useMainStore = defineStore('mainStore', {
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
        }
      ]
    }
  },
  getters: {},
  actions: {},

  persist: true
})
