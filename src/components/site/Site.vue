<template>
  <div id="js-home-site" class="home-site" >
    <section>
      <div class="site-item" >
        <header>
          <i class="category-icon relative left-px-2 iconfont icon-tag"></i>
          <a class="category-title" name="category.typeName">{{ '自定义网站' }}</a>
          <div class="w-full pb-px-4 my-px-4 overflow-x-auto overflow-y-hidden">
            <div class="inherit-bg tag-container flex items-center p-px-4 bg-gray-100 rounded-full">
              <!-- 默认占位标签 -->
              <!-- <div class="inherit-bg flex-shrink-0 text-12px text text-center w-px-80 px-px-2 py-px-4 ml-px-6 first:ml-px-0 hover:bg-blue-400 hover:text-white transition rounded-full pointer" title="全部">
                全部
              </div> -->
              <!-- 其他标签 -->
              <!-- <div
                class="inherit-bg flex-shrink-0 text-12px text text-center w-px-80 px-px-2 py-px-4 ml-px-6 first:ml-px-0 hover:bg-blue-400 hover:text-white transition rounded-full pointer"
              >
                {{ '热'}}
              </div> -->
            </div>
          </div>
        </header>
        <main>
          <ul v-balance>
            <a class="relative site inherit-text" target="_blank">
              <div class="pin-group absolute -top-px-6 right-px-0 w-full h-px-16 flex justify-end">
                <div  class="w-px-16 h-px-16 mr-px-2 text-12px text-gray-0 flex justify-center items-center rounded-full">
                  <template >
                    {{ 2424 }}
                  </template>
                </div>
              </div>

              <div class="site-card inherit-text text w-px-180 sm:w-px-150">
                <div class="img-group">
                  <img v-lazy src="/src/assets/img/wallpaper/1.jpeg" />
                </div>
                <div class="text-group">
                  <div class="name text">{{ 'changjkjg' }}</div>
                  <div class="describe inherit-text text">{{ 'ajfkskjlafkj' }}</div>
                </div>
              </div>
            </a>
          </ul>
        </main>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.home-site {
  flex: 1;
  position: relative;
  height: 100vh;
  margin-top: 40vh;
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
          .site {
            margin-top: 10px;
            .pin-group {
              transition: transform 0.3s ease;
            }
            .site-card {
              position: relative;
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
