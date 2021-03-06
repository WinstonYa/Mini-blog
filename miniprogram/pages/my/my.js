const App = getApp();

Page({
  data: {
    userInfo: {}
  },
  //页面加载的时候调用getUserInfo方法
  onLoad() {
    this.getUserInfo();
  },
  getUserInfo() {
    let userInfo = App.globalData.userInfo;
    if (userInfo.nickName) {
      this.setData({
        logged: true,
        userInfo: userInfo
      })
    }
  },
  onGetUserInfo(e) {
    if (e.detail.userInfo) {
      App.getUserInfo((res) => {
        this.setData({
          userInfo: res.userInfo
        })
      })
    }
  }
})