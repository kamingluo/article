const app = getApp()
const {
  request
} = require('./../../utils/request.js');
const common = require('./../../utils/common.js') //公共函数
const baseConfig = require('./../../utils/config.js')//配置文件

Page({
  data: {
    host:'https://article.gzywudao.top/',
    swiperList:[] ,
    articleslist: []
  },
  onLoad() {
    let host = baseConfig.host;
    this.setData({
      host: host
    })

    this.datalist()
    this.bannerlist()
    // this.swiperList()
  },


  datalist: function () {
    request({
      service: '/miniapp.php/article/articles/lists',
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


  bannerlist: function () {
    request({
      service: '/miniapp.php/datalist/banner',
      method: 'GET',
      data: {
      },
      success: res => {
        console.log("banner列表", res.data)
        this.setData({
          swiperList: res.data,
        })
      }
    })
  },



  swiperList:function(){
    let data = [{
      id: 0,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
    }, {
      id: 1,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
    }, {
      id: 3,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
    }, {
      id: 4,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
    }, {
      id: 5,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg'
    }, {
      id: 6,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'
    }];

    this.setData({
      swiperList: data
    })


  }

})