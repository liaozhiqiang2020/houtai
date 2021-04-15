import request from '@/utils/request'

// 查询商品购买记录列表
export function listDetail(query) {
  return request({
    url: '/mobile/detail/list',
    method: 'get',
    params: query
  })
}

// 查询商品购买记录详细
export function getDetail(id) {
  return request({
    url: '/mobile/detail/' + id,
    method: 'get'
  })
}

// 新增商品购买记录
export function addDetail(data) {
  return request({
    url: '/mobile/detail',
    method: 'post',
    data: data
  })
}

// 修改商品购买记录
export function updateDetail(data) {
  return request({
    url: '/mobile/detail',
    method: 'put',
    data: data
  })
}

// 删除商品购买记录
export function delDetail(id) {
  return request({
    url: '/mobile/detail/' + id,
    method: 'delete'
  })
}

// 导出商品购买记录
export function exportDetail(query) {
  return request({
    url: '/mobile/detail/export',
    method: 'get',
    params: query
  })
}