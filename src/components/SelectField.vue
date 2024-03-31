<template>
  <div class="select-wrapper">
    <button ref="selectOpenButtonRef" class="select__button" :disabled="disabled" @click="onOpenButtonClicked">
      <span v-if="buttonText">{{ buttonText }}:&nbsp;</span>
      <span v-show="!selectedItemsText" class="ml-5">{{ emptyText }}</span>
      <strong v-show="selectedItemsText" class="select__button-text">{{ selectedItemsText }}</strong>
      <span class="i i-chevron-down i_20 ml-5"></span>
    </button>
    <div v-show="isDropdownOpen" class="select__menu" v-on-click-outside="onSelectClickOutside">
      <SearchField v-if="showSearch" v-model="searchText" class="select__menu-search" />
      <ul class="select__list">
        <li
          v-for="item in itemsToShow"
          :key="item[idName]"
          class="select__item"
          :class="{ select__item_selected: selectedItemsIds.includes(item[idName]) }"
        >
          <button class="select__item-button" @click="selectItem(item)">
            <span class="select__item-text">
              {{ item[valueName] }}
            </span>
            <span class="select__item-icon i i-check i_20"> </span>
          </button>
        </li>
      </ul>
      <div v-if="!itemsToShow.length && searchText" class="select__list-empty">Ничего не найдено</div>
      <div v-if="multiple" class="select__menu-buttons">
        <button class="select__menu-button" @click="selectAll">Выбрать все</button>
        <button class="select__menu-button" @click="removeAll">Снять выбор</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { vOnClickOutside } from '@vueuse/components'

import SearchField from '@/components/SearchField.vue'

import { ref, watch, computed } from 'vue'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: { type: [Object, Number, String], default: () => ({}) },
  items: { type: Array, default: () => [] },
  idName: { type: String, default: 'id' },
  valueName: { type: String, default: 'text' },
  multiple: { type: Boolean, default: false },
  hasSearch: { type: Boolean, default: false },
  emptyText: { type: String, default: '' },
  buttonText: { type: String, default: '' },
  valueAsString: { type: Boolean, default: true },
  allowEmpty: { type: Boolean, default: true },
  showSearch: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

const selectOpenButtonRef = ref(null)

let searchText = ref('')
let isDropdownOpen = ref(false)

const selectedItems = ref([])

const onOpenButtonClicked = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}
const findSelectedItemIndexById = (id) => {
  return selectedItems.value.findIndex((item) => item[props.idName] === id)
}
const selectItem = (item) => {
  const index = findSelectedItemIndexById(item[props.idName])
  if (index === -1) {
    if (props.multiple) {
      selectedItems.value.push(item)
    } else {
      selectedItems.value = [item]
      isDropdownOpen.value = false
    }
  } else {
    if (props.allowEmpty || selectedItems.value.length > 1) selectedItems.value.splice(index, 1)
  }
}
const selectAll = () => {
  selectedItems.value = transformedItems.value
}
const removeAll = () => {
  selectedItems.value = []
}

const normalizeValue = (val) => {
  return props.valueAsString ? { [props.idName]: val, [props.valueName]: val } : val
}

const transformedItems = computed(() =>
  props.items.map((item) => (props.valueAsString ? { [props.idName]: item, [props.valueName]: item } : item))
)

const itemsToShow = computed(() =>
  transformedItems.value.filter((item) => String(item[props.valueName]).includes(searchText.value))
)

const selectedItemsIds = computed(() => selectedItems.value.map((item) => item[props.idName]))
const selectedItemsText = computed(() => {
  const length = selectedItems.value.length
  return length ? `${selectedItems.value[0][props.valueName]}${length > 1 ? ' + ' + (length - 1) : ''}` : ''
})

const onSelectClickOutside = [
  () => {
    isDropdownOpen.value = false
  },
  { ignore: [selectOpenButtonRef] }
]

watch(
  () => props.modelValue,
  (val, vala) => {
    if (JSON.stringify(vala) === JSON.stringify(val)) return
    let items = []
    if (Array.isArray(val)) items = val
    else if (val) items = [val]
    selectedItems.value = items.map(normalizeValue)
  },
  { immediate: true }
)
watch(isDropdownOpen, () => {
  searchText.value = ''
})

const emitValuePrepareFunc = (() => {
  return props.valueAsString ? (value) => value[props.valueName] : (value) => value
})()

watch(
  selectedItems,
  (val) => {
    const items = val.map(emitValuePrepareFunc)
    emit('update:modelValue', props.multiple ? items : items[0] || null)
  },
  { deep: true }
)
</script>

<style lang="scss">
.select {
  margin-top: 8px;
  position: relative;
  &__button {
    border: 1px solid var(--black);
    background-color: transparent;
    border-radius: 8px;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: fit-content;
    max-width: 100%;
    &:disabled {
      cursor: not-allowed;
    }
    &-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  &__menu {
    position: absolute;
    z-index: 5;
    width: 240px;
    padding: 16px 0px;
    border-radius: 16px;
    border: 1px solid var(--gray-05);
    background-color: white;
    box-shadow:
      0px 0px 0px 4px rgba(0, 0, 0, 0.04),
      0px 0px 0px 2px rgba(0, 0, 0, 0.08);
    &-buttons {
      display: flex;
      padding: 12px 23px 0px 23px;
      justify-content: space-between;
      align-items: flex-start;
      align-self: stretch;
    }
    &-button {
      padding: 0;
      background-color: transparent;
      border: none;
      display: flex;
      height: 24px;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      font-weight: 400;
      line-height: 24px;
      color: var(--black);
      transition: 0.3s ease;
      @media (hover: hover) {
        &:hover {
          color: var(--black);
        }
      }
    }
    &-search {
      margin: 0 16px 16px;
    }
  }
  &__list {
    max-height: 300px;
    overflow-y: auto;
    &-empty {
      padding: 0 16px;
      font-size: 14px;
      font-weight: 700;
      line-height: 24px;
      color: var(--black);
    }
  }
  &__item {
    &-button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 24px;
      width: 100%;
      background-color: transparent;
      border: none;
      font-size: 14px;
      font-weight: 400;
      line-height: 24px;
      color: var(--black);
      transition: var(--transition);
      @media (hover: hover) {
        &:hover {
          background-color: var(--gray-05);
        }
      }
    }

    &-text {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    &-icon {
      display: none;
    }
    &_selected {
      .select__item {
        &-button {
          background-color: var(--gray-05);
          @media (hover: hover) {
            &:hover {
              background-color: var(--gray-015);
            }
          }
        }
        &-icon {
          display: block;
        }
      }
    }
  }
}
</style>
