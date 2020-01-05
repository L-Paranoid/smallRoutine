var util = require('../../../utils/util.js');
var api = require('../../../config/linkApi.js');

var app = getApp();

Page({
    data: {
        typeId: 0,
        collectList: []
    },
    getCollectList() {
        let _this = this;
        util.request(api.CollectList, { typeId: _this.data.typeId }).then(function(res) {
            if (res.data.errno === 0) {
              console.log(res.data.data);
                _this.setData({
                    collectList: res.data.data
                });
            }
        });
    },
    onLoad: function(options) {
        this.getCollectList();
    },
    onReady: function() {

    },
    onShow: function() {

    },
    onHide: function() {
        // 页面隐藏

    },
    onUnload: function() {
        // 页面关闭
    },
    openGoods(event) {

        let _this = this;
        let goodsId = this.data.collectList[event.currentTarget.dataset.index].value_id;

        //触摸时间距离页面打开的毫秒数  
        var touchTime = _this.data.touch_end - _this.data.touch_start;
        console.log(touchTime);
        //如果按下时间大于350为长按  
        if (touchTime > 350) {
            wx.showModal({
                title: '',
                content: '确定删除吗？',
                success: function(res) {
                    if (res.confirm) {

                        util.request(api.CollectAddOrDelete, { typeId: _this.data.typeId, valueId: goodsId }, 'POST').then(function(res) {
                            if (res.data.errno === 0) {
                              console.log(res.data.data);
                                wx.showToast({
                                    title: '删除成功',
                                    icon: 'success',
                                    duration: 2000
                                });
                                _this.getCollectList();
                            }
                        });
                    }
                }
            })
        } else {

            wx.navigateTo({
                url: '/pages/goods/goods?id=' + goodsId,
            });
        }
    },
    //按下事件开始  
    touchStart: function(e) {
        let _this = this;
        _this.setData({
            touch_start: e.timeStamp
        })
        console.log(e.timeStamp + '- touch-start')
    },
    //按下事件结束  
    touchEnd: function(e) {
        let _this = this;
        _this.setData({
            touch_end: e.timeStamp
        })
        console.log(e.timeStamp + '- touch-end')
    },
})