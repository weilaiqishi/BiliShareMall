<script setup lang="ts">
import { ref } from 'vue';
import { useMessage } from 'naive-ui';
import ScopeChoose from '@/views/scrapy/modules/scope-choose.vue';

const message = useMessage();
const priceRange = ref([100, 200]);
const rateRange = ref([50, 100]);
interface Product {
  value: string;
  /** The token */
  label: string;
}
interface Scrapy {
  product: string;
  productName: string;
  priceRange: number[];
  rateRange: number[];
}
const scrapyList = ref<Scrapy[]>([]);
const products = ref<Product[]>([
  { value: '2312', label: '手办' },
  { value: '2066', label: '模型' },
  { value: '2331', label: '周边' },
  { value: '2273', label: '3C' },
  { value: 'fudai_cate_id', label: '福袋' }
]);
const producesNameMap = products.value.reduce<Record<string, string>>((acc, product) => {
  acc[product.value] = product.label;
  return acc;
}, {});
const seleteProduct = ref(null);
function addScrapy() {
  if (!seleteProduct.value) {
    message.error('类型不能为空');
    return;
  }
  scrapyList.value.push({
    priceRange: priceRange.value.slice(),
    rateRange: rateRange.value.slice(),
    product: seleteProduct.value!,
    productName: producesNameMap[seleteProduct.value!]
  });
}

function handleClose(idx: number) {
  scrapyList.value.splice(idx, 1);
  message.info(`Card Close${idx}`);
}
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
        <NCollapse>
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
          <NCollapseItem title="类型">
            <NFlex>
              <NRadioGroup v-model:value="seleteProduct" name="productType" default-value="2312">
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
        </NCollapse>
      </NSpace>
    </NCard>

    <NCard
      v-for="(scrapy, idx) in scrapyList"
      :key="idx"
      :value="idx"
      :title="` ${scrapy.productName}，${scrapy.rateRange[0]}~${scrapy.rateRange[1]} %，  ${scrapy.priceRange[0]}~${scrapy.priceRange[1]}元`"
      closable
      @close="() => handleClose(idx)"
    >
      <NFlex></NFlex>
    </NCard>
  </NSpace>
</template>
