<script setup lang="ts">
import axios from 'axios'
import { VDataTable } from 'vuetify/labs/VDataTable'
import { baseStore } from '@/store/hr/base'
import { ref } from 'vue'

const headers = [
  { title: '현재년도', key: 'applyYear', width: 110 },
  { title: '점심종료시간', key: 'lunchEndTime', width: 140 },
  { title: '저녁종료시간', key: 'dinnerEndTime', width: 140 },
  { title: '미팅시간', key: 'attendTime', width: 140 },
  { title: '저녁미팅종료', key: 'overEndTime', width: 140 },
  { title: '쉬는시간', key: 'quitTime', width: 140 },
  { title: '점심근무시간', key: 'lunchStartTime', width: 140 },
  { title: '야간근무시간', key: 'nightEndTime', width: 140 },
  { title: '저녁근무시간', key: 'dinnerStartTime', width: 140 },
]

const baseWorktimeList = ref([])
const tab = ref('personal-info')

onMounted(() => {
  fetchBaseWorkTime()
})

const fetchBaseWorkTime = async () => {
  try {
    const response = await axios.get('http://localhost:8282/hr/base/baseWorkTimeList')

    console.log('----- response.data -----', response.data)
    baseWorktimeList.value = response.data.gridRowJson
    console.log('----- baseWorktimeList -----', baseWorktimeList)
    console.log('[baseWorkTime]', baseWorktimeList.value)
  }
  catch (e) { console.error(e) }
}

// 미들웨어 적용
// const fetchBaseWorkTime = async () => {
//     await baseStore().SEARCH_BASE_WORK_TIME()
//     console.log('----- baseStore.baseWorktimeList 1 -----', baseStore.baseWorktimeList)
//     baseWorktimeList.value = await baseStore.baseWorktimeList
//     console.log('----- baseStore.baseWorktimeList 2 -----', baseStore.baseWorktimeList)
//     console.log('----- baseWorktimeList.value -----', baseWorktimeList.value)
// }
</script>

<template>
  <h1 class="mb-6">
    기준근무시간관리
  </h1>
  <VCard>
    <VTabs
      v-model="tab"
      height="70"
    >
      <VTab value="personal-info">
        기준근무시간관리
      </VTab>
    </VTabs>
  </VCard>
  <VDataTable
    :headers="headers"
    :items="baseWorktimeList"
    :items-per-page="10"
    fixed-header
  />
</template>
