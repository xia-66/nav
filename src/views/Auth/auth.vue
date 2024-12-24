<template>
  <div></div>
</template>
<script lang="ts" setup>
import { AuthAPPID } from '@/config/index'
import { useRoute } from 'vue-router'
const router = useRoute()
const from = router.query.origin
let thisAppid = AuthAPPID
const redirect_url = encodeURIComponent(import.meta.env.VITE_WEBURL_API + from)
window.location.href = `https://oauth.henau.edu.cn/oauth2_connect/authorize?appid=${thisAppid}&redirect_uri=${redirect_url}&response_type=code&scope=henauapi_userinfo&state=STATE#henau_redirect`
</script>
