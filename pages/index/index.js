// pages/index/index.js
const util = require('../../utils/util.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('Index页面加载', options)

    // 从全局数据中获取用户信息
    const app = getApp()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    console.log('Index页面初次渲染完成')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('Index页面显示')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    console.log('Index页面隐藏')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    console.log('Index页面卸载')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    console.log('下拉刷新')
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
      title: '民杰云营',
      path: '/pages/index/index'
    }
  },

  /**
   * 获取用户信息
   */
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        console.log('获取用户信息成功', res)
        const app = getApp()
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      },
      fail: (err) => {
        console.error('获取用户信息失败', err)
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 跳转到日志页面
   */
  navigateToLogs() {
    wx.navigateTo({
      url: '/pages/logs/logs'
    })
  },

  /**
   * 显示提示
   */
  showToast() {
    wx.showToast({
      title: '这是一个提示',
      icon: 'success',
      duration: 2000
    })
  },

  /**
   * 测试网络请求
   */
  makeRequest() {
    wx.showLoading({
      title: '加载中...'
    })

    // 这里是一个示例API请求
    // 实际使用时需要替换为真实的API地址
    wx.request({
      url: 'https://api.example.com/test',
      method: 'GET',
      success: (res) => {
        console.log('请求成功', res)
        wx.showToast({
          title: '请求成功',
          icon: 'success'
        })
      },
      fail: (err) => {
        console.error('请求失败', err)
        wx.showToast({
          title: '请求失败,这是一个示例',
          icon: 'none',
          duration: 2000
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  }
})
