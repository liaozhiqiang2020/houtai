import request from '@/utils/request'

// 查询公告轮播列表
export function listNotice(query) {
  return request({
    url: '/mobile/notice/list',
    method: 'get',
    params: query
  })
}

// 查询公告轮播详细
export function getNotice(id) {
  return request({
    url: '/mobile/notice/' + id,
    method: 'get'
  })
}

// 新增公告轮播
export function addNotice(data) {
  return request({
    url: '/mobile/notice',
    method: 'post',
    data: data
  })
}

// 修改公告轮播
export function updateNotice(data) {
  return request({
    url: '/mobile/notice',
    method: 'put',
    data: data
  })
}

// 删除公告轮播
export function delNotice(id) {
  return request({
    url: '/mobile/notice/' + id,
    method: 'delete'
  })
}

// 导出公告轮播
export function exportNotice(query) {
  return request({
    url: '/mobile/notice/export',
    method: 'get',
    params: query
  })
}