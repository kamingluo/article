const app = getApp()
const {
  request
} = require('./../../utils/request.js');
const common = require('./../../utils/common.js') //公共函数
const baseConfig = require('./../../utils/config.js') //配置文件
let interstitialAd = null //插屏广告
Page({
  data: {
    host: 'https://article.gzywudao.top/',
    swiperList: [],
    articleslist: []
  },
  onLoad() {
    let host = baseConfig.host;
    this.setData({
      host: host
    })
    this.datalist()
    this.bannerlist()
    this.gdtinsertad()
  },
  onShow() {

  },

  //获取文章列表
  datalist: function() {
    request({
      service: 'miniapp.php/article/articles/lists',
      method: 'GET',
      data: {},
      success: res => {
        console.log("文章列表", res.data)
        this.setData({
          articleslist: res.data,
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

  //最新文章
  newlist: function() {
    this.onshowgdtinsertad()
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


  //显示插屏广告
  onshowgdtinsertad: function() {
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
      } else {
        console.log("插屏广告显示失败")
      }
    }, 1000);

  },


})