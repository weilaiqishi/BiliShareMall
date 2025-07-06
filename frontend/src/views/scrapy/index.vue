<script setup lang="ts">
import { type Ref, computed, onMounted, onUnmounted, ref } from 'vue'
import { useLoadingBar, useMessage } from 'naive-ui'
import { Play, StopSharp } from '@vicons/ionicons5'
import axios from 'axios'

import ScopeChoose from '@/views/scrapy/modules/scope-choose.vue'

import { getToken } from '@/store/modules/auth/shared'
import { ScrapyItem } from '../../../../types/scrapy'
import ScrapyItemInfo from './scrapyItemInfo.vue'

const message = useMessage()
const priceRange = ref([100, 200])
const rateRange = ref([50, 100])
const seleteOrder = ref('totalrank')
const loadingBar = useLoadingBar()
interface TimeHash {
  [key: number]: Date | undefined // 键是数字，值是 Date 对象
}
const finishTimeHash: Ref<TimeHash> = ref<TimeHash>({})
const failedTimeHash: Ref<TimeHash> = ref<TimeHash>({})

interface Product {
  value: string
  /** The token */
  label: string
}
interface Order {
  value: string
  /** The token */
  label: string
}
const nowIdx = ref<number>(-1)
const currentScrapy = computed(() => {
  alert(nowIdx.value)
  return scrapyList.value.find((item) => item.ID === nowIdx.value)
})

const scrapyList = ref<ScrapyItem[]>([])
const products = ref<Product[]>([
  { value: '2_175', label: '景品' },
  { value: '2_142', label: '比例手办' },
  { value: '2_121', label: 'Q版手办' },
  { value: '2_122', label: '可动手办' },
  { value: '2_124', label: '盒蛋' },
  { value: '2_829', label: '雕像' },
  { value: '2_869', label: '周边配件' },
  { value: '2_889', label: '谷子' },
  { value: '2_890', label: '日用品' },
  { value: '2_892', label: '服饰鞋包' },
  { value: '2_893', label: '文创文具' },
  { value: '2_894', label: '扭蛋' },
  { value: '2_895', label: '其他' },
  { value: '2_896', label: '棉花娃娃' },
  { value: '2_897', label: 'BJD娃娃' },
  { value: '2_848', label: '毛绒玩偶' },
  { value: '2_898', label: '3c数码' },
  { value: '2_899', label: '键盘鼠标' },
  { value: '2_900', label: '耳机' },
  { value: '2_905', label: '痛包' },
  { value: '2_906', label: '食品' },
  { value: '2_926', label: '手机' },
  { value: '2_807', label: '模型' },
  { value: '2_903', label: '兵人' },
  { value: '2_737', label: '漫画' },
  { value: '2_736', label: '画集' },
  { value: '2_891', label: 'CD唱片' },
  { value: '2_860', label: '轻小说' },
  { value: '2_825', label: '其他出版物' },
  { value: '2_888', label: '写真集' },
  { value: '2_902', label: '卡牌' },
  { value: '2_681', label: '潮玩' },
  { value: '2_941', label: '积木' },
  { value: '2_874', label: '磁力赏' },
  { value: '2_876', label: '一番赏' },
  { value: '2_939', label: '惊喜赏' },
])
const orders = ref<Order[]>([
  { value: 'totalrank', label: '综合' },
  { value: 'sale', label: '销量' },
  { value: 'pubtime', label: '新品' },
  { value: 'price_asc', label: '价格升序' },
  { value: 'price_desc', label: '价格降序' },
])
const producesNameMap = products.value.reduce<Record<string, string>>(
  (acc, product) => {
    acc[product.value] = product.label
    return acc
  },
  {},
)

const ordersNameMap = orders.value.reduce<Record<string, string>>(
  (acc, order) => {
    acc[order.value] = order.label
    return acc
  },
  {},
)
const seleteProduct = ref('2_175')
function addScrapy() {
  if (!seleteProduct.value) {
    message.error('类型不能为空')
    return
  }
  const searchParams = {
    keyword: keyword.value,
    filters: '',
    priceFlow: String(priceRange.value[0]) || '',
    priceCeil: String(priceRange.value[1]) || '',
    sortType: 'pubtime',
    sortOrder: '',
    pageIndex: 1,
    userId: '',
    state: '',
    scene: '',
    termQueries: [
      {
        field: 'category',
        values: [seleteProduct.value],
      },
    ],
    rangeQueries: [],
    extra: [],

    seleteProduct: seleteProduct.value,
    seleteOrder: seleteOrder.value,
  }
  switch (seleteOrder.value) {
    case 'price_asc':
      searchParams.sortType = 'price'
      searchParams.sortOrder = 'asc'
      break
    case 'price_desc':
      searchParams.sortType = 'price'
      searchParams.sortOrder = 'desc'
      break
    default: {
      searchParams.sortType = seleteOrder.value
      break
    }
  }
  const newItem: Pick<ScrapyItem, 'Name' | 'Cookie' | 'searchParams'> = {
    Name: scrapyName.value,
    Cookie: getToken(),
    searchParams: searchParams,
  }

  axios
    .post('http://localhost:3000/api/scrapy/items', newItem)
    .then((response) => {
      if (response.status === 200) {
        message.success('添加成功')
        getAllItems()
      } else {
        message.error('添加失败')
      }
    })
    .catch((error) => {
      console.error('Add scrapy item failed:', error)
      message.error('添加失败')
    })
}

const scrapyName = ref('')
const keyword = ref('')
function searchCategory() {
  const searchParams = {
    keyword: keyword.value,
    filters: '',
    priceFlow: String(priceRange.value[0]) || '',
    priceCeil: String(priceRange.value[1]) || '',
    sortType: 'pubtime',
    sortOrder: '',
    pageIndex: 1,
    userId: '',
    state: '',
    scene: '',
    termQueries: [
      {
        field: 'category',
        values: [seleteProduct.value],
      },
    ],
    rangeQueries: [],
    extra: [],
  }
  switch (seleteOrder.value) {
    case 'price_asc':
      searchParams.sortType = 'price'
      searchParams.sortOrder = 'asc'
      break
    case 'price_desc':
      searchParams.sortType = 'price'
      searchParams.sortOrder = 'desc'
      break
    default: {
      searchParams.sortType = seleteOrder.value
      break
    }
  }
  axios
    .post('http://localhost:3000/api/search/category', searchParams, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      console.log('Search successful:', searchParams, response.data)
      message.success('搜索成功')
    })
    .catch((error) => {
      console.error('Search failed:', searchParams, error)
      message.error('搜索失败')
    })
}

function handleClose(idx: number) {
  if (nowIdx.value > 0) {
    message.warning(`请先关闭爬虫`)
    return
  }
  loadingBar.start()
  axios
    .delete(
      `http://localhost:3000/api/scrapy/items/${scrapyList.value[idx].ID}`,
    )
    .then((response) => {
      if (response.status === 200) {
        message.success(`删除成功`)
        getAllItems()
      } else {
        message.error(`删除失败`)
      }
    })
    .catch((error) => {
      console.error('Delete scrapy item failed:', error)
      message.error(`删除失败`)
    })
    .finally(() => {
      loadingBar.finish()
    })
}
function handleRun(idx: number) {
  if (nowIdx.value === scrapyList.value[idx].ID) {
    message.warning(`已启动`)
    return
  }
  loadingBar.start()
  axios
    .post('http://localhost:3000/api/scrapy/run', {
      taskId: scrapyList.value[idx].ID,
      cookie: getToken(),
    })
    .then((response) => {
      if (response.status === 200) {
        message.success(`爬虫任务 ${scrapyList.value[idx].ID} 已启动`)
        nowIdx.value = scrapyList.value[idx].ID
        getAllItems()
      } else {
        message.error(`启动失败`)
      }
    })
    .catch((error) => {
      console.error('Start scrapy task failed:', error)
      message.error(`启动失败`)
    })
    .finally(() => {
      loadingBar.finish()
    })
}

function handleStop() {
  loadingBar.start()
  axios
    .post('http://localhost:3000/api/scrapy/stop', {
      taskId: nowIdx.value,
    })
    .then((response) => {
      if (response.status === 200) {
        message.success(`爬虫任务 ${nowIdx.value} 已停止`)
        nowIdx.value = -1
        getAllItems()
      } else {
        message.error(`停止失败`)
      }
    })
    .catch((error) => {
      console.error('Stop scrapy task failed:', error)
      message.error(`停止失败`)
    })
    .finally(() => {
      loadingBar.finish()
    })
}

function getAllItems() {
  axios
    .get('http://localhost:3000/api/scrapy/items')
    .then((response) => {
      if (response.status === 200) {
        scrapyList.value = response.data
      } else {
        message.error('获取爬虫列表失败')
      }
    })
    .catch((error) => {
      console.error('Get scrapy items failed:', error)
      message.error('获取爬虫列表失败')
    })
}

function pollNowRunningTask() {
  axios
    .get('http://localhost:3000/api/scrapy/running-task')
    .then((response) => {
      if (response.status === 200) {
        nowIdx.value = response.data.taskId
      } else {
        message.error('获取当前运行任务失败')
      }
    })
    .catch((error) => {
      console.error('Get now running task failed:', error)
      message.error('获取当前运行任务失败')
    })
}

let intervalId: any
onMounted(() => {
  getAllItems()
  intervalId = setInterval(pollNowRunningTask, 3000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<template>
  <NSpace vertical size="large">
    <NCard class="card-wrapper" title="添加爬取类型">
      <template #header-extra>
        <NButton @click="searchCategory">
          <template #icon>
            <icon-ic-round-plus />
          </template>
          搜索
        </NButton>
        <NButton @click="addScrapy">
          <template #icon>
            <icon-ic-round-plus />
          </template>
          添加
        </NButton>
      </template>

      <NSpace vertical size="large">
        <NFormItem label="爬虫名">
          <NInput v-model:value="scrapyName" placeholder="请输入爬虫名" />
        </NFormItem>
        <NCollapse default-expanded-names="3">
          <NCollapseItem title="关键词">
            <NInput v-model:value="keyword" placeholder="请输入关键词" />
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
            <template #header-extra
              >价格范围：{{ priceRange[0] }} 到 {{ priceRange[1] }} 元</template
            >
          </NCollapseItem>
          <NCollapseItem title="类型" name="3">
            <NFlex wrap>
              <NRadioButton
                v-for="product in products"
                :key="product.value"
                :value="product.value"
                :label="product.label"
                @click="seleteProduct = product.value"
                :checked="seleteProduct === product.value"
                size="large"
              />
            </NFlex>
            <template #header-extra
              >选择类型：
              {{ producesNameMap[seleteProduct ?? '无'] ?? '无' }}</template
            >
          </NCollapseItem>
          <NCollapseItem title="顺序" name="3">
            <NFlex>
              <NRadioGroup v-model:value="seleteOrder" name="productType">
                <NRadioButton
                  v-for="order in orders"
                  :key="order.value"
                  :value="order.value"
                  :label="order.label"
                />
              </NRadioGroup>
            </NFlex>
            <template #header-extra
              >顺序： {{ ordersNameMap[seleteOrder ?? '无'] ?? '无' }}</template
            >
          </NCollapseItem>
        </NCollapse>
      </NSpace>
    </NCard>

    <NCard class="running-card" title="当前运行">
      <NEmpty v-if="currentScrapy" description="暂无"></NEmpty>
      <div v-if="currentScrapy">
        <NSpace justify="space-around" size="large">
          <ScrapyItemInfo :scrapy="currentScrapy"></ScrapyItemInfo>
          <NButton
            class="custom-button"
            strong
            ghost
            circle
            round
            size="large"
            @click="() => handleStop()"
          >
            <template #icon>
              <NIcon>
                <StopSharp />
              </NIcon>
            </template>
          </NButton>
        </NSpace>
      </div>
    </NCard>

    <NCard
      v-for="(scrapy, idx) in scrapyList"
      :key="scrapy.ID"
      :value="idx"
      :title="scrapy.Name"
      closable
      @close="() => handleClose(idx)"
    >
      <NSpace vertical size="large">
        <NAlert
          v-if="finishTimeHash[scrapy.ID]"
          title="执行完成"
          type="success"
        >
          完成时间：{{ finishTimeHash[scrapy.ID] }}
        </NAlert>
        <NAlert v-if="failedTimeHash[scrapy.ID]" title="执行失败" type="error">
          错误时间：{{ failedTimeHash[scrapy.ID] }}
        </NAlert>
        <NSpace justify="space-around" size="large">
          <ScrapyItemInfo :scrapy="scrapy"></ScrapyItemInfo>
          <NButton
            class="custom-button"
            strong
            ghost
            circle
            round
            size="large"
            @click="() => handleRun(idx)"
          >
            <template #icon>
              <NIcon>
                <Play />
              </NIcon>
            </template>
          </NButton>
        </NSpace>
      </NSpace>

      <template #header-extra>
        <NFlex>
          <NTime class="custom-time" :time="new Date(scrapy.CreateTime)" />
        </NFlex>
      </template>
    </NCard>
  </NSpace>
</template>

<style lang="css">
.custom-button {
  margin-top: 12px;
}

.custom-time {
  color: gray;
}

.running-card {
  background-color: #dbf5ca;
  /* 自定义背景颜色 */
  color: #333;
  /* 自定义文本颜色 */
  border: 1px solid #ccc;
  /* 自定义边框颜色 */
}
</style>
