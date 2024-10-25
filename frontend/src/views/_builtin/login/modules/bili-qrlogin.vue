<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { NQrCode } from 'naive-ui'; // 确保你导入了 NQrCode 组件
import { GetLoginKeyAndUrl, VerifyLogin } from '~/wailsjs/go/app/App';
import { useAuthStore } from '@/store/modules/auth';
defineOptions({
  name: 'BiliQrlogin'
});
const authStore = useAuthStore();
const loginUrl = ref('');
const loading = ref(true);

let loginKey: string = '';
let checkInterval: NodeJS.Timeout | null = null;
async function initQrurl() {
  GetLoginKeyAndUrl().then(loginInfo => {
    loginUrl.value = loginInfo.login_url;
    loginKey = loginInfo.key;
    loading.value = false;
    startLoginCheck();
  });
}

function startLoginCheck() {
  if (checkInterval) {
    clearInterval(checkInterval); // 清除之前的定时器
  }

  checkInterval = setInterval(async () => {
    VerifyLogin(loginKey).then(ret => {
      if (ret.cookies !== null) {
        authStore.setCookies(ret.cookies);
        clearInterval(checkInterval!);
      }
    });
  }, 3000);
}

onMounted(async () => {
  await initQrurl();
});
</script>

<template>
  <NSpin :show="loading" size="large" class="spin-container">
    <NSpace vertical>
      <NQrCode v-if="loginUrl" :value="loginUrl" :size="200" :padding="0" />
      <template #description>加载二维码中</template>
    </NSpace>
  </NSpin>
</template>

<style scoped>
.spin-container {
  display: flex;
  justify-content: center;
  height: 300px; /* 设置合适的高度 */
}
</style>
