import { defineStore } from 'pinia'
import { restSalary, clientSalary } from '@/api/hr/restTemplate'

export const restTemplateStore = defineStore('restTemplateStore', {
  state: () => ({
    approveResponse: [],
  }),

  // ---------------------------- 월 급여 등록 ----------------------------
  actions: {
    async REST_SALARY(payload: any) {
      try {
        console.log("----- REST_SALARY -----")
        const response = await restSalary(payload)

        console.log("----- response.data -----", response.data)
        this.approveResponse = response.data

        return response.data.errorMsg
      }
      catch (err: any) {
        throw new Error(err)
      }
    },
    async CLIENT_SALARY(payload: any) {
      try {
        console.log("----- CLIENT_SALARY -----")
        const response = await clientSalary(payload)

        this.approveResponse = response.data
        console.log("----- response.data -----", response.data)

        return response.data.errorMsg
      }
      catch (err: any) {
        throw new Error(err)
      }
    },
  },
})
