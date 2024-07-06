import { defineStore } from "pinia";

export const useMainStore = defineStore("mainStore", {
  state: () => {
    return {
      isShowDrawer: false,
      site: {
        "category1": {
          "name": "实用工具",
          "content": [
            {
              "name": '黑羽导航',
              "url": 'https://onenav.heiyu.fun/',
              "discribe": '一个自用的导航网'
            },
            {
              name: '黑羽博客',
              url: 'https://blog.heiyu.fun/',
              discribe: '个人博客'
            },
          ]
        },
        "category2": {
          "name": "站长工具",
          "content": [
            {
              name: '黑羽导航',
              url: 'https://onenav.heiyu.fun/',
              discribe: '一个自用的导航网'
            },
            {
              name: '黑羽博客',
              url: 'https://blog.heiyu.fun/',
              discribe: '个人博客'
            },
          ]
        },
        "category3": {
          "name": "站长工具1",
          "content": [
            {
              name: '黑羽导航',
              url: 'https://onenav.heiyu.fun/',
              discribe: '一个自用的导航网'
            },
            {
              name: '黑羽博客',
              url: 'https://blog.heiyu.fun/',
              discribe: '个人博客'
            },
          ]
        },
        "category4": {
          "name": "站长工具1",
          "content": [
            {
              name: '黑羽导航',
              url: 'https://onenav.heiyu.fun/',
              discribe: '一个自用的导航网'
            },
            {
              name: '黑羽博客',
              url: 'https://blog.heiyu.fun/',
              discribe: '个人博客'
            },
          ]
        }
        , "category5": {
          "name": "站长工具2",
          "content": [
            {
              name: '黑羽导航',
              url: 'https://onenav.heiyu.fun/',
              discribe: '一个自用的导航网'
            },
            {
              name: '黑羽博客',
              url: 'https://blog.heiyu.fun/',
              discribe: '个人博客'
            },
          ]
        }, 
        "category6": {
          "name": "站长工具2",
          "content": [
            {
              name: '黑羽导航',
              url: 'https://onenav.heiyu.fun/',
              discribe: '一个自用的导航网'
            },
            {
              name: '黑羽博客',
              url: 'https://blog.heiyu.fun/',
              discribe: '个人博客'
            },
          ]
        }, 
        "category7": {
          "name": "站长工具3",
          "content": [
            {
              name: '黑羽导航',
              url: 'https://onenav.heiyu.fun/',
              discribe: '一个自用的导航网'
            },
            {
              name: '黑羽博客',
              url: 'https://blog.heiyu.fun/',
              discribe: '个人博客'
            },
          ]
        }
      },
      menu : [

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
      searchs : [
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
      ]


    };
  },
getters: { },
actions: { },

persist: true,
});
