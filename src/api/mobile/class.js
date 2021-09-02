import request from '@/utils/request'

// 查询选课管理列表
export function listClass(query) {
  return request({
    url: '/mobile/class/list',
    method: 'get',
    params: query
  })
}

// 查询选课管理详细
export function getClass(id) {
  return request({
    url: '/mobile/class/' + id,
    method: 'get'
  })
}

// 新增选课管理
export function addClass(data) {
  return request({
    url: '/mobile/class',
    method: 'post',
    data: data
  })
}

// 修改选课管理
export function updateClass(data) {
  return request({
    url: '/mobile/class',
    method: 'put',
    data: data
  })
}

// 删除选课管理
export function delClass(id) {
  return request({
    url: '/mobile/class/' + id,
    method: 'delete'
  })
}

// 导出选课管理
export function exportClass(query) {
  return request({
    url: '/mobile/class/export',
    method: 'get',
    params: query
  })
}