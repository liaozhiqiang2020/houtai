import request from '@/utils/request'

// 查询教练信息列表
export function listCoach(query) {
  return request({
    url: '/mobile/coach/list',
    method: 'get',
    params: query
  })
}

// 查询教练信息详细
export function getCoach(id) {
  return request({
    url: '/mobile/coach/' + id,
    method: 'get'
  })
}

// 新增教练信息
export function addCoach(data) {
  return request({
    url: '/mobile/coach',
    method: 'post',
    data: data
  })
}

// 修改教练信息
export function updateCoach(data) {
  return request({
    url: '/mobile/coach',
    method: 'put',
    data: data
  })
}

// 删除教练信息
export function delCoach(id) {
  return request({
    url: '/mobile/coach/' + id,
    method: 'delete'
  })
}

// 导出教练信息
export function exportCoach(query) {
  return request({
    url: '/mobile/coach/export',
    method: 'get',
    params: query
  })
}