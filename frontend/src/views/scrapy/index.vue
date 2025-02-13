<script setup lang="ts">
import { type Ref, onMounted, ref } from 'vue';
import { useLoadingBar, useMessage } from 'naive-ui';
import { Play, StopSharp } from '@vicons/ionicons5';
import ScopeChoose from '@/views/scrapy/modules/scope-choose.vue';
import {
  CreateScrapyItem,
  DeleteScrapyItem,
  DoneTask,
  GetNowRunTaskId,
  ReadAllScrapyItems,
  StartTask
} from '~/wailsjs/go/app/App';
import { dao } from '~/wailsjs/go/models';
import { getToken } from '@/store/modules/auth/shared';
import { EventsOn } from '~/wailsjs/runtime/runtime';
const message = useMessage();
const priceRange = ref([100, 200]);
const rateRange = ref([50, 100]);
const seleteOrder = ref('TIME_DESC');
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
  { value: '2312', label: '手办' },
  { value: '2066', label: '模型' },
  { value: '2331', label: '周边' },
  { value: '2273', label: '3C' },
  { value: 'fudai_cate_id', label: '福袋' }
]);
const orders = ref<Order[]>([
  { value: 'TIME_DESC', label: '时间降序' },
  { value: 'PRICE_ASC', label: '价格升序' },
  { value: 'PRICE_DESC', label: '价格降序' }
]);
const producesNameMap = products.value.reduce<Record<string, string>>((acc, product) => {
  acc[product.value] = product.label;
  return acc;
}, {});

const ordersNameMap = orders.value.reduce<Record<string, string>>((acc, order) => {
  acc[order.value] = order.label;
  return acc;
}, {});
const seleteProduct = ref('2312');
function addScrapy() {
  if (!seleteProduct.value) {
    message.error('类型不能为空');
    return;
  }
  const item = dao.ScrapyItem.createFrom({
    priceRange: priceRange.value.slice(),
    rateRange: rateRange.value.slice(),
    product: seleteProduct.value!,
    order: ordersNameMap[seleteOrder.value!],
    productName: producesNameMap[seleteProduct.value!],
    nums: 0,
    increaseNumber: 0,
    nextToken: ''
  });
  CreateScrapyItem(item).then(id => {
    if (id === -1) {
      message.error('添加失败');
      return;
    }
    item.id = id;
    getAllItems().then(value => {
      scrapyList.value = value.slice();
      message.success('添加成功');
    });
  });
}

function handleClose(idx: number) {
  if (nowIdx.value !== -1) {
    message.warning(`请先关闭爬虫`);
    return;
  }
  loadingBar.start();
  DeleteScrapyItem(scrapyList.value[idx].id)
    .then(() => {
      getAllItems().then(value => {
        scrapyList.value = value.slice();
        loadingBar.finish();
        message.success(`删除成功`);
      });
    })
    .catch(() => {
      loadingBar.error();
      message.error(`删除失败`);
    });
}
function handleRun(idx: number) {
  if (nowIdx.value === idx) {
    message.warning(`已启动`);
    return;
  }
  loadingBar.start();
  StartTask(scrapyList.value[idx].id, getToken())
    .then(() => {
      nowIdx.value = idx;
      loadingBar.finish();
      message.success(`启动成功`);
    })
    .catch(() => {
      loadingBar.error();
      message.error(`启动失败`);
    });
}

function handldStop(idx: number) {
  loadingBar.start();
  DoneTask(idx)
    .then(() => {
      nowIdx.value = -1;
      loadingBar.finish();
      message.success(`已停止`);
    })
    .catch(() => {
      loadingBar.error();
      message.error(`停止失败`);
    });
}

async function getAllItems() {
  const result = await ReadAllScrapyItems();
  return result.slice(); // Return a shallow copy of the result
}
EventsOn('updateScrapyItem', c => {
  const item = c as dao.ScrapyItem;
  const idx = scrapyList.value.findIndex(it => it.id === item.id);
  scrapyList.value[idx] = c;
  nowIdx.value = idx;
});
EventsOn('scrapy_failed', c => {
  const idx = c as number;
  const now = new Date();
  failedTimeHash.value[idx] = now;
  nowIdx.value = -1;
});
EventsOn('scrapy_finished', c => {
  const idx = c as number;
  const now = new Date();
  finishTimeHash.value[idx] = now;
  nowIdx.value = -1;
});
onMounted(async () => {
  loadingBar.start();
  scrapyList.value = await getAllItems();
  const nowRunTaskId = await GetNowRunTaskId();
  scrapyList.value.forEach((item, index) => {
    if (item.id === nowRunTaskId) {
      nowIdx.value = index;
    }
  });
  loadingBar.finish();
});
</script>

<template>
  <NSpace vertical size="large">
    <NCard class="card-wrapper" title="添加爬取类型">
      <template #header-extra>
        <NButton @click="addScrapy">
          <template #icon>
            <icon-ic-round-plus />
          </template>
          添加
        </NButton>
      </template>
      <NSpace vertical size="large">
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
            <template #header-extra>价格范围：{{ priceRange[0] }} 到 {{ priceRange[1] }} 元</template>
          </NCollapseItem>
          <NCollapseItem title="折扣">
            <ScopeChoose v-model:value="rateRange"></ScopeChoose>
            <template #header-extra>折扣范围：{{ rateRange[0] }} 到 {{ rateRange[1] }} %</template>
          </NCollapseItem>
          <NCollapseItem title="类型" name="3">
            <NFlex>
              <NRadioGroup v-model:value="seleteProduct" name="productType">
                <NRadioButton
                  v-for="product in products"
                  :key="product.value"
                  :value="product.value"
                  :label="product.label"
                />
              </NRadioGroup>
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
          <NStatistic
            label="折扣"
            :value="`${scrapyList[nowIdx].rateRange[0]}~${scrapyList[nowIdx].rateRange[1]}`"
            :tabular-nums="true"
          ></NStatistic>
          <NStatistic
            label="价格"
            :value="`${scrapyList[nowIdx].priceRange[0]}~${scrapyList[nowIdx].priceRange[1]}`"
            :tabular-nums="true"
          ></NStatistic>
          <NStatistic label="爬取次数" :value="scrapyList[nowIdx].nums"></NStatistic>
          <NStatistic label="增加数目" :value="scrapyList[nowIdx].increaseNumber"></NStatistic>
          <NButton
            class="custom-button"
            strong
            ghost
            circle
            round
            size="large"
            @click="() => handldStop(scrapyList[nowIdx].id)"
          >
            <template #icon>
              <NIcon><StopSharp /></NIcon>
            </template>
          </NButton>
        </NSpace>
      </div>
    </NCard>

    <NCard
      v-for="(scrapy, idx) in scrapyList"
      :key="idx"
      :value="idx"
      :title="`${scrapy.productName}`"
      closable
      @close="() => handleClose(idx)"
    >
      <NSpace vertical size="large">
        <NAlert v-if="finishTimeHash[scrapyList[idx].id]" title="执行完成" type="success">
          完成时间：{{ finishTimeHash[scrapyList[idx].id] }}
        </NAlert>
        <NAlert v-if="failedTimeHash[scrapyList[idx].id]" title="执行失败" type="error">
          错误时间：{{ failedTimeHash[scrapyList[idx].id] }}
        </NAlert>
        <NSpace justify="space-around" size="large">
          <NStatistic
            label="折扣"
            :value="`${scrapy.rateRange[0]}~${scrapy.rateRange[1]}`"
            :tabular-nums="true"
          ></NStatistic>
          <NStatistic
            label="价格"
            :value="`${scrapy.priceRange[0]}~${scrapy.priceRange[1]}`"
            :tabular-nums="true"
          ></NStatistic>
          <NStatistic label="爬取次数" :value="scrapy.nums"></NStatistic>
          <NStatistic label="增加数目" :value="scrapy.increaseNumber"></NStatistic>
          <NButton class="custom-button" strong ghost circle round size="large" @click="() => handleRun(idx)">
            <template #icon>
              <NIcon><Play /></NIcon>
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
  background-color: #dbf5ca; /* 自定义背景颜色 */
  color: #333; /* 自定义文本颜色 */
  border: 1px solid #ccc; /* 自定义边框颜色 */
}
</style>
