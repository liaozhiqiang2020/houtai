import request from '@/utils/request'

// 查询首页按钮权限列表
export function listMenubtn(query) {
  return request({
    url: '/mobile/menubtn/list',
    method: 'get',
    params: query
  })
}

// 查询首页按钮权限详细
export function getMenubtn(id) {
  return request({
    url: '/mobile/menubtn/' + id,
    method: 'get'
  })
}

// 新增首页按钮权限
export function addMenubtn(data) {
  return request({
    url: '/mobile/menubtn',
    method: 'post',
    data: data
  })
}

// 修改首页按钮权限
export function updateMenubtn(data) {
  return request({
    url: '/mobile/menubtn',
    method: 'put',
    data: data
  })
}

// 删除首页按钮权限
export function delMenubtn(id) {
  return request({
    url: '/mobile/menubtn/' + id,
    method: 'delete'
  })
}

// 导出首页按钮权限
export function exportMenubtn(query) {
  return request({
    url: '/mobile/menubtn/export',
    method: 'get',
    params: query
  })
}