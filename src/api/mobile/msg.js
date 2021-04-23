import request from '@/utils/request'

// 查询短信发送记录列表
export function listMsg(query) {
  return request({
    url: '/mobile/msg/list',
    method: 'get',
    params: query
  })
}

// 查询短信发送记录详细
export function getMsg(id) {
  return request({
    url: '/mobile/msg/' + id,
    method: 'get'
  })
}

// 新增短信发送记录
export function addMsg(data) {
  return request({
    url: '/mobile/msg',
    method: 'post',
    data: data
  })
}

// 修改短信发送记录
export function updateMsg(data) {
  return request({
    url: '/mobile/msg',
    method: 'put',
    data: data
  })
}

// 删除短信发送记录
export function delMsg(id) {
  return request({
    url: '/mobile/msg/' + id,
    method: 'delete'
  })
}

// 导出短信发送记录
export function exportMsg(query) {
  return request({
    url: '/mobile/msg/export',
    method: 'get',
    params: query
  })
}