import { defineStore } from 'pinia'
import { approveSalary } from '@/api/hr/restTemplate'

export const restTemplateStore = defineStore('restTemplateStore', {
  state: () => ({
    approveResponse: [],
  }),

  // ---------------------------- 월 급여 등록 ----------------------------
  actions: {
    async APPROVE_SALARY(payload: any) {
      try {
        const response = await approveSalary(payload)

        console.log(response.data.approveResponse)
        this.approveResponse = response.data.approveResponse
      }
      catch (err: any) {
        throw new Error(err)
      }
    },
  },
})
