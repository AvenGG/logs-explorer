<template>
  <div class="main-view">
    <ManagePanel
      :count="count"
      v-model:current="scrollId"
      @searchTextChanged="searchText = $event"
      @selectLevel="selectedLevels = $event"
    />
    <MessagesList
      class="main-view__messages-list"
      :messages="messagesToShow"
      :is-loaded="isLoaded"
      :scroll-element-id="scrollElementId"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'

import Controller from '@/api/Controller'

import MessagesList from '@/components/MessagesList.vue'
import ManagePanel from '@/components/ManagePanel.vue'
const messages = ref([])
const searchText = ref('')
const isLoaded = ref(false)
const scrollId = ref(null)

onMounted(async () => {
  const controller = await new Controller()
  controller.onMessage((payload) => {
    console.log('onMessage: ', payload)
    if (payload.type === 'data') {
      messages.value.push(...payload.data)
      isLoaded.value = true
    }
  })
})

const selectedLevels = ref([])
const searchIndexes = ref([])
const messagesWithSearchText = ref([])
const count = ref(0)

const filteredByLevel = computed(() => {
  if (!selectedLevels.value.length) return messages.value
  return messages.value.filter((message) => selectedLevels.value.includes(message.Level))
})
const messagesToShow = computed(() => (searchText.value ? messagesWithSearchText.value : filteredByLevel.value))

const scrollElementId = computed(() => searchIndexes.value[scrollId.value] || null)

watch(
  () => [searchText.value, filteredByLevel.value],
  ([searchText, filteredByLevel]) => {
    count.value = 0
    scrollId.value = null
    if (!searchText) {
      searchIndexes.value = []
      messagesWithSearchText.value = []
      return
    }
    filteredByLevel.forEach((item, index) => {
      const occurrences = item.Message.match(new RegExp(searchText, 'g'))
      const occurrencesCount = (occurrences || []).length

      if (occurrencesCount) {
        const currentMessageOccurancesIndexes = Array.from({ length: occurrencesCount }, (v, k) => k + count.value)
        count.value += occurrencesCount
        currentMessageOccurancesIndexes.forEach((idx) => {
          searchIndexes.value[idx] = item.id
        })
        messagesWithSearchText.value[index] = {
          ...item,
          messageReplaced: item.Message.replaceAll(
            searchText,
            `<span style="background-color: var(--salad)">${searchText}</span>`
          )
        }
      } else {
        messagesWithSearchText.value[index] = item
      }
    })
  }
)
</script>

<style lang="scss">
.main-view {
  min-height: 100vh;
  padding: 30px;
  transition: 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  &__messages-list {
    margin-top: 50px;
  }
}
@media (max-width: 767px) {
  .main-view {
    padding: 15px;
  }
}
</style>
