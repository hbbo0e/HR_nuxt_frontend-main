import { hrApi } from '@/api'

// Api
const SALARY_URL = '/server'

// ------------------------- 월 급여 등록 -------------------------

function approveSalary(payload: any){
    console.log("------ approveSalary ------", payload)
  
    return hrApi.post(`${SALARY_URL}/approveSalary`, payload)
  }


export { approveSalary }