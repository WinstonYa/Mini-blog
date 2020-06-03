import { formatTime } from './../../utils/util';
const App = getApp();
const db = wx.cloud.database();

Page({
  data: {
    content: '',
    imageUrl: '',
    videoUrl: '',
  },
  //textarea元素bindinput发生改变的回调函数
  //把输入的文本设置在Page.data.content中
  handleChange(e) {
    let content = e.detail.content;
    this.setData({ content });
  },
  handleUpload() {
    let itemListType = ['image', 'video'];
    wx.showActionSheet({
      itemList: ['图片', '视频'],
      success: (res) => {
        let type = itemListType[res.tapIndex];
        if (type === 'image') {
          wx.chooseImage({
            count: 6,
            success: (res) => {
              let filePath = res.tempFilePaths[0];
              this.uploadFile(type, filePath);
            }
          })
        } else {
          wx.chooseVideo({
            maxDuration: 60,
            camera: 'back',
            success: (res) => {
              let filePath = res.tempFilePath;
              this.uploadFile(type, filePath)
            }
          })
        }
      },
    })
  },
  //上传功能，接受类型，资源地址两个参数
  //根据 open_id 和时间戳拼接处文件名
  //使用wx.cloud.uploadFile上传文件到云开发的存储管理内
  uploadFile(type, filePath) {
    let openid = App.globalData.openid;
    let timestamp = Date.now();
    let postfix = filePath.match(/\.[^.]+?$/)[0];
    let cloudPath = `${openid}_${timestamp}${postfix}`;

    //显示 loading 提示框
    wx.showLoading({
      title: '上传中',
      mask: true
    })

    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: (res) => {
        console.log(res)
        if (type === 'image') {
          this.setData({ imageUrl: res.fileID })
        } else {
          this.setData({ videoUrl: res.fileID })
        }
      },
      fail: e => {
        wx.showToast({
          icon: 'none',
          title: '上传失败'
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  //点击发布按钮的回调函数
  handleSubmit: function () {
    let createTime = db.serverDate();
    let content = this.data.content;
    let imageUrl = this.data.imageUrl;
    let videoUrl = this.data.videoUrl;
    let userInfo = App.globalData.userInfo;

    if (!content && !imageUrl && !videoUrl) {
      wx.showToast({
        icon: 'none',
        title: '请输入内容',
      })
      return
    }

    wx.showLoading({
      title: '上传中',
      mask: true
    });

    db.collection('topic').add({
      data: {
        content, userInfo, createTime, imageUrl, videoUrl
      },
      success: (res) => {
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        let url = '/pages/detail/detail?id=' + res._id;
        wx.redirectTo({ url })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  }
})