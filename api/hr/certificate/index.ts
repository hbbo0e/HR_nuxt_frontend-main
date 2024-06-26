import { hrApi } from '@/api'

// Api
const CERT_URL = '/certificate'

/**
 * 증명서 신청 삭제
 */
function removeCertificateRequest(payload: any) {
  return hrApi.post(`${CERT_URL}/deleteCertificateOne`, payload)
}

/**
 * 증명서 신청 수정
 */
function updateCertificateRequest(payload: any) {
  return hrApi.post(`${CERT_URL}/updateCertificate`, payload)
}

// 재직 증명서 조회

function selectCertificateListRequest(payload: any) {
  return hrApi.get(`${CERT_URL}/selectCertificateList`, payload)
}

export { removeCertificateRequest, updateCertificateRequest, selectCertificateListRequest }
