import { hrApi } from '@/api'

// Api
const SALARY_URL = '/server'

// ------------------------- 월 급여 등록 -------------------------

function approveSalary(payload: any){
    console.log("------ approveSalary ------", payload._value)
  
    return hrApi.post(`${SALARY_URL}/approveSalary`, payload._value)
  }


export { approveSalary }