import request from '@/utils/request'

// 查询缴费信息列表
export function listTuition(query) {
  return request({
    url: '/mobile/tuition/list',
    method: 'get',
    params: query
  })
}

// 查询缴费信息详细
export function getTuition(id) {
  return request({
    url: '/mobile/tuition/' + id,
    method: 'get'
  })
}

// 新增缴费信息
export function addTuition(data) {
  return request({
    url: '/mobile/tuition',
    method: 'post',
    data: data
  })
}

// 修改缴费信息
export function updateTuition(data) {
  return request({
    url: '/mobile/tuition',
    method: 'put',
    data: data
  })
}

// 删除缴费信息
export function delTuition(id) {
  return request({
    url: '/mobile/tuition/' + id,
    method: 'delete'
  })
}

// 导出缴费信息
export function exportTuition(query) {
  return request({
    url: '/mobile/tuition/export',
    method: 'get',
    params: query
  })
}

