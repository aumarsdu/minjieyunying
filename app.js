// app.js
App({
  onLaunch(options) {
    // 小程序启动时触发
    console.log('小程序启动', options)

    // 检查登录态
    this.checkLoginStatus()

    // 获取系统信息
    this.getSystemInfo()
  },

  onShow(options) {
    // 小程序显示时触发
    console.log('小程序显示', options)
  },

  onHide() {
    // 小程序隐藏时触发
    console.log('小程序隐藏')
  },

  onError(msg) {
    // 小程序错误时触发
    console.error('小程序错误', msg)
  },

  // 检查登录状态
  checkLoginStatus() {
    const token = wx.getStorageSync('token')
    if (token) {
      // 验证token是否有效
      // 这里可以调用后端API验证
      console.log('已登录')
    } else {
      console.log('未登录')
    }
  },

  // 获取系统信息
  getSystemInfo() {
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systemInfo = res
        console.log('系统信息', res)
      }
    })
  },

  // 全局数据
  globalData: {
    userInfo: null,
    systemInfo: null
  }
})
