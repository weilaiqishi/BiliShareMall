<script setup lang="ts">
import { Search } from '@vicons/ionicons5'
import { useClipboard } from '@vueuse/core'
import { NButton, NImage, PaginationProps, useMessage } from 'naive-ui'
import { h, onMounted, ref } from 'vue'

import { SearchCategoryGoodsItem } from '../../../../types/search_category_request'
import { SearchGoodsItemsParams } from '../../../../types/goods'
import { PaginatedResult } from '../../../../types/page'

import { getToken } from '@/store/modules/auth/shared'
import axios from 'axios'
const loading = ref(false)
const message = useMessage()
const searchText = ref('')

interface SortWay {
  value: number
  /** The token */
  label: string
}

const { copy, isSupported } = useClipboard()

async function handleCopy(item: SearchCategoryGoodsItem) {
  const copy_str = item.jumpUrlH5
  if (!isSupported) {
    message.error(`复制失败，请自行复制链接：${copy_str}`)
    return
  }
  await copy(copy_str)
  message.success('复制成功！')
}

const sortways = ref<SortWay[]>([
  { value: 1, label: '时间降序' },
  { value: 2, label: '价格升序' },
  { value: 3, label: '价格降序' },
])

const columns = [
  {
    title: 'itemsId',
    key: 'itemsId',
    width: 140,
  },
  {
    title: '名称',
    key: 'name',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '价格',
    key: 'price',
    width: 100,
  },
  {
    title: '图片',
    key: 'itemsImg',
    width: 100,
    height: 100,
    render(row: SearchCategoryGoodsItem) {
      return h(NImage, {
        width: '100',
        height: '100',
        src: row.itemsImg,
      })
    },
  },
  {
    title: '链接',
    key: 'itemsId',
    render(row: SearchCategoryGoodsItem) {
      return h(
        NButton,
        {
          size: 'small',
          onClick: () => handleCopy(row),
        },
        { default: () => '复制' },
      )
    },
    width: 80,
  },
]
const priceRangeEnable = ref(false)
const used = ref(false)

const priceRange = ref([0, 9999])
const sortOpt = ref(1)
const pagination = ref<PaginationProps>({
  page: 1,
  pageSize: 10,
  pageCount: 1,
})
// 数据初始化
const data = ref<SearchCategoryGoodsItem[]>([])

function search(firstPage: boolean = false) {
  loading.value = true
  axios
    .get<PaginatedResult<SearchCategoryGoodsItem>>(
      'http://localhost:3000/api/goods/items',
      {
        params: {
          name: searchText.value,
          priceFlow: priceRangeEnable.value ? priceRange.value[0] : undefined,
          priceCeil: priceRangeEnable.value ? priceRange.value[1] : undefined,
          page: firstPage ? 1 : pagination.value.page,
          pageSize: pagination.value.pageSize,
        } as SearchGoodsItemsParams,
      },
    )
    .then((response) => {
      if (response.status === 200) {
        data.value = response.data.data
        pagination.value.page = firstPage ? 1 : pagination.value.page
        pagination.value.pageCount = Math.ceil(
          response.data.total / pagination.value.pageSize!,
        )
        loading.value = false
        console.log(data.value)
      } else {
        console.log('请求失败', response.data)
        message.error('查询商品列表失败')
      }
    })
    .catch((error) => {
      console.log('请求失败', error)
      message.error('请求失败')
    })
}
onMounted(() => {
  search()
})
</script>

<template>
  <NFlex>
    <NCard class="card-wrapper" title="数据库">
      <template #header-extra>
        <NSpace size="large">
          <NInput
            v-model:value="searchText"
            clearable
            :placeholder="$t('common.keywordSearch')"
          >
            <template #prefix>
              <icon-uil-search class="text-15px text-#c2c2c2" />
            </template>
          </NInput>
          <NButton @click="() => search(true)">
            <template #icon>
              <Search></Search>
            </template>
            搜索
          </NButton>
        </NSpace>
      </template>
      <NCollapse default-expanded-names="3">
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
        <NCollapseItem title="排序" name="3">
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
      @update:page="
        (page) => {
          pagination.page = page
          search()
        }
      "
    />
  </NFlex>
</template>

<style scoped></style>
