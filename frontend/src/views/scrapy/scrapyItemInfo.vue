<template>
    <NStatistic label="关键词" :value="props.scrapy.searchParams.keyword"></NStatistic>
    <NStatistic label="价格" :value="`${props.scrapy.searchParams.priceFlow}~${props.scrapy.searchParams.priceCeil}`"
        :tabular-nums="true">
    </NStatistic>
    <NStatistic label="爬取次数" :value="props.scrapy.NextToken"></NStatistic>
</template>

<script setup lang="ts">
import { ScrapyItem } from '../../../../types/scrapy';

const props = defineProps<{
    scrapy: ScrapyItem
}>()
</script>