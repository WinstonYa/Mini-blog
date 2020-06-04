const db = wx.cloud.database()
const App = getApp();

Page({
  data: {
    replies:[]
  },
  onLoad: function(options) {
    this.getReplies(options.id);
  },
  getReplies: function(id) {
    db.collection('reply').orderBy('createTime', 'desc').where({
      topic_id: id
    }).get({
      success: (res)=> {
        let replies = res.data;
        this.setData({ replies, id })
      }
    })
  }
})