<template>
  <div id="js-home-site" class="home-site">
    <div v-if="navSections.length === 0" class="site-container">
      <el-empty description="暂无数据" />
    </div>

    <template v-else>
      <section v-for="category in navSections" :id="category.anchorId" :key="category.id">
        <div class="site-item">
          <header :id="category.name">
            <i class="category-icon relative left-px-2 iconfont icon-tag"></i>
            <a class="category-title" :name="category.name">{{ category.name }}</a>
          </header>
          <main>
            <ul>
              <a
                v-for="item in category.content"
                :key="item.id"
                class="relative site inherit-text"
                :href="item.url"
                target="_blank"
                rel="noopener noreferrer"
                @click.prevent="openUrl(item.url)"
              >
                <div class="site-card inherit-text text w-px-180 sm:w-px-150">
                  <div class="img-group">
                    <img loading="lazy" :src="`${Favicon}${item.url}`" :alt="item.name" @error="handleImageError" />
                  </div>
                  <div class="text-group">
                    <div class="name text">{{ item.name }}</div>
                    <div class="name text describe">{{ item.description }}</div>
                  </div>
                </div>
              </a>
            </ul>
          </main>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Favicon } from '@/config'
import { openUrl } from '@/utils'
import { navSections } from '@/utils/navData'
import unloadImg from '@/assets/img/error/image-error.png'

const handleImageError = (event: Event) => {
  const image = event.currentTarget as HTMLImageElement
  if (image.src.endsWith(unloadImg)) return
  image.src = unloadImg
}
</script>

<style lang="scss" scoped>
.home-site {
  flex: 1;
  position: relative;
  height: 100vh;
  background-color: transparent;
  z-index: 1;

  .site-container {
    width: min(90vw, 1440px);
    margin: 0 auto;
    background-color: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 18px 48px rgba(31, 41, 55, 0.1);
    -webkit-backdrop-filter: blur(18px) saturate(135%);
    backdrop-filter: blur(18px) saturate(135%);
  }

  section {
    width: min(90vw, 1440px);
    margin: 10px auto 0 auto;
    content-visibility: auto;
    contain-intrinsic-size: 320px;

    &:first-of-type {
      margin-top: 0;
    }

    &:last-of-type {
      margin-bottom: 18px;
    }

    @media screen and (max-width: 768px) {
      width: calc(100% - 20px);
    }

    .site-item {
      padding: 20px;
      border: 1px solid var(--glass-border);
      border-radius: 8px;
      background-color: var(--glass-bg);
      box-sizing: border-box;
      box-shadow: 0 18px 48px rgba(31, 41, 55, 0.1);
      -webkit-backdrop-filter: blur(18px) saturate(135%);
      backdrop-filter: blur(18px) saturate(135%);

      header {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 14px;

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
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;

          @media screen and (max-width: 768px) {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }

          .site {
            min-width: 0;

            .site-card {
              position: relative;
              width: 100%;
              height: 64px;
              padding: 8px;
              display: flex;
              align-items: center;
              border-radius: 3px;
              color: var(--gray-700);
              border: 1px solid var(--glass-border);
              background-color: var(--glass-bg-soft);
              box-shadow: 0 10px 24px rgba(31, 41, 55, 0.06);
              transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;

              .img-group {
                position: absolute;
                left: 10px;
                width: 48px;
                height: 48px;
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
                margin-left: 66px;

                .name {
                  font-weight: 500;
                }

                .describe {
                  color: #9ca3af;
                  font-size: 12px;
                  margin-top: 4px;
                }
              }
            }

            &:hover {
              .site-card {
                transform: translateY(-2px);
                background-color: var(--glass-bg-strong);
                box-shadow: 0 26px 40px -24px var(--gray-800);
              }
            }
          }
        }
      }

      @media screen and (max-width: 768px) {
        padding: 14px;

        main {
          ul {
            .site {
              .site-card {
                height: 58px;
                padding: 6px;

                .img-group {
                  left: 8px;
                  width: 42px;
                  height: 42px;
                }

                .text-group {
                  width: calc(100% - 52px);
                  margin-left: 52px;

                  .name {
                    font-size: 13px;
                  }

                  .describe {
                    font-size: 11px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .active-anchor {
    header {
      .category-icon,
      .category-title {
        color: #ef4444 !important;
      }
    }
  }
}

.el-empty {
  padding: 40px;
  border-radius: 8px;
  background-color: var(--gray-0);
}
</style>
