/**
 * 本地存储封装
 */

/**
 * 设置存储
 * @param {String} key 键
 * @param {Any} value 值
 * @returns {Boolean} 是否成功
 */
const setStorage = (key, value) => {
  try {
    wx.setStorageSync(key, value)
    return true
  } catch (error) {
    console.error('存储失败', error)
    return false
  }
}

/**
 * 获取存储
 * @param {String} key 键
 * @param {Any} defaultValue 默认值
 * @returns {Any} 值
 */
const getStorage = (key, defaultValue = null) => {
  try {
    const value = wx.getStorageSync(key)
    return value !== '' ? value : defaultValue
  } catch (error) {
    console.error('获取存储失败', error)
    return defaultValue
  }
}

/**
 * 删除存储
 * @param {String} key 键
 * @returns {Boolean} 是否成功
 */
const removeStorage = (key) => {
  try {
    wx.removeStorageSync(key)
    return true
  } catch (error) {
    console.error('删除存储失败', error)
    return false
  }
}

/**
 * 清空所有存储
 * @returns {Boolean} 是否成功
 */
const clearStorage = () => {
  try {
    wx.clearStorageSync()
    return true
  } catch (error) {
    console.error('清空存储失败', error)
    return false
  }
}

/**
 * 获取存储信息
 * @returns {Object} 存储信息
 */
const getStorageInfo = () => {
  try {
    return wx.getStorageInfoSync()
  } catch (error) {
    console.error('获取存储信息失败', error)
    return null
  }
}

/**
 * 设置用户信息
 * @param {Object} userInfo 用户信息
 */
const setUserInfo = (userInfo) => {
  setStorage('userInfo', userInfo)
}

/**
 * 获取用户信息
 * @returns {Object} 用户信息
 */
const getUserInfo = () => {
  return getStorage('userInfo', null)
}

/**
 * 设置token
 * @param {String} token token值
 */
const setToken = (token) => {
  setStorage('token', token)
}

/**
 * 获取token
 * @returns {String} token值
 */
const getToken = () => {
  return getStorage('token', '')
}

/**
 * 删除token
 */
const removeToken = () => {
  removeStorage('token')
}

/**
 * 添加日志
 * @param {String} log 日志内容
 */
const addLog = (log = null) => {
  const logs = getStorage('logs', [])
  logs.unshift(log || Date.now())

  // 限制日志数量
  if (logs.length > 50) {
    logs.length = 50
  }

  setStorage('logs', logs)
}

/**
 * 获取日志列表
 * @returns {Array} 日志列表
 */
const getLogs = () => {
  return getStorage('logs', [])
}

/**
 * 清空日志
 */
const clearLogs = () => {
  removeStorage('logs')
}

module.exports = {
  setStorage,
  getStorage,
  removeStorage,
  clearStorage,
  getStorageInfo,
  setUserInfo,
  getUserInfo,
  setToken,
  getToken,
  removeToken,
  addLog,
  getLogs,
  clearLogs
}
