const app = getApp()
const baseConfig = require('./../../utils/config.js') //公共函数

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    tips: {
      type: String, //属性的类型
      value: "暂无数据" // 提示语
    },
  },


  /**
   * 组件的初始数据
   */
  data: {
    imageurl:baseConfig.imageurl+ 'miniapp/images/config/default.png' ,
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //阻止冒泡
    catchtap(e) {
      return false
    },
  
  }
})