import request from '@/utils/request'

// 查询微信用户表列表
export function listInfo(query) {
  return request({
    url: '/mobile/info/list',
    method: 'get',
    params: query
  })
}

// 查询微信用户表详细
export function getInfo(id) {
  return request({
    url: '/mobile/info/' + id,
    method: 'get'
  })
}

// 新增微信用户表
export function addInfo(data) {
  return request({
    url: '/mobile/info',
    method: 'post',
    data: data
  })
}

// 修改微信用户表
export function updateInfo(data) {
  return request({
    url: '/mobile/info',
    method: 'put',
    data: data
  })
}

// 删除微信用户表
export function delInfo(id) {
  return request({
    url: '/mobile/info/' + id,
    method: 'delete'
  })
}

// 导出微信用户表
export function exportInfo(query) {
  return request({
    url: '/mobile/info/export',
    method: 'get',
    params: query
  })
}