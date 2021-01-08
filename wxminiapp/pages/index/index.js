const app = getApp()
const {
  request
} = require('./../../utils/request.js');
const common = require('./../../utils/common.js') //公共函数
const baseConfig = require('./../../utils/config.js') //配置文件
let interstitialAd = null; //插屏广告
var preventShake = 0; //防止快速点击
Page({
  data: {
    host: 'https://article.gzywudao.top/',//项目图片域名
    swiperList: [],//轮播图数据
    articleslist: [],//文章数据
    ifonshowgdtinsertad:0,//是否展示插屏广告0展示1不展示
    articlesurl:null,//跳转文章链接
    pages:1,//查询的页数
    count:null,//查询的文章总数
    articlesid:null,//跳转文章id
  },
  onLoad() {
    let host = baseConfig.host;
    this.setData({
      host: host
    })
    this.datalist(1)
    this.bannerlist()
    this.gdtinsertad()
  },
  //获取文章列表
  datalist: function(pages) {
    var that =this;
    request({
      service: 'miniapp.php/article/articles/lists',
      method: 'GET',
      data: {
        pages:pages
      },
      success: res => {
        console.log("文章列表", res.data)
        let articleslist = this.data.articleslist;
        var newarticleslist = [...articleslist, ...res.data];
        that.setData({
          articleslist: newarticleslist,
          count: res.count
        })
      }
    })
  },
  //获取轮播图
  bannerlist: function() {
    request({
      service: 'miniapp.php/datalist/banner',
      method: 'GET',
      data: {},
      success: res => {
        console.log("banner列表", res.data)
        this.setData({
          swiperList: res.data,
        })
      }
    })
  },
  //跳转最新和热门文章
  articleslist: function(e) {
    wx.navigateTo({
      url: '/pages/articles/articles?type=' + e.currentTarget.dataset.type
    })
  },
  //点击文章
  clickarticles:function(e){
    console.log("点击文章",e)
    var that=this;
   let articlesurl= e.currentTarget.dataset.data.jumpurl;
   let articlesid = e.currentTarget.dataset.data.id;
    that.setData({
      articlesurl:articlesurl,
      articlesid:articlesid
    })
    that.videoad()
  },
  //调起视频广告
  videoad: function() {
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
            'position':"首页"
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
  //微信toast提示
  wxshowToast: function(title) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 2500
    })
  },
  //加载插屏广告
  gdtinsertad: function() {
    var insertad = baseConfig.insertad;
    console.log("插屏广告代码", insertad)
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: insertad
      })
      interstitialAd.onLoad((e) => {
        console.log('插屏广告加载onLoad event emit', e)
      })
      interstitialAd.onError((err) => {
        console.log('插屏广告错误onError event emit', err)
      })
      interstitialAd.onClose((res) => {
        console.log('插屏广告被关闭onClose event emit', res)
      })
    }
  },
  //滚动页面触发插屏广告
  onPageScroll (e) {
    var that=this;
    let ifonshowgdtinsertad=this.data.onshowgdtinsertad;
    if(ifonshowgdtinsertad==0){
      that.setData({
        ifonshowgdtinsertad:1,
      })
      setTimeout(function() {
        that.onshowgdtinsertad()
      }, 4000);
    } 
    console.log('屏幕滚起来')
  },
  //显示插屏广告
  onshowgdtinsertad: function() {
    this.setData({
      ifonshowgdtinsertad:0,
    })
    var state = 0;
    interstitialAd.show((res) => {
      console.log("插屏广告展示成功", res)
    }).catch((err) => {
      console.error("插屏广告错误啦", err)
      state = 1;
    })
    setTimeout(function() {
      if (state == 0) {
        console.log("插屏广告显示成功")
        let gdtdata={
          'adtype':7,
          'position':"首页"
        };
        common.clickgdtadstatistics(gdtdata)
      } else {
        console.log("插屏广告显示失败")
      }
    }, 500);
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
    that.datalist(newpages)
  }
}

})