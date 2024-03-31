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
import { onMounted, ref, computed, watch, nextTick } from 'vue'

import Controller from '@/api/Controller'

import MessagesList from '@/components/MessagesList.vue'
import ManagePanel from '@/components/ManagePanel.vue'
const messages = ref([])
const searchText = ref('')
const isLoaded = ref(false)
const scrollId = ref(0)

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

const scrollElementId = computed(() => searchIndexes.value[scrollId.value]?.id || 0)

let previousMessageProps = {
  string: '',
  obj: null
}
watch(
  () => [scrollElementId.value, scrollId.value],
  ([elementId, scrollId]) => {
    const message = messagesWithSearchText.value[elementId]
    if (!message) return
    if (previousMessageProps.obj) {
      previousMessageProps.obj.messageReplaced = previousMessageProps.string
    }
    previousMessageProps.obj = message
    previousMessageProps.string = message.messageReplaced

    const occurenceStringPosition = searchIndexes.value[scrollId]?.occurenceStringPosition

    let occurence = 0
    message.messageReplaced = message.Message.replace(new RegExp(searchText.value, 'g'), (match) => {
      return `<span style="background-color: var(${occurence++ === occurenceStringPosition ? '--orange' : '--salad'});display: inline-block">${match}</span>`
    })
  }
)

watch(
  () => [searchText.value, filteredByLevel.value],
  ([searchText, filteredByLevel]) => {
    count.value = 0
    scrollId.value = 0
    if (!searchText || !filteredByLevel.length) {
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
        currentMessageOccurancesIndexes.forEach((itemIndex, idx) => {
          searchIndexes.value[itemIndex] = { id: item.id, occurenceStringPosition: idx }
        })
        messagesWithSearchText.value[index] = {
          ...item,
          messageReplaced: item.Message.replaceAll(
            searchText,
            `<span style="background-color: var(--salad);display: inline-block">${searchText}</span>`
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
