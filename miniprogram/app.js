//app.js
App({
  onLaunch: function () {
    this.cloudInit();
    this.getUserInfo();
  },
  // cloudInit 初始化云开发配置
  // 调用 wx.cloud.init 传入 traceUser 为 true 代表记录用户到后台中。
  cloudInit() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true
      })
    }
  },
  getUserInfo(cb) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.getOpenid();
              this.globalData.userInfo = res.userInfo;
              typeof cb === 'function' && cb(res);
            }
          })
        } else {
          console.log('用户未授权')
        }
      }
    })
  },
  getOpenid() {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        this.globalData.openid = res.result.openid;
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  //globalData对象用于存放全局数据
  globalData: {
    userInfo: {},  //存放用户信息
    openid: ''    //存放openid
  }
})
