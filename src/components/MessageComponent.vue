<template>
  <div class="message">
    <div
      class="messages__item"
      :class="{ messages__item_red: source.Level === 'WARN', messages__item_gray: source.Level === 'TRACE' }"
    >
      {{ source.Timestamp }}&nbsp;&nbsp;&nbsp;{{ source.Level }}&nbsp;&nbsp;&nbsp;<span
        v-html="source.messageReplaced || source.Message"
      ></span>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({ source: { type: Object, default: () => ({}) } })
</script>
<style lang="scss">
.message__item {
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
</style>
