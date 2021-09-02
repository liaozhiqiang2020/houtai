import request from '@/utils/request'

// 查询学员签到列表
export function listSign(query) {
  return request({
    url: '/mobile/sign/list',
    method: 'get',
    params: query
  })
}

// 查询学员签到详细
export function getSign(id) {
  return request({
    url: '/mobile/sign/' + id,
    method: 'get'
  })
}

// 新增学员签到
export function addSign(data) {
  return request({
    url: '/mobile/sign',
    method: 'post',
    data: data
  })
}

// 修改学员签到
export function updateSign(data) {
  return request({
    url: '/mobile/sign',
    method: 'put',
    data: data
  })
}

// 删除学员签到
export function delSign(id) {
  return request({
    url: '/mobile/sign/' + id,
    method: 'delete'
  })
}

// 导出学员签到
export function exportSign(query) {
  return request({
    url: '/mobile/sign/export',
    method: 'get',
    params: query
  })
}