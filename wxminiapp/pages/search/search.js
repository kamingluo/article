const app = getApp()
const {
  request
} = require('./../../utils/request.js');
const common = require('./../../utils/common.js') //公共函数
const baseConfig = require('./../../utils/config.js')//配置文件
var preventShake = 0; //防止快速点击
Page({
  data: {
    pages: 1,//查询页数
    searchtext: "",//查询文案
    count: 0,//列表总数
    datalist: [],//文章列表
    articlesurl:null,//跳转文章链接
    articlesid:null,//跳转文章id
  },
  onLoad: function (options) {
  },
  //输入搜索词
  searchtext: function (e) {
    this.setData({
      searchtext: e.detail.value,
      datalist: [],
      page: 1
    })
  },
  //点击搜索
  clicksearch: function () {
    console.log("点击搜索")
    this.setData({
      pages: 1,
      datalist: []
    })
    this.seararticles()
  },
  //搜索文章
  seararticles: function () {
    var that = this
    let pages = this.data.pages;
    let search = this.data.searchtext;
    if (search == "" || search == null) {
      that.wxshowToast("请输入搜索词")
      return;
    }
    request({
      service: 'miniapp.php/article/articles/lists',
      method: 'GET',
      data: {
        pages: pages,
        search: search
      },
      success: res => {
        if (res.count == 0) {
          that.wxshowToast("搜索不到，换个词试试看")
          return;
        }
        console.log("查询商品结果", res.data)
        let datalist = this.data.datalist;
        var newdatalist = [...datalist, ...res.data];
        that.setData({
          datalist: newdatalist,
          count: res.count
        })
      },
    })

  },
  //微信toast提示
  wxshowToast: function (title) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 2500
    })
  },
  //点击文章
  clickarticles: function (e) {
    console.log("点击搜索文章")
    var that = this;
    let articlesurl = e.currentTarget.dataset.data.jumpurl;
    let articlesid = e.currentTarget.dataset.data.id;
    that.setData({
      articlesurl: articlesurl,
      articlesid:articlesid
    })
    that.videoad()
  },
  //调起视频广告
  videoad: function () {
    console.log("调起视频广告")
    var that = this;
    // 在页面中定义激励视频广告
    let videoAd = null
    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: baseConfig.videoadid
      })
      videoAd.onLoad(() => {
        console.log("onLoad")
      })
      videoAd.onError((err) => {
        console.log("onError")
      })
      videoAd.onClose((res) => {
        //console.log("点击关闭视频广告", res)
        if (res && res.isEnded || res === undefined) {
          var nowTime = Date.now();
          if (nowTime - preventShake < 5000) {
            //console.log("防止短时间内多次调用")
            return
          }
          preventShake = nowTime;
          let gdtdata={
            'adtype':2,
            'position':"搜索页面"
          };
          common.clickgdtadstatistics(gdtdata)
          //console.log("正常播放结束，可以下发游戏奖励")
          let jumpurl=encodeURIComponent(that.data.articlesurl);
          wx.navigateTo({
            url: '/pages/webview/webview?url=' + jumpurl + '&id=' + this.data.articlesid
          })
        } else {
          that.wxshowToast("看完广告才能跳转文章哦！")
          //console.log("播放中途退出，不下发游戏奖励")
        }
      })
    }
    // 用户触发广告后，显示激励视频广告
    if (videoAd) {
      videoAd.show().catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show())
          .catch(err => {
            //console.log('激励视频 广告显示失败')
            //that.wxshowToast("暂无广告,等会再试试！")
          })
      })
    }

  },
  //页面上拉触底事件的处理函数
  onReachBottom: function () {
    var that = this
    var count = that.data.count;//拿到总数
    var pages = that.data.pages;
    if (pages * 20 >= count) {
      return;
    }
    else {
      let newpages = pages + 1;
      that.setData({
        pages: newpages
      })
      that.seararticles()
    }
  }
})