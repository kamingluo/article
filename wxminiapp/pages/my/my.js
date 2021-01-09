const app = getApp()
const {
  request
} = require('./../../utils/request.js');
const common = require('./../../utils/common.js') //公共函数
const baseConfig = require('./../../utils/config.js')//配置文件
Page({
  data: {
    TabCur: 0,
    pages: 1,
    datalist: [],
    count: 0
  },
  tabSelect(e) {
    this.setData({
      pages:1,
      count:0,
      datalist: [],
      TabCur: e.currentTarget.dataset.id,
    })
    this.datalist()
  },
  onLoad: function (options) {
    this.datalist()
  },
  //点击跳转文章
  clickarticles:function(e){
    let articlesurl=encodeURIComponent(e.currentTarget.dataset.data.jumpurl);
     let id=e.currentTarget.dataset.data.id;
    wx.navigateTo({
      url: '/pages/webview/webview?url=' + articlesurl + '&id=' + id
    })
  },
  //获取文章列表
  datalist: function () {
    var that=this
    let type = this.data.TabCur;
    let user_id = wx.getStorageSync('userdata').id || 0;
    let pages = this.data.pages;
    request({
      service: 'miniapp.php/article/userarticles/record',
      method: 'GET',
      data: {
        type: type,
        user_id: user_id,
        pages: pages
      },
      success: res => {
        console.log("文章列表", res.datalist)
        let datalist = this.data.datalist;
        var newdatalist = [...datalist, ...res.datalist];
        that.setData({
          datalist: newdatalist,
          count: res.count
        })
      }
    })
  },
  //页面上拉触底事件的处理函数
  onReachBottom: function () {
    var that = this
    var count = that.data.count;//拿到总数
    var pages = that.data.pages;
    if (pages * 10 >= count) {
      return;
    }
    else {
      let newpages = pages + 1;
      that.setData({
        pages: newpages
      })
      that.datalist()
    }

  },
})