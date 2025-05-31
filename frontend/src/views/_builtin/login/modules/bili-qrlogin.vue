<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { NQrCode } from 'naive-ui';
import { useAuthStore } from '@/store/modules/auth';
import { getLoginKeyAndUrl, verifyLogin } from '@/service/login';

defineOptions({
  name: 'BiliQrlogin'
});

const authStore = useAuthStore();
const loginUrl = ref('');
const loading = ref(true);

let loginKey: string = '';
let checkInterval: NodeJS.Timeout | null = null;

async function initQrurl() {
  try {
    const userAgent = navigator.userAgent;
    const loginInfo = await getLoginKeyAndUrl({ userAgent });
    loginUrl.value = loginInfo.url;
    loginKey = loginInfo.key;
    loading.value = false;
    startLoginCheck();
  } catch (error) {
    console.error('获取二维码失败:', error);
  }
}

function startLoginCheck() {
  if (checkInterval) {
    clearInterval(checkInterval);
  }
  checkInterval = setInterval(async () => {
    try {
      console.log(`loginKey -> `, loginKey)
      if (loginKey) {
        const userAgent = navigator.userAgent;
        const result = await verifyLogin({ key: loginKey, userAgent });
        if (result.cookie) {
          authStore.setCookies(result.cookie);
          clearInterval(checkInterval!);
        }
        console.log(`verifyLogin result -> `, result)
      }

    } catch (error) {
      console.error('验证登录状态失败:', error);
    }
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
  height: 300px;
}
</style>
