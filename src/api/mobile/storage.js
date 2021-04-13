import request from '@/utils/request'

// 查询商品库存列表
export function listStorage(query) {
  return request({
    url: '/mobile/storage/list',
    method: 'get',
    params: query
  })
}

// 查询商品库存详细
export function getStorage(id) {
  return request({
    url: '/mobile/storage/' + id,
    method: 'get'
  })
}

// 新增商品库存
export function addStorage(data) {
  return request({
    url: '/mobile/storage',
    method: 'post',
    data: data
  })
}

// 修改商品库存
export function updateStorage(data) {
  return request({
    url: '/mobile/storage',
    method: 'put',
    data: data
  })
}

// 删除商品库存
export function delStorage(id) {
  return request({
    url: '/mobile/storage/' + id,
    method: 'delete'
  })
}

// 入库
export function inStorageFun(data) {
  return request({
    url: '/mobile/storage/inStorage/'+data.id+'/'+data.inventory,
    method: 'post'
  })
}

// 出库
export function outStorageFun(data) {
  return request({
    url: '/mobile/storage/outStorage/'+data.id+'/'+data.inventory,
    method: 'post'
  })
}

// 商品下拉列表
export function findStorageSelectList(query) {
  return request({
    url: '/mobile/storage/findStorageSelectList',
    method: 'post',
    params: query
  })
}
