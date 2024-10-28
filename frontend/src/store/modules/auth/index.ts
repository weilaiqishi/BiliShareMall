import { useRoute } from 'vue-router';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { SetupStoreId } from '@/enum';
import { useRouterPush } from '@/hooks/common/router';
import { localStg } from '@/utils/storage';
import { $t } from '@/locales';
import { useRouteStore } from '../route';
import { useTabStore } from '../tab';
import { clearAuthStorage, getToken } from './shared';

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const route = useRoute();
  const routeStore = useRouteStore();
  const tabStore = useTabStore();
  const token = ref(getToken());
  const isLogin = computed(() => token.value);
  /** Is login */
  const { toLogin, redirectFromLogin } = useRouterPush(false);

  /** Reset auth store */
  async function resetStore() {
    const authStore = useAuthStore();

    clearAuthStorage();

    authStore.$reset();

    if (!route.meta.constant) {
      await toLogin();
    }

    tabStore.cacheTabs();
    routeStore.resetStore();
  }

  async function setCookies(cookies: string, redirect = true) {
    localStg.set('cookies', cookies);
    token.value = cookies;
    await routeStore.initAuthRoute();
    await redirectFromLogin(redirect);
    if (routeStore.isInitAuthRoute) {
      window.$notification?.success({
        title: $t('page.login.common.loginSuccess'),
        content: $t('page.login.common.welcomeBack'),
        duration: 4500
      });
      tabStore.clearTabs();
    }
  }
  return {
    token,
    resetStore,
    setCookies,
    isLogin
  };
});
