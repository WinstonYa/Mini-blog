Component({
  properties: {
    topics: {
      type: Array,
      value: []
    }
  },
  data: {
    fullScreen: false
  },
  methods: {
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
    handlePreviewVideo: function (e) {
      let id = e.currentTarget.dataset.id;
      let videoCtx = wx.createVideoContext(id, this);
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
    }
  }
})