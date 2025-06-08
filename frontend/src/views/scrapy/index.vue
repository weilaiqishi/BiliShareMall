<script setup lang="ts">
import { type Ref, onMounted, ref } from 'vue';
import { useLoadingBar, useMessage } from 'naive-ui';
import { Play, StopSharp } from '@vicons/ionicons5';
import ScopeChoose from '@/views/scrapy/modules/scope-choose.vue';
// import {
//   CreateScrapyItem,
//   DeleteScrapyItem,
//   DoneTask,
//   GetNowRunTaskId,
//   ReadAllScrapyItems,
//   StartTask
// } from '~/wailsjs/go/app/App';
import { dao } from '~/wailsjs/go/models';
import { getToken } from '@/store/modules/auth/shared';
import axios from 'axios';
import { EventsOn } from '~/wailsjs/runtime/runtime';
const message = useMessage();
const priceRange = ref([100, 200]);
const rateRange = ref([50, 100]);
const seleteOrder = ref('totalrank');
const loadingBar = useLoadingBar();
interface TimeHash {
  [key: number]: Date | undefined; // 键是数字，值是 Date 对象
}
const finishTimeHash: Ref<TimeHash> = ref<TimeHash>({});
const failedTimeHash: Ref<TimeHash> = ref<TimeHash>({});

interface Product {
  value: string;
  /** The token */
  label: string;
}
interface Order {
  value: string;
  /** The token */
  label: string;
}
const nowIdx = ref<number>(-1);
const scrapyList = ref<dao.ScrapyItem[]>([]);
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
  { value: '2_939', label: '惊喜赏' }
]);
const orders = ref<Order[]>([
  { value: 'totalrank', label: '综合' },
  { value: 'sale', label: '销量' },
  { value: 'pubtime', label: '新品' },
  { value: 'price_asc', label: '价格升序' },
  { value: 'price_desc', label: '价格降序' },
]);
const producesNameMap = products.value.reduce<Record<string, string>>((acc, product) => {
  acc[product.value] = product.label;
  return acc;
}, {});

const ordersNameMap = orders.value.reduce<Record<string, string>>((acc, order) => {
  acc[order.value] = order.label;
  return acc;
}, {});
const seleteProduct = ref('2_175');
function addScrapy() {
  if (!seleteProduct.value) {
    message.error('类型不能为空');
    return;
  }
  const item = dao.ScrapyItem.createFrom({
    priceRange: priceRange.value.slice(),
    rateRange: rateRange.value.slice(),
    product: seleteProduct.value!,
    order: seleteOrder.value!,
    nums: 0,
    increaseNumber: 0,
    nextToken: ''
  });
  // CreateScrapyItem(item).then(id => {
  //   if (id === -1) {
  //     message.error('添加失败');
  //     return;
  //   }
  //   item.id = id;
  //   getAllItems().then(value => {
  //     scrapyList.value = value.slice();
  //     message.success('添加成功');
  //   });
  // });
}

const keyword = ref("");
function searchCategory() {
  const searchParams = {
    cookieStr: getToken(),
    "keyword": keyword.value,
    "filters": "",
    "priceFlow": priceRange.value[0] || "",
    "priceCeil": priceRange.value[1] || "",
    "sortType": "pubtime",
    "sortOrder": "",
    "pageIndex": 1,
    "userId": "",
    "state": "",
    "scene": "",
    "termQueries": [
      {
        "field": "category",
        "values": [
          seleteProduct.value
        ]
      }
    ],
    "rangeQueries": [],
    "extra": []
  }
  switch (seleteOrder.value) {
    case 'price_asc':
      searchParams.sortType = 'price';
      searchParams.sortOrder = 'asc'
      break;
    case 'price_desc':
      searchParams.sortType = 'price';
      searchParams.sortOrder = 'desc'
      break;
    default: {
      searchParams.sortType = 'seleteOrder.value';
      break;
    }
  }
  axios.post('http://localhost:3000/api/search/category', searchParams, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      console.log('Search successful:', searchParams, response.data);
      message.success('搜索成功');
    })
    .catch(error => {
      console.error('Search failed:', searchParams, error);
      message.error('搜索失败');
    });
}

function handleClose(idx: number) {
  if (nowIdx.value !== -1) {
    message.warning(`请先关闭爬虫`);
    return;
  }
  loadingBar.start();
  // DeleteScrapyItem(scrapyList.value[idx].id)
  //   .then(() => {
  //     getAllItems().then(value => {
  //       scrapyList.value = value.slice();
  //       loadingBar.finish();
  //       message.success(`删除成功`);
  //     });
  //   })
  //   .catch(() => {
  //     loadingBar.error();
  //     message.error(`删除失败`);
  //   });
}
function handleRun(idx: number) {
  if (nowIdx.value === idx) {
    message.warning(`已启动`);
    return;
  }
  loadingBar.start();
  // StartTask(scrapyList.value[idx].id, getToken())
  //   .then(() => {
  //     nowIdx.value = idx;
  //     loadingBar.finish();
  //     message.success(`启动成功`);
  //   })
  //   .catch(() => {
  //     loadingBar.error();
  //     message.error(`启动失败`);
  //   });
}

function handldStop(idx: number) {
  loadingBar.start();
  // DoneTask(idx)
  //   .then(() => {
  //     nowIdx.value = -1;
  //     loadingBar.finish();
  //     message.success(`已停止`);
  //   })
  //   .catch(() => {
  //     loadingBar.error();
  //     message.error(`停止失败`);
  //   });
}

async function getAllItems() {
  // const result = await ReadAllScrapyItems();
  // return result.slice(); // Return a shallow copy of the result
}
// EventsOn('updateScrapyItem', c => {
//   const item = c as dao.ScrapyItem;
//   const idx = scrapyList.value.findIndex(it => it.id === item.id);
//   scrapyList.value[idx] = c;
//   nowIdx.value = idx;
// });
// EventsOn('scrapy_failed', c => {
//   message.error(`任务失败，可能是由于风控，请稍后再试`);
//   const idx = c as number;
//   const now = new Date();
//   failedTimeHash.value[idx] = now;
//   nowIdx.value = -1;
// });
// EventsOn('scrapy_finished', c => {
//   const idx = c as number;
//   const now = new Date();
//   finishTimeHash.value[idx] = now;
//   nowIdx.value = -1;
// });

// EventsOn('scrapy_wait', c => {
//   const second = c as number;
//   message.warning(`出现风控，等待${second}秒`);
// });

// EventsOn('scrapyItem_get_failed', _ => {
//   message.warning(`当前爬取配置有问题`);
// });
onMounted(async () => {
  loadingBar.start();
  // scrapyList.value = await getAllItems();
  // const nowRunTaskId = await GetNowRunTaskId();
  // scrapyList.value.forEach((item, index) => {
  //   if (item.id === nowRunTaskId) {
  //     nowIdx.value = index;
  //   }
  // });
  loadingBar.finish();
});
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
            <template #header-extra>价格范围：{{ priceRange[0] }} 到 {{ priceRange[1] }} 元</template>
          </NCollapseItem>
          <NCollapseItem title="类型" name="3">
            <NFlex wrap>
              <NRadioButton v-for="product in products" :key="product.value" :value="product.value"
                :label="product.label" @click="seleteProduct = product.value" :checked="seleteProduct === product.value"
                size="large" />
            </NFlex>
            <template #header-extra>选择类型： {{ producesNameMap[seleteProduct ?? '无'] ?? '无' }}</template>
          </NCollapseItem>
          <NCollapseItem title="顺序" name="3">
            <NFlex>
              <NRadioGroup v-model:value="seleteOrder" name="productType">
                <NRadioButton v-for="order in orders" :key="order.value" :value="order.value" :label="order.label" />
              </NRadioGroup>
            </NFlex>
            <template #header-extra>顺序： {{ ordersNameMap[seleteOrder ?? '无'] ?? '无' }}</template>
          </NCollapseItem>
        </NCollapse>
      </NSpace>
    </NCard>

    <NCard class="running-card" title="当前运行">
      <NEmpty v-if="nowIdx === -1" description="暂无"></NEmpty>
      <div v-if="nowIdx !== -1">
        <NSpace justify="space-around" size="large">
          <NStatistic label="类型" :value="producesNameMap[scrapyList[nowIdx].product]"></NStatistic>
          <NStatistic label="爬取顺序" :value="ordersNameMap[scrapyList[nowIdx].order]"></NStatistic>
          <NStatistic label="折扣" :value="`${scrapyList[nowIdx].rateRange[0]}~${scrapyList[nowIdx].rateRange[1]}`"
            :tabular-nums="true"></NStatistic>
          <NStatistic label="价格" :value="`${scrapyList[nowIdx].priceRange[0]}~${scrapyList[nowIdx].priceRange[1]}`"
            :tabular-nums="true"></NStatistic>
          <NStatistic label="爬取次数" :value="scrapyList[nowIdx].nums"></NStatistic>
          <NStatistic label="增加数目" :value="scrapyList[nowIdx].increaseNumber"></NStatistic>
          <NButton class="custom-button" strong ghost circle round size="large"
            @click="() => handldStop(scrapyList[nowIdx].id)">
            <template #icon>
              <NIcon>
                <StopSharp />
              </NIcon>
            </template>
          </NButton>
        </NSpace>
      </div>
    </NCard>

    <NCard v-for="(scrapy, idx) in scrapyList" :key="idx" :value="idx"
      :title="`${producesNameMap[scrapy.product]} ${ordersNameMap[scrapy.order]}`" closable
      @close="() => handleClose(idx)">
      <NSpace vertical size="large">
        <NAlert v-if="finishTimeHash[scrapyList[idx].id]" title="执行完成" type="success">
          完成时间：{{ finishTimeHash[scrapyList[idx].id] }}
        </NAlert>
        <NAlert v-if="failedTimeHash[scrapyList[idx].id]" title="执行失败" type="error">
          错误时间：{{ failedTimeHash[scrapyList[idx].id] }}
        </NAlert>
        <NSpace justify="space-around" size="large">
          <NStatistic label="折扣" :value="`${scrapy.rateRange[0]}~${scrapy.rateRange[1]}`" :tabular-nums="true">
          </NStatistic>
          <NStatistic label="价格" :value="`${scrapy.priceRange[0]}~${scrapy.priceRange[1]}`" :tabular-nums="true">
          </NStatistic>
          <NStatistic label="爬取次数" :value="scrapy.nums"></NStatistic>
          <NStatistic label="增加数目" :value="scrapy.increaseNumber"></NStatistic>
          <NButton class="custom-button" strong ghost circle round size="large" @click="() => handleRun(idx)">
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
          <NTime class="custom-time" :time="new Date(scrapy.createTime)" />
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
