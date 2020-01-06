var util = require('../../../utils/util.js');
var api = require('../../../config/linkApi.js');
var app = getApp();

Page({
    data: {
        orderId: 1,
        expressInfo: {},
        expressTraces: []
    },
    onLoad: function(options) {
        this.setData({
            orderId: options.id
        });
        this.getExpressInfo();
    },
    onReady: function() {
        // 页面渲染完成
    },
    onShow: function() {
        // 页面显示

    },
    getExpressInfo() {
        let _this = this;
        util.request(api.OrderExpress, { orderId: _this.data.orderId }).then(function(res) {
            if (res.data.errno === 0) {
                _this.setData({
                  expressInfo: res.data.data,
                  expressTraces: res.data.data.traces
                });
            }
        });
    },
    updateExpress() {
        this.getExpressInfo();
    },
    onHide: function() {
        // 页面隐藏
    },
    onUnload: function() {
        // 页面关闭
    }
})