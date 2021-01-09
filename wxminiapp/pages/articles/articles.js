const app = getApp()
const {
  request
} = require('./../../utils/request.js');
const common = require('./../../utils/common.js') //公共函数
const baseConfig = require('./../../utils/config.js') //配置文件
var preventShake = 0; //防止快速点击
Page({
  data: {
    type: 1,//1为热门2为最新
    articleslist: [],
    articlesurl:null,//跳转文章链接
    articlesid:null,//跳转文章id
  },
  onLoad: function (options) {
    console.log(options.type)
    this.datalist(options.type)
  },

  //获取文章列表
  datalist: function (type) {
    if (type == 1) {
      var service = '/miniapp.php/article/articles/hotelists';
    }
    else {
      var service = '/miniapp.php/article/articles/newlists';
    }
    request({
      service: service,
      method: 'GET',
      data: {
      },
      success: res => {
        console.log("文章列表", res.data)
        this.setData({
          articleslist: res.data,
        })
      }
    })
  },
  //点击文章
  clickarticles: function (e) {
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
    var that = this;
    // 在页面中定义激励视频广告
    let videoAd = null
    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: baseConfig.videoadid
      })
      videoAd.onLoad(() => {
        //console.log("onLoad")
      })
      videoAd.onError((err) => {
        //console.log("onError")
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
            'position':"文章列表"
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

})