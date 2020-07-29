import request from '@/utils/request'

export function HttpRequest (apiAddr) {
  const httpRequest = {}
  httpRequest.gets = function (params) {
    console.log('gets')
    return request({
      url: apiAddr,
      method: 'get',
      params
    })
  }
  httpRequest.get = function (id, params) {
    return request({
      url: `${apiAddr}/${id}`,
      method: 'get',
      params
    })
  }
  httpRequest.post = function (data) {
    return request({
      url: apiAddr,
      method: 'post',
      data
    })
  }
  httpRequest.put = function (id, data) {
    return request({
      url: `${apiAddr}/${id}`,
      method: 'put',
      data
    })
  }
  httpRequest.delete = function (id, data) {
    return request({
      url: `${apiAddr}/${id}`,
      method: 'delete',
      data
    })
  }
  httpRequest.test = function () {
    return new Promise((resolve, reject) => {
      // 执行异步操作
      setTimeout(() => {
        if (Math.random() * 100 > 20) {
          resolve({
            msg: '请求成功！'
          })
        } else {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({ response: { data: { errmsg: '请求失败' } } })
        }
      }, 500)
    })
  }
  return httpRequest
}
