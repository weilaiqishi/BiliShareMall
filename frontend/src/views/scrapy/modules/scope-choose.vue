<script setup lang="ts">
defineOptions({
  name: 'ScopeChoose'
});
const props = withDefaults(
  defineProps<{
    suffix?: string;
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
  }>(),
  {
    suffix: '%',
    min: 0,
    max: 100,
    step: 1,
    precision: 2
  }
);

// 创建本地的响应式状态
const model = defineModel<number[]>('value');
model.value = [50, 100];
</script>

<template>
  <NFlex>
    <NSlider v-model:value="model" range :step="props.step" :max="props.max" :min="props.min" :precision="precision" />

    <NInputNumber v-model:value="model![0]" :precision="precision" :max="props.max" :min="props.min">
      <template #suffix>{{ props.suffix }}</template>
    </NInputNumber>
    <NInputNumber v-model:value="model![1]" :precision="precision" :max="props.max" :min="props.min">
      <template #suffix>{{ props.suffix }}</template>
    </NInputNumber>
  </NFlex>
</template>
