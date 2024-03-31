<template>
  <div class="messages">
    <LoaderComponent v-if="!isLoaded" />
    <p class="messages__empty" v-else-if="!messages.length">Сообщений с текущими фильтрами не найдено</p>
    <virtual-list
      ref="virtualListRef"
      style="max-height: 80vh; overflow-y: auto"
      :style="messages.length && 'padding: 10px'"
      :data-key="'id'"
      :data-sources="messages"
      :data-component="messageComponent"
      :keeps="100"
    />
  </div>
</template>
<script setup>
import LoaderComponent from '@/components/LoaderComponent.vue'
import messageComponent from '@/components/MessageComponent.vue'
import VirtualList from 'vue3-virtual-scroll-list'

import { ref, watch } from 'vue'

const props = defineProps({
  messages: { type: Array, default: () => [] },
  isLoaded: { type: Boolean, default: false },
  scrollElementId: { type: Number, default: null }
})
const virtualListRef = ref(null)

watch(
  () => props.scrollElementId,
  (val) => {
    if (val === null) return
    virtualListRef.value.scrollToIndex(val)
  }
)
</script>
<style lang="scss">
.messages {
  border: 1px solid var(--violet);
  &__empty {
    padding: 20px;
    font-size: 24px;
    font-weight: 500;
    text-align: center;
  }
  &__item {
    white-space: pre;
    margin-top: 6px;
    font-variant-numeric: tabular-nums;
    &_red {
      color: var(--red);
    }
    &_gray {
      color: var(--gray);
    }
  }
}
@media (max-width: 767px) {
  .messages {
    font-size: 12px;
  }
}
</style>
