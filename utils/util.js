/**
 * 工具函数库
 */

/**
 * 格式化时间
 * @param {Date} date 日期对象
 * @returns {String} 格式化后的时间字符串
 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

/**
 * 格式化数字,小于10的数字前面补0
 * @param {Number} n 数字
 * @returns {String} 格式化后的字符串
 */
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

/**
 * 节流函数
 * @param {Function} fn 要执行的函数
 * @param {Number} delay 延迟时间(毫秒)
 * @returns {Function} 节流后的函数
 */
const throttle = (fn, delay = 300) => {
  let timer = null
  return function(...args) {
    if (timer) return
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

/**
 * 防抖函数
 * @param {Function} fn 要执行的函数
 * @param {Number} delay 延迟时间(毫秒)
 * @returns {Function} 防抖后的函数
 */
const debounce = (fn, delay = 300) => {
  let timer = null
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 深拷贝对象
 * @param {Object} obj 要拷贝的对象
 * @returns {Object} 拷贝后的新对象
 */
const deepClone = obj => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof Array) return obj.map(item => deepClone(item))

  const cloneObj = {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = deepClone(obj[key])
    }
  }
  return cloneObj
}

/**
 * 生成唯一ID
 * @returns {String} 唯一ID字符串
 */
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 格式化文件大小
 * @param {Number} size 文件大小(字节)
 * @returns {String} 格式化后的文件大小
 */
const formatFileSize = size => {
  if (size < 1024) return `${size}B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)}KB`
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)}MB`
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)}GB`
}

/**
 * 验证手机号
 * @param {String} phone 手机号
 * @returns {Boolean} 是否有效
 */
const validatePhone = phone => {
  return /^1[3-9]\d{9}$/.test(phone)
}

/**
 * 验证邮箱
 * @param {String} email 邮箱地址
 * @returns {Boolean} 是否有效
 */
const validateEmail = email => {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
}

/**
 * 验证身份证号
 * @param {String} idCard 身份证号
 * @returns {Boolean} 是否有效
 */
const validateIdCard = idCard => {
  return /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/.test(idCard)
}

/**
 * 将对象转换为URL查询参数
 * @param {Object} obj 参数对象
 * @returns {String} 查询参数字符串
 */
const objToQueryString = obj => {
  return Object.keys(obj)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&')
}

/**
 * 将URL查询参数转换为对象
 * @param {String} queryString 查询参数字符串
 * @returns {Object} 参数对象
 */
const queryStringToObj = queryString => {
  const obj = {}
  const params = queryString.split('&')
  params.forEach(param => {
    const [key, value] = param.split('=')
    obj[decodeURIComponent(key)] = decodeURIComponent(value)
  })
  return obj
}

module.exports = {
  formatTime,
  formatNumber,
  throttle,
  debounce,
  deepClone,
  generateId,
  formatFileSize,
  validatePhone,
  validateEmail,
  validateIdCard,
  objToQueryString,
  queryStringToObj
}
