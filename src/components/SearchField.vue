<template>
  <div class="search">
    <slot name="prependText">Поиск: </slot>
    <input
      v-model="searchText"
      class="search__input"
      type="text"
      :disabled="disabled"
      @keypress.enter="$emit('search')"
    />
    <span class="search__icon i i-search i_20"></span>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  modelValue: { type: String, default: '' },
  debounce: { type: Number, default: 0 },
  disabled: { type: Boolean, default: false }
});
const emit = defineEmits(['update:modelValue', 'search']);

const searchText = ref('');
let timeout = null;

const emitFunction = computed(() => {
  return props.debounce
    ? (val) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          emit('update:modelValue', val);
        }, props.debounce);
      }
    : (val) => {
        emit('update:modelValue', val);
      };
});

watch(
  () => props.modelValue,
  (val) => {
    searchText.value = val;
  }
);
watch(searchText, (val) => emitFunction.value(val));
</script>

<style lang="scss">
.search {
  height: 40px;
  display: flex;
  align-items: center;
  border: none;
  border-bottom: 1px solid var(--gray);
  background: var(--white);
  &__icon {
    margin-left: 8px;
  }
  &__input {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    border-radius: 8px;
    border: none;
    outline: none;
    height: 100%;
    width: 100%;
    padding: 6px;
  }
}
</style>
