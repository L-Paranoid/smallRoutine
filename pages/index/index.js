// pages/index/index.js
var utils = require('../../utils/util.js');
var api = require('../../config/linkApi.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner:[],
    channel:[],
    channerlImg: [
        {img: '../../static/images/shinshopshuichanhaixian.png'}, {img: '../../static/images/pangxie.png'},{img:'../../static/images/beilei.png'},{img: '../../static/images/kaorou.png'}, {img:'../../static/images/shengxian-xianhaixian.png'}
    ]
      
  },
  onShareAppMessage: function () {
    return {
      title: 'NideShop',
      desc: '万航达水产品',
      path: '/pages/index/index'
    }
  },
  getIndexData:function(){
    var _this = this;
    utils.request(api.IndexUrl).then(function(res){
      if(res.data.errno == 0){
        _this.setData({
          banner:res.data.data.banner,
          channel: res.data.data.channel,
          'channel[0].icon_url':_this.data.channerlImg[0].img,
          'channel[1].icon_url': _this.data.channerlImg[1].img,
          'channel[2].icon_url': _this.data.channerlImg[2].img,
          'channel[3].icon_url': _this.data.channerlImg[3].img,
          'channel[4].icon_url': _this.data.channerlImg[4].img
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getIndexData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})