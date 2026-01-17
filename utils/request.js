/**
 * 网络请求封装
 */

// API基础地址
const BASE_URL = 'https://api.example.com'

// 请求超时时间
const TIMEOUT = 30000

/**
 * 发送HTTP请求
 * @param {Object} options 请求配置
 * @returns {Promise} Promise对象
 */
const request = (options) => {
  return new Promise((resolve, reject) => {
    // 获取token
    const token = wx.getStorageSync('token') || ''

    // 请求配置
    const config = {
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.header
      },
      timeout: options.timeout || TIMEOUT,
      success: (res) => {
        // 请求成功
        if (res.statusCode === 200) {
          // 业务逻辑成功
          if (res.data.code === 0 || res.data.success) {
            resolve(res.data)
          } else {
            // 业务逻辑失败
            handleError(res.data)
            reject(res.data)
          }
        } else if (res.statusCode === 401) {
          // 未授权,需要重新登录
          handleUnauthorized()
          reject(res.data)
        } else {
          // 其他错误
          handleError(res.data)
          reject(res.data)
        }
      },
      fail: (err) => {
        // 请求失败
        console.error('请求失败', err)
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        })
        reject(err)
      }
    }

    // 发送请求
    wx.request(config)
  })
}

/**
 * GET请求
 * @param {String} url 请求地址
 * @param {Object} data 请求参数
 * @param {Object} options 其他配置
 * @returns {Promise} Promise对象
 */
const get = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'GET',
    data,
    ...options
  })
}

/**
 * POST请求
 * @param {String} url 请求地址
 * @param {Object} data 请求参数
 * @param {Object} options 其他配置
 * @returns {Promise} Promise对象
 */
const post = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  })
}

/**
 * PUT请求
 * @param {String} url 请求地址
 * @param {Object} data 请求参数
 * @param {Object} options 其他配置
 * @returns {Promise} Promise对象
 */
const put = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'PUT',
    data,
    ...options
  })
}

/**
 * DELETE请求
 * @param {String} url 请求地址
 * @param {Object} data 请求参数
 * @param {Object} options 其他配置
 * @returns {Promise} Promise对象
 */
const del = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'DELETE',
    data,
    ...options
  })
}

/**
 * 上传文件
 * @param {String} url 上传地址
 * @param {String} filePath 文件路径
 * @param {Object} formData 其他表单数据
 * @returns {Promise} Promise对象
 */
const uploadFile = (url, filePath, formData = {}) => {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token') || ''

    wx.uploadFile({
      url: BASE_URL + url,
      filePath,
      name: 'file',
      formData,
      header: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        const data = JSON.parse(res.data)
        if (data.code === 0 || data.success) {
          resolve(data)
        } else {
          handleError(data)
          reject(data)
        }
      },
      fail: (err) => {
        console.error('上传失败', err)
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

/**
 * 下载文件
 * @param {String} url 下载地址
 * @returns {Promise} Promise对象
 */
const downloadFile = (url) => {
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url: BASE_URL + url,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.tempFilePath)
        } else {
          reject(res)
        }
      },
      fail: (err) => {
        console.error('下载失败', err)
        wx.showToast({
          title: '下载失败',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

/**
 * 处理错误
 * @param {Object} error 错误对象
 */
const handleError = (error) => {
  const message = error.message || error.msg || '请求失败'
  wx.showToast({
    title: message,
    icon: 'none'
  })
}

/**
 * 处理未授权
 */
const handleUnauthorized = () => {
  wx.showToast({
    title: '登录已过期,请重新登录',
    icon: 'none'
  })

  // 清除token
  wx.removeStorageSync('token')

  // 跳转到登录页
  setTimeout(() => {
    wx.reLaunch({
      url: '/pages/login/login'
    })
  }, 1500)
}

module.exports = {
  request,
  get,
  post,
  put,
  del,
  uploadFile,
  downloadFile,
  BASE_URL
}
