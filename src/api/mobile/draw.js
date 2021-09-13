import request from '@/utils/request'

// 查询幸运抽奖列表
export function listDraw(query) {
  return request({
    url: '/mobile/draw/list',
    method: 'get',
    params: query
  })
}

// 查询幸运抽奖详细
export function getDraw(id) {
  return request({
    url: '/mobile/draw/' + id,
    method: 'get'
  })
}

// 新增幸运抽奖
export function addDraw(data) {
  return request({
    url: '/mobile/draw',
    method: 'post',
    data: data
  })
}

// 修改幸运抽奖
export function updateDraw(data) {
  return request({
    url: '/mobile/draw',
    method: 'put',
    data: data
  })
}

// 删除幸运抽奖
export function delDraw(id) {
  return request({
    url: '/mobile/draw/' + id,
    method: 'delete'
  })
}

// 导出幸运抽奖
export function exportDraw(query) {
  return request({
    url: '/mobile/draw/export',
    method: 'get',
    params: query
  })
}
