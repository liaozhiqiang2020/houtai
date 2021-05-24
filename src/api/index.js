import request from '@/utils/request'

// 查询学员列表
export function getTodayInComeJs() {
  return request({
    url: '/mobile/sign/queryTodayIncome',
    method: 'get'
  })
}
