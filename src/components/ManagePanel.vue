<template>
  <div class="panel">
    <div class="panel__fields">
      <SelectField
        v-model="selectedLevel"
        class="panel__fields-select"
        empty-text="любой"
        button-text="Отфильтровать по уровню"
        :items="levels"
        :disabled="!isLoaded"
        multiple
        @update:modelValue="$emit('selectLevel', $event)"
      />
      <div class="panel__fields-search-container">
        <SearchField
          v-model="searchText"
          :debounce="200"
          :disabled="!isLoaded"
          @update:modelValue="$emit('searchTextChanged', $event)"
          class="panel__fields-search"
        />
        <div class="panel__fields-search-info">
          <p v-if="searchText" class="panel__fields-count-match">Совпадений: {{ count }}</p>
          <p v-if="count" class="panel__fields-count-of">Элемент: {{ current + 1 }} из {{ count }}</p>
          <div class="panel__fields-count-buttons">
            <button v-if="count" class="button" :disabled="!current" @click="$emit('update:current', current - 1)">
              Назад
            </button>
            <button
              v-if="count"
              class="button"
              :disabled="current === count - 1"
              @click="$emit('update:current', current + 1)"
            >
              Вперёд
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'

import SearchField from '@/components/SearchField.vue'
import SelectField from '@/components/SelectField.vue'

const props = defineProps({
  count: { type: Number, default: 0 },
  current: { type: Number, default: 0 },
  isLoaded: { type: Boolean, default: false }
})

const searchText = ref('')

const levels = ['DEBUG', 'TRACE', 'WARN']
const selectedLevel = ref('')
</script>
<style lang="scss">
.panel {
  &__fields {
    display: flex;
    &-select {
      flex-shrink: 0;
    }
    &-search {
      flex-grow: 1;
      max-width: 500px;
      &-container {
        margin-left: 30px;
      }
    }

    &-count {
      &-of {
        margin-top: 5px;
      }
      &-buttons {
        margin-top: 5px;
        display: flex;
        gap: 5px;
      }
    }
  }
}
@media (max-width: 767px) {
  .panel {
    &__fields {
      flex-direction: column;
      &-search {
        &-container {
          margin: 30px 0 0 0;
        }
        &-info {
          margin-top: 5px;
        }
      }
    }
  }
}
@media (min-width: 768px) {
  .panel {
    &__fields {
      &-search {
        &-container {
          flex-grow: 1;
          display: flex;
        }
        &-info {
          display: flex;
          flex-direction: column-reverse;
          align-items: flex-end;
          margin-left: 30px;
        }
      }
      &-count {
        &-buttons {
          margin-top: 0px;
        }
      }
    }
  }
}
</style>
