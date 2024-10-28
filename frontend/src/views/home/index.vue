<script setup lang="ts">
import { useMessage } from 'naive-ui';
import { onMounted, ref } from 'vue';
import { ListC2CItem } from '~/wailsjs/go/app/App';
import type { app } from '~/wailsjs/go/models';
const loading = ref(false);
const message = useMessage();
const searchText = ref('');

interface SortWay {
  value: number;
  /** The token */
  label: string;
}

const sortways = ref<SortWay[]>([
  { value: 1, label: '时间降序' },
  { value: 2, label: '价格升序' },
  { value: 3, label: '价格降序' }
]);

const columns = [
  {
    title: 'ID',
    key: 'c2cItemsId',
    width: 140
  },
  {
    title: '名称',
    key: 'c2cItemsName',
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '总数量',
    key: 'totalItemsCount',
    width: 100
  },
  {
    title: '价格',
    key: 'price',
    width: 100
  }
];
const timeRange = ref<[number, number]>([1183135260000, Date.now()]);
const timeRangeEnable = ref(false);
const priceRangeEnable = ref(false);

const priceRange = ref([0, 9999]);
const sortOpt = ref(1);
const pagination = ref({
  page: 1,
  pageCount: 1,
  pageSize: 10
});
// 数据初始化
const data = ref<app.C2CItemVO[]>([]);

function search() {
  loading.value = true;
  ListC2CItem(
    pagination.value.page,
    pagination.value.pageSize,
    searchText.value,
    sortOpt.value,
    timeRangeEnable.value ? timeRange.value[0] : -1,
    timeRangeEnable.value ? timeRange.value[1] : -1,
    priceRangeEnable.value ? priceRange.value[0] : -1,
    priceRangeEnable.value ? priceRange.value[1] : -1
  )
    .then(result => {
      pagination.value.page = result.currentPage;
      data.value = result.items;
      pagination.value.pageCount = result.totalPages;
      loading.value = false;
    })
    .catch(_err => {
      message.error('请求失败');
    });
}
onMounted(() => {
  // search();
});
</script>

<template>
  <NCard class="card-wrapper" title="添加爬取类型">
    <template #header-extra>
      <NButton @click="search">
        <template #icon>
          <icon-ic-round-plus />
        </template>
        搜索
      </NButton>
    </template>
    <NCollapse default-expanded-names="3">
      <NCollapseItem title="时间">
        <NDatePicker v-model:value="timeRange" type="datetimerange" clearable />
        <template #header-extra>
          <NSpace>
            <NSwitch v-model:value="timeRangeEnable" />
          </NSpace>
        </template>
      </NCollapseItem>
      <NCollapseItem title="价格">
        <NFlex>
          <NInputNumber v-model:value="priceRange[0]" :precision="2">
            <template #suffix>元</template>
          </NInputNumber>
          <NInputNumber v-model:value="priceRange[1]" :precision="2">
            <template #suffix>元</template>
          </NInputNumber>
        </NFlex>
        <template #header-extra>
          <NSwitch v-model:value="priceRangeEnable" />
        </template>
      </NCollapseItem>
      <NCollapseItem title="类型" name="3">
        <NFlex>
          <NRadioGroup v-model:value="sortOpt" name="productType">
            <NRadioButton
              v-for="product in sortways"
              :key="product.value"
              :value="product.value"
              :label="product.label"
            />
          </NRadioGroup>
        </NFlex>
      </NCollapseItem>
    </NCollapse>
  </NCard>

  <NDataTable
    remote
    :data="data"
    :columns="columns"
    :loading="loading"
    :pagination="pagination"
    @update:page="search"
  />
</template>

<style scoped></style>
