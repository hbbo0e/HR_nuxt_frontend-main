<script setup lang="ts">
import { VDataTable } from 'vuetify/labs/VDataTable'
import SalregMonthModal from '@/components/hr/salary/SalregMonthModal.vue'
import { paginationMeta } from '@/server/utils/paginationMeta'
import { baseStore } from '@/store/hr/base'
import { restTemplateStore } from '@/store/hr/restTemplate'
import { salaryStore } from '@/store/hr/salary'

const options = ref({ page: 1, itemsPerPage: 5, sortBy: [''], sortDesc: [false] })

const search = ref('')
const selectedYear = ref('')
const selectedMonth = ref('')
const initSalaryList: any = ref([])
const monthList: any = ref([])
const yearList: any = ref([])
const approveResponse = ref('')

const monthDeductionData: any = ref({
  empCode: '',
  applyYearMonth: '',
})

const headers = [
  { title: '해당 년월', key: 'applyYearMonth', align: 'center' },
  { title: '사원 번호', key: 'empCode', align: 'center' },
  { title: '사원 명', key: 'empName', align: 'center' },
  { title: '실 지급액', key: 'realSalary', align: 'center' },
  { title: '승인상태', key: 'finalizeStatus', align: 'center' },
]

const fetchData = async () => {
  await baseStore().FETCH_MONTHLIST()
  await baseStore().FETCH_YEARLIST()

  const monthListData = baseStore().monthList
  const yearListData = baseStore().yearList

  monthList.value = monthListData ? Object.values(monthListData).map(item => item.month) : []
  yearList.value = yearListData ? Object.values(yearListData).map(item => item.year) : []
}

const fetchData2 = async () => {
  const applyYear = `${selectedYear.value}-${selectedMonth.value.trim()}`

  const initData = {
    applyYearMonth: applyYear,
    empCode: '%',
  }

  await salaryStore().SEARCH_SALARY_INIT(initData)
  initSalaryList.value = salaryStore().initSalaryList
}

// 프로시져 문제

const handleRowClick = async row => {
  const salaryData = {
    empCode: row.item.empCode,
    deptCode: row.item.deptCode,
    applyYearMonth: `${selectedYear.value}-${selectedMonth.value.trim()}`,
  }

  monthDeductionData.value = {
    empCode: row.item.empCode,
    applyYearMonth: `${selectedYear.value}-${selectedMonth.value.trim()}`,
    empName: row.item.empName,
    realSalary: row.item.realSalary,
    finalizeStatus: row.item.finalizeStatus,
  }

  console.log('----- monthDeductionData.value -----', monthDeductionData.value)

  if (row.item.finalizeStatus === 'N' || row.item.finalizeStatus === null) {
    await salaryStore().SALARY_PROCESS(salaryData)

    await salaryStore().FIND_TAX(monthDeductionData)
    salaryStore().SET_DIALOG_BTN(true)
  }

  else {
    await salaryStore().SALARY_PROCESS(salaryData)

    await salaryStore().FIND_TAX(monthDeductionData)
    await salaryStore().SET_DIALOG_BTN(false)
  }
  await salaryStore().SET_DIALOG(true)
}

const filteredData = computed(() => {
  return initSalaryList.value.filter((emp: any) => {
    return Object.values(emp).some(field => {
      if (typeof field === 'string')
        return field.toLowerCase().includes(search.value.toLowerCase())

      return false
    })
  })
})

const restTemplateApproveSalary = async () => {

  console.log('----- approveSalary.value -----', monthDeductionData.value)

  // Proxy 객체를 일반 객체로 변환
  const normalObject = JSON.parse(JSON.stringify(monthDeductionData.value))

  // 일반 객체를 JSON 객체로 변환
  const jsonObject = { data: [normalObject], }

  // JSON 객체를 JSON 문자열로 변환
  const jsonString = JSON.stringify(jsonObject, null, 2)

  console.log('----- jsonString -----', jsonString)

  const errorMsg = await restTemplateStore().REST_SALARY(jsonString)
  console.log('----- clientSalary Finish -----', errorMsg);

  alert(`급여 지급 결과 : ${errorMsg}`);
}

const clientApproveSalary = async () => {

  console.log('----- approveSalary.value -----', monthDeductionData.value)

  const normalObject = JSON.parse(JSON.stringify(monthDeductionData.value))
  const jsonObject = { data: [normalObject], }
  const jsonString = JSON.stringify(jsonObject, null, 2)

  console.log('----- jsonString -----', jsonString)

  // CLIENT_SALARY 액션 호출 및 결과를 변수에 저장
  const errorMsg = await restTemplateStore().CLIENT_SALARY(jsonString);
  console.log('----- clientSalary Finish -----', errorMsg);

  alert(`급여 지급 결과 : ${errorMsg}`);

}

onBeforeMount(fetchData)
watch([selectedYear, selectedMonth], fetchData2, { immediate: true })
</script>

<template>
  <h1 class="mb-6">
    월 급여 등록
  </h1>
  <VCard class="mb-6">
    <VCardText>
      <VRow>
        <VCol
          cols="12"
          sm="4"
        >
          <AppSelect
            v-model="selectedYear"
            label="해당 연도"
            placeholder="해당 연도"
            :items="yearList"
            clearable
            clear-icon="tabler-x"
          />
        </VCol>

        <VCol
          cols="12"
          sm="4"
        >
          <AppSelect
            v-model="selectedMonth"
            label="해당 월"
            placeholder="해당 월"
            :items="monthList"
            clearable
            clear-icon="tabler-x"
          />
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
  <VCard>
    <VCardText class="d-flex flex-wrap py-4 gap-4">
      <div class="me-3 d-flex gap-3">
        <AppSelect
          :model-value="options.itemsPerPage"
          :items="[
            { value: 5, title: '5' },
            { value: 10, title: '10' },
            { value: 25, title: '25' },
            { value: 50, title: '50' },
            { value: -1, title: 'All' },
          ]"
          style="inline-size: 6.25rem;"
          @update:model-value="options.itemsPerPage = parseInt($event, 10)"
        />
      </div>
      <VSpacer />

      <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
        <!-- 👉 Search  -->
        <div style="inline-size: 10rem;">
          <AppTextField
            v-model="search"
            placeholder="Search"
            density="compact"
          />
        </div>
      </div>
    </VCardText>
    <VDivider />
    <VDataTable
      :headers="headers"
      :items="filteredData"
      :items-per-page="options.itemsPerPage"
      :page="options.page"
      :options="options"
      @click:row="(_, row) => handleRowClick(row)"
    >
      <template #bottom>
        <VDivider />
        <VCardText class="pt-2">
          <div class="d-flex flex-wrap justify-center justify-sm-space-between gap-y-2 mt-2">
            <p class="text-sm text-disabled mb-0">
              {{ paginationMeta({ page: options.page, itemsPerPage: options.itemsPerPage }, filteredData.length) }}
            </p>
            <VPagination
              v-model="options.page"
              :total-visible="$vuetify.display.smAndDown ? 3 : 5"
              :length="Math.ceil(filteredData.length / options.itemsPerPage)"
            />
          </div>
          <VCol
            cols="12"
            sm="4"
          >
            <VBtn @click="restTemplateApproveSalary">
              급여 지급 (restTemplate)
            </VBtn>
            <VBtn @click="clientApproveSalary">
              급여 지급 (webClient)
            </VBtn>
          </VCol>
        </VCardText>
      </template>
    </VDataTable>
  </VCard>
  <SalregMonthModal :fetch-data2="fetchData2" />
</template>
