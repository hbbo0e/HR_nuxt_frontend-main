<script lang="ts" setup>
import { defineProps } from 'vue'
import { baseStore } from '@/store/hr/base'

const props = defineProps(['test'])

const holiday = [
  { title: '명절', value: { holidayType: '명절', holidayCode: 'HOL001' } },
  { title: '국경일', value: { holidayType: '국경일', holidayCode: 'HOL002' } },
  { title: '종교기념일', value: { holidayType: '종교기념일', holidayCode: 'HOL003' } },
  { title: '임시공휴일', value: { holidayType: '임시공휴일', holidayCode: 'HOL005' } },
  { title: '대체공휴일', value: { holidayType: '대체공휴일', holidayCode: 'HOL006' } },
  { title: '법정기념일', value: { holidayType: '법정기념일', holidayCode: 'HOL004' } },
]

const holidayData = ref('')

const holidayList = computed(() => {
  return baseStore().holidayRow
})


const editHoliday = async () => {
  try {
    const editHolidayData = {
      applyDay: holidayList.value.applyDay, // 적용일
      holidayName: holidayList.value.holidayName, // 휴일 명칭
      holidayType: holidayData.value.holidayType, // 휴일 타입
      holidayCode: holidayData.value.holidayCode, // 휴일 타입에 따른 코드
    }

    console.log(editHolidayData)
    baseStore().MODIFY_HOLIDAY(editHolidayData)
    await props.test()
    await baseStore().SET_DIALOG(false)
  }
  catch (error) {
    console.error('휴일 수정 중 에러:', error)
  }
}

const deleteHoliday = async () => {
  try {
    const deleteHolidayData = holidayList.value.applyDay

    await baseStore().REMOVE_HOLIDAY(deleteHolidayData)
    await props.test()
    await baseStore().SET_DIALOG(false)
  }
  catch (error) {
    console.error('휴일 삭제 중 에러:', error)
  }
}
</script>

<template>
  <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
    <VDialog
      v-model="baseStore().isDialog"
      max-width="600"
    >
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="baseStore().SET_DIALOG(false)" />

      <!-- Dialog Content -->
      <VCard title="휴일 수정 및 삭제">
        <VCardText>
          <VRow>
            <VCol
              cols="12"
              sm="6"
            >
              <AppDateTimePicker
                v-model="holidayList.applyDay"
                label="적용일"
                disabled
              />
            </VCol>
            <VCol
              cols="12"
              sm="6"
            >
              <AppTextField
                v-model="holidayList.holidayName"
                label="휴일명칭"
              />
            </VCol>
            <VCol
              cols="12"
              sm="6"
            >
              <AppSelect
                v-model="holidayData"
                label="종류"
                :items="holiday"
              />
            </VCol>
          </VRow>
        </VCardText>
        <VCardText class="d-flex justify-end flex-wrap gap-3 mt-2">
          <VBtn @click="editHoliday">
            수정
          </VBtn>
          <VBtn @click="deleteHoliday">
            삭제
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
  <VCard />
</template>
