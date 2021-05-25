import request from '@/utils/request'

// 查询今日学费收入
export function getTodayInComeJs() {
  return request({
    url: '/mobile/sign/queryTodayIncome',
    method: 'get'
  })
}
// 查询昨日学费收入
export function getLastDayInComeJs() {
  return request({
    url: '/mobile/sign/queryLastDayIncome',
    method: 'get'
  })
}

//查询本月学费收入
export function getMonthInComeJs() {
  return request({
    url: '/mobile/sign/queryMonthIncome',
    method: 'get'
  })
}

//查询上月学费收入
export function getLastMonthInComeJs() {
  return request({
    url: '/mobile/sign/queryLastMonthIncome',
    method: 'get'
  })
}

