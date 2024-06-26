import { hrApi } from '@/api'

// Api
const SALARY_URL = '/server'

// ------------------------- 월 급여 등록 -------------------------

function restSalary(payload: any) {
  console.log('------ REST Salary ------', payload)

  return hrApi.post(`${SALARY_URL}/restSalary`, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

function clientSalary(payload: any) {
  console.log('------ Client Salary ------', payload)

  return hrApi.post(`${SALARY_URL}/clientSalary`, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export { restSalary, clientSalary }
