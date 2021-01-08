const app = getApp()
const {
  request
} = require('./../../utils/request.js');
const common = require('./../../utils/common.js') //公共函数
const baseConfig = require('./../../utils/config.js') //配置文件
let interstitialAd = null; //插屏广告
var preventShake = 0; //防止快速点击
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:null,
    id:null

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let url=options.url;
    let id=options.id || 0;//文章id
    let newurl=decodeURIComponent(url)
    this.setData({
      url: newurl,
      id:id
    })
    if(id!=0){
      this.statistics(id)
    }

  },

  //统计文章记录
  statistics: function(id) {
    let user_id = wx.getStorageSync('userdata').id || 0;
    let openid = wx.getStorageSync('userdata').openid || 0;
      request({
        service: 'miniapp.php/article/userarticles/statistics',
        method: 'GET',
        data: {
          article_id:id,
          type:0,
          user_id:user_id,
          openid:openid
        },
        success: res => {
          console.log("观看文章统计成功", res.data)
        }
      })
  },

  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(options) {
    let id =this.data.id;
    if(id!=0){
    let user_id = wx.getStorageSync('userdata').id || 0;
    let openid = wx.getStorageSync('userdata').openid || 0;
      request({
        service: 'miniapp.php/article/userarticles/statistics',
        method: 'GET',
        data: {
          article_id:id,
          type:1,
          user_id:user_id,
          openid:openid
        },
        success: res => {
          console.log("分享文章统计成功", res.data)
        }
      })
    }
    return {
      title:"我看到一篇好文章，分享给你。",
      desc:"我看到一篇好文章，分享给你。",
      // imageUrl: baseConfig.imageurl+'miniapp/images/appicon.png',
      // imageUrl: 'https://material.gzywudao.top/image/group/groupicon.png',
      path: '/pages/index/index?channel=1000', // 路径，传递参数到指定页面。
    }


  }


})