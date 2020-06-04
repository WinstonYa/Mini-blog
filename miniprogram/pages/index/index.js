const db = wx.cloud.database();

Page({
  data: {
    topics: [],
    fullScreen: false
  },
  onShow() {
    this.getTopics()
  },
  getTopics(cb) {
    db.collection('topic').orderBy('createTime', 'desc').get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res)
        let topics = res.data;
        this.setData({ topics });
        typeof cb === 'function' && cb()
      },
      fail: error => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error(error)
      }
    })
  },
  handlePreviewImage(e) {
    let url = e.currentTarget.dataset.url;
    //预览图片，获取图片地址
    wx.previewImage({
      current: url,
      urls: [url]
    })
  },
  // 当用户点击视频的 cover-view 时候，获取元素中 data-id 的 id 值
  // 然后通过 wx.createVideoContext 创建视频实例对象
  // 判断当前是否全屏
  // 如果是，就是暂停退出全屏
  // 如果不是，就打开全屏并播放
  handlePreviewVideo(e) {
    let id = e.currentTarget.dataset.id;
    let videoCtx = wx.createVideoContext(id);
    let fullScreen = this.data.fullScreen;
    if (fullScreen) {
      videoCtx.pause();
      videoCtx.exitFullScreen();
      this.setData({ fullScreen: false })
    } else {
      videoCtx.requestFullScreen();
      videoCtx.play();
      this.setData({ fullScreen: true })
    }
  },
  onPullDownRefresh() {
    this.getTopics(() => {
      wx.stopPullDownRefresh()
    })
  }
})