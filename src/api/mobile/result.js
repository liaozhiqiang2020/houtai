import request from '@/utils/request'

// 查询抽奖结果列表
export function listResult(query) {
  return request({
    url: '/mobile/result/list',
    method: 'get',
    params: query
  })
}

// 查询抽奖结果详细
export function getResult(id) {
  return request({
    url: '/mobile/result/' + id,
    method: 'get'
  })
}

// 新增抽奖结果
export function addResult(data) {
  return request({
    url: '/mobile/result',
    method: 'post',
    data: data
  })
}

// 修改抽奖结果
export function updateResult(data) {
  return request({
    url: '/mobile/result',
    method: 'put',
    data: data
  })
}

// 删除抽奖结果
export function delResult(id) {
  return request({
    url: '/mobile/result/' + id,
    method: 'delete'
  })
}

// 导出抽奖结果
export function exportResult(query) {
  return request({
    url: '/mobile/result/export',
    method: 'get',
    params: query
  })
}