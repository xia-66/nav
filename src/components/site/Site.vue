<template>
  <div id="js-home-site" class="home-site">
    <section v-for="category in store.$state.site" :key="category.index" :id="`site-anchor-${category.name}`">
      <div class="site-item">
        <header :id="category.name">
          <i class="category-icon relative left-px-2 iconfont icon-tag"></i>
          <a class="category-title" :name="category.name">{{ category.name }}</a>
        </header>
        <main>
          <ul >
            <a class="relative site inherit-text" target="_blank" v-for="item in category.content" :key="item.index"
              @click="openUrl(item.url)">
              <div class="site-card inherit-text text w-px-180 sm:w-px-150">
                <div class="img-group">
                  <img v-lazy :src="`${Favicon}${item.url}`" />
                </div>
                <div class="text-group">
                  <div class="name text">{{item.name }}</div>
                  <div class="name text describe">{{ item.discribe }}</div>
                </div>
              </div>
            </a>
            <i style="width: 200px;" v-for="i in 6" :key="i.indx"></i>          
          </ul>
        </main>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useMainStore } from '@/store';
import { Favicon } from '@/config';
import { openUrl } from '@/utils'
import unloadImg from "@/assets/img/error/image-error.png"
import loadImg from '@/assets/img/loading/3.gif';
const store = useMainStore()

const vLazy = {
    // 在绑定元素插入到 DOM 中时调用
    mounted(el, binding) {
    handleLazy(el, binding);
  },
  // 当绑定元素的 VNode 更新时调用
  updated(el, binding) {
    handleLazy(el, binding);
  }
}
function handleLazy(el, binding) {
  let url = el.src;
  // 清空加载资源
  el.src = loadImg; // Vue 3 中使用空字符串代替 loadImg 占位符
  let { unload = unloadImg } = binding.value || {}; // 假设 unloadImg 是一个 URL 字符串
  // 元素进入离开可视区域触发回调
  let observe = new IntersectionObserver(([{ isIntersecting }]) => {
    if (isIntersecting) {
      el.src = url;
      el.onload = function() {
        observe.unobserve(el);
      };
      el.onerror = function() {
        // 加载失败时
        el.src = unload;
        observe.unobserve(el);
      };
    }
  }, {
    root: null, // 可选，指定 IntersectionObserver 的根
    rootMargin: '0px', // 可选，指定 IntersectionObserver 的根边缘
    threshold: 0.1 // 可选，指定 IntersectionObserver 的触发阈值
  });
  observe.observe(el);
}

</script>

<style lang="scss" scoped>
.home-site {
  flex: 1;
  position: relative;
  height: 100vh;
  // margin-top: 40vh;
  background-color: #f9fafb;
  z-index: 1;
  section {
    width: calc(100% - 20px);
    margin: 10px auto 0 auto;
    &:first-of-type {
      margin-top: 0px;
    }
    .site-item {
      padding: 10px;
      border-radius: 2px;
      background-color: #ffffff;
      box-sizing: border-box;
      header {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .category-icon {
          font-size: 20px;
          font-weight: 500;
        }
        .category-title {
          margin-left: 8px;
          font-size: 16px;
          font-weight: 500;
        }
        .selected {
          color: #ffffff;
          background-color: #60a5fa;
        }
        .tag-container {
          min-width: max-content;
        }
      }
      main {
        ul {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          // &::after {
          //   content: "";
          //   width: 100rem;
          //   // flex: 0.95;
          // }

          .site {
            margin-top: 10px;

            .pin-group {
              transition: transform 0.3s ease;
            }
            .site-card {
              @media screen and (max-width: 768px) {
                width: 160px;
              }
              position: relative;
              width: 200px;
              height: 50px;
              padding: 5px;
              display: flex;
              align-items: center;
              border-radius: 3px;
              color: #374151;
              border: 1px solid rgba(0, 0, 0, 0.02);
              box-shadow: 0px 0px 20px -5px rgba(158, 158, 158, 0.2);
              transition: box-shadow 0.3s ease;
              transition: transform 0.3s ease;
              .img-group {
                position: absolute;
                left: 10px;
                width: 42px;
                height: 42px;
                display: flex;
                justify-content: center;
                align-items: center;
                background-repeat: no-repeat;
                background-position: center center;
                background-size: 100% 100%;
                border-radius: 6px;
                overflow: hidden;
                z-index: 2;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
              .text-group {
                width: calc(100% - 50px);
                display: block;
                margin-left: 60px;
                .name {
                  font-weight: 500;
                }
                .describe {
                  color: #9ca3af;
                  font-size: 12px;
      


                }
              }
            }
            &:hover {
              .pin-group {
                transform: translateY(-2px);
              }
              .site-card {
                transform: translateY(-2px);
                box-shadow: 0 26px 40px -24px #1f2937;
              }
            }
          }
        }
      }
    }
  }
  // 动态插入样式名，实现锚点效果
  .active-anchor {
    header {
      .category-icon {
        color: #ef4444 !important;
      }
      .category-title {
        color: #ef4444 !important;
      }
    }
  }
}
</style>
