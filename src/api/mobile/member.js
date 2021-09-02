import request from '@/utils/request'

// 查询会员列表
export function listMember(query) {
  return request({
    url: '/mobile/member/list',
    method: 'get',
    params: query
  })
}

// 查询会员详细
export function getMember(id) {
  return request({
    url: '/mobile/member/' + id,
    method: 'get'
  })
}

// 新增会员
export function addMember(data) {
  return request({
    url: '/mobile/member',
    method: 'post',
    data: data
  })
}

// 修改会员
export function updateMember(data) {
  return request({
    url: '/mobile/member',
    method: 'put',
    data: data
  })
}

// 删除会员
export function delMember(id) {
  return request({
    url: '/mobile/member/' + id,
    method: 'delete'
  })
}

// 导出会员
export function exportMember(query) {
  return request({
    url: '/mobile/member/export',
    method: 'get',
    params: query
  })
}