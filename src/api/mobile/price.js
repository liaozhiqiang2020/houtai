import request from '@/utils/request'

// 查询价格列表
export function listPrice(query) {
  return request({
    url: '/mobile/price/list',
    method: 'get',
    params: query
  })
}

// 查询价格详细
export function getPrice(id) {
  return request({
    url: '/mobile/price/' + id,
    method: 'get'
  })
}

// 新增价格
export function addPrice(data) {
  return request({
    url: '/mobile/price',
    method: 'post',
    data: data
  })
}

// 修改价格
export function updatePrice(data) {
  return request({
    url: '/mobile/price',
    method: 'put',
    data: data
  })
}

// 删除价格
export function delPrice(id) {
  return request({
    url: '/mobile/price/' + id,
    method: 'delete'
  })
}

// 导出价格
export function exportPrice(query) {
  return request({
    url: '/mobile/price/export',
    method: 'get',
    params: query
  })
}