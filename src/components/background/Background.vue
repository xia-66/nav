<template>
  <div class="home-wallpaper" >
    <section class="bg" ></section>
    <div class="bg-shadow" ></div>
    <div class="bg-fiiter" ></div>
  </div>
</template>
<script>

</script>

<style lang="scss" scoped>
.home-wallpaper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-position: center center;
    background-size: cover;
    background-image: url(/src/assets/img/wallpaper/j2k25v.webp);
  }
  @media screen and (max-width: 414px) {
    .bg {
      background-image: url(/src/assets/img//wallpaper/khadmv.webp);
    }
  }
  .bg-shadow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .bg-fiiter {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
}
.fullscreen {
  width: 100% !important;
  height: 100% !important;
}
</style>
