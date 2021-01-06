const app = getApp()
const {
  request
} = require('./../../utils/request.js');
const common = require('./../../utils/common.js') //公共函数
Page({

  data: {
    type:1,//1为热门2为最新
    articleslist:[]

  },
  onLoad: function (options) {
    console.log(options.type)
    this.datalist(options.type)

  },
  datalist: function (type) {
    
    if (type==1){
      var service = '/miniapp.php/article/articles/hotelists';
    }
    else{
      var service = '/miniapp.php/article/articles/newlists';
    }
    request({
      service: service,
      method: 'GET',
      data: {
      },
      success: res => {
        console.log("文章列表",res.data)
        this.setData({
          articleslist: res.data,
        })
      }
    })
  },
})