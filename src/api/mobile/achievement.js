import request from '@/utils/request'

// 查询成就维护列表
export function listAchievement(query) {
  return request({
    url: '/mobile/achievement/list',
    method: 'get',
    params: query
  })
}

// 查询成就维护详细
export function getAchievement(id) {
  return request({
    url: '/mobile/achievement/' + id,
    method: 'get'
  })
}

// 新增成就维护
export function addAchievement(data) {
  return request({
    url: '/mobile/achievement',
    method: 'post',
    data: data
  })
}

// 修改成就维护
export function updateAchievement(data) {
  return request({
    url: '/mobile/achievement',
    method: 'put',
    data: data
  })
}

// 删除成就维护
export function delAchievement(id) {
  return request({
    url: '/mobile/achievement/' + id,
    method: 'delete'
  })
}

// 导出成就维护
export function exportAchievement(query) {
  return request({
    url: '/mobile/achievement/export',
    method: 'get',
    params: query
  })
}

//查询成就下拉列表
export function listAchievementSelect(query) {
  return request({
    url: '/mobile/achievement/queryAchievement',
    method: 'get',
    params: query
  })
}


