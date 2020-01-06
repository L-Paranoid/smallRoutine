// pages/channel/channel.js
var utils = require('../../utils/util.js');
var api = require('../../config/linkApi.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,//储存分类ID
    menu: [{ id: '1005000', name: '鱼类', icon_url: '../../static/images/shinshopshuichanhaixian.png' }, { id: '1005001', name: '虾类', icon_url: '../../static/images/pangxie.png' }, { id: '1005002', name: '贝类', icon_url: '../../static/images/beilei.png' }, { id: '1005003', name: '鲜肉', icon_url: '../../static/images/kaorou.png' }, { id: '1005004', name: '冰鲜', icon_url: '../../static/images/shengxian-xianhaixian.png"' }], // 请求全部分类
    currentCategory:[], //储存商品
  },
  //请求页面商品数据
  getIndexData:function(id){
    var _this = this;
    _this.setData({
      id:id
    })
    utils.request(api.CatalogCurrent,{'id':id}).then(function (res) {
      if (res.data.errno == 0) {
        _this.setData({
          currentCategory: res.data.data.currentCategory.subCategoryList,
        })
      }
    })
  },
  getMenuData:function(){

  },
  switchCate:function(event){
    var _this = this;
    this.getIndexData(event.currentTarget.dataset.id);
  },//切换顶部tab标签
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!options){
      throw "当前页面缺少商品ID!";
    }
    this.getIndexData(options.id);
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