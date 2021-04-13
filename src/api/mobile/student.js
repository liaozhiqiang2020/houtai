import request from '@/utils/request'

// 查询学员列表
export function listStudent(query) {
  return request({
    url: '/mobile/student/list',
    method: 'get',
    params: query
  })
}

// 查询学员详细
export function getStudent(id) {
  return request({
    url: '/mobile/student/' + id,
    method: 'get'
  })
}

// 新增学员
export function addStudent(data) {
  return request({
    url: '/mobile/student',
    method: 'post',
    data: data
  })
}

// 修改学员
export function updateStudent(data) {
  return request({
    url: '/mobile/student',
    method: 'put',
    data: data
  })
}

// 删除学员
export function delStudent(id) {
  return request({
    url: '/mobile/student/' + id,
    method: 'delete'
  })
}

// 导出学员
export function exportStudent(query) {
  return request({
    url: '/mobile/student/export',
    method: 'get',
    params: query
  })
}

// 查询场地下拉列表
export function placeList(query) {
  return request({
    url: '/mobile/student/getPlaceList',
    method: 'get',
    params: query
  })
}

// 查询场地下拉列表
export function studentList(query) {
  return request({
    url: '/mobile/student/getStudentList',
    method: 'get',
    params: query
  })
}

// 查询课程下拉列表
export function courseList(query) {
  return request({
    url: '/mobile/course/queryCoures',
    method: 'get',
    params: query
  })
}

//查询教练下拉列表
export function coachList(query) {
  return request({
    url: '/mobile/coach/queryCoach',
    method: 'get',
    params: query
  })
}





