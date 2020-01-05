var util = require('../../../utils/util.js');
var api = require('../../../config/linkApi.js');

Page({
    data: {
        orderId: 0,
        orderInfo: {},
        orderGoods: [],
        handleOption: {}
    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        this.setData({
            orderId: options.id
        });
        this.getOrderDetail();
    },
    getOrderDetail() {
        let _this = this;
        util.request(api.OrderDetail, {
            orderId: _this.data.orderId
        }).then(function(res) {
            if (res.data.errno === 0) {
              console.log(res.data.data);
                _this.setData({
                  orderInfo: res.data.data.orderInfo,
                  orderGoods: res.data.data.orderGoods,
                  handleOption: res.data.data.handleOption
                });
                //_this.payTimer();
            }
        });
    },
    payTimer() {
        let _this = this;
        let orderInfo = _this.data.orderInfo;

        setInterval(() => {
            console.log(orderInfo);
            orderInfo.add_time -= 1;
            _this.setData({
                orderInfo: orderInfo,
            });
        }, 1000);
    },
    payOrder() {
        let _this = this;
        util.request(api.PayPrepayId, {
            orderId: _this.data.orderId || 15
        }).then(function(res) {
            if (res.data.errno === 0) {
                const payParam = res.data;
                wx.requestPayment({
                    'timeStamp': payParam.timeStamp,
                    'nonceStr': payParam.nonceStr,
                    'package': payParam.package,
                    'signType': payParam.signType,
                    'paySign': payParam.paySign,
                    'success': function(res) {
                        console.log(res)
                    },
                    'fail': function(res) {
                        console.log(res)
                    }
                });
            }
        });

    },
    onReady: function() {
        // 页面渲染完成
    },
    onShow: function() {
        // 页面显示
    },
    onHide: function() {
        // 页面隐藏
    },
    onUnload: function() {
        // 页面关闭
    }
})