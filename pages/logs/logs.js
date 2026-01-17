// pages/logs/logs.js
const util = require('../../utils/util.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    logs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 从本地存储读取日志
    this.loadLogs()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    console.log('Logs页面初次渲染完成')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('Logs页面显示')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    console.log('Logs页面隐藏')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    console.log('Logs页面卸载')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    console.log('下拉刷新')
    this.loadLogs()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log('上拉触底')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '日志记录',
      path: '/pages/logs/logs'
    }
  },

  /**
   * 加载日志数据
   */
  loadLogs() {
    const logs = wx.getStorageSync('logs') || []
    this.setData({
      logs: logs.map(log => util.formatTime(new Date(log)))
    })
  },

  /**
   * 添加新日志
   */
  addLog() {
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())

    // 限制日志数量,最多保留50条
    if (logs.length > 50) {
      logs.length = 50
    }

    wx.setStorageSync('logs', logs)
    this.loadLogs()

    wx.showToast({
      title: '添加成功',
      icon: 'success'
    })
  },

  /**
   * 清空所有日志
   */
  clearLogs() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有日志吗?',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('logs')
          this.setData({
            logs: []
          })
          wx.showToast({
            title: '已清空',
            icon: 'success'
          })
        }
      }
    })
  }
})
