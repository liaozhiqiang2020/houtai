import request from '@/utils/request'

// 查询学员报名列表
export function listUp(query) {
  return request({
    url: '/mobile/up/list',
    method: 'get',
    params: query
  })
}

// 查询学员报名详细
export function getUp(id) {
  return request({
    url: '/mobile/up/' + id,
    method: 'get'
  })
}

// 新增学员报名
export function addUp(data) {
  return request({
    url: '/mobile/up',
    method: 'post',
    data: data
  })
}

// 修改学员报名
export function updateUp(data) {
  return request({
    url: '/mobile/up',
    method: 'put',
    data: data
  })
}

// 删除学员报名
export function delUp(id) {
  return request({
    url: '/mobile/up/' + id,
    method: 'delete'
  })
}

// 导出学员报名
export function exportUp(query) {
  return request({
    url: '/mobile/up/export',
    method: 'get',
    params: query
  })
}