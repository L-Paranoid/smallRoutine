const util = require('../../../utils/util.js');
var api = require('../../../config/linkApi.js');
const user = require('../../../services/user.js');
const app = getApp();

Page({
    data: {
        userInfo: {},
        showLoginDialog: false
    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
    },
    onReady: function() {

    },
    onShow: function() {
        this.setData({
            userInfo: app.globalData.userInfo,
        });
    },
    onHide: function() {
        // 页面隐藏

    },
    onUnload: function() {
        // 页面关闭
    },

    onUserInfoClick: function() {
        if (wx.getStorageSync('token')) {

        } else {
            this.showLoginDialog();
        }
    },

    showLoginDialog() {
        this.setData({
            showLoginDialog: true
        })
    },

    onCloseLoginDialog() {
        this.setData({
            showLoginDialog: false
        })
    },

    onDialogBody() {
        // 阻止冒泡
    },

    onWechatLogin(e) {
        if (e.detail.errMsg !== 'getUserInfo:ok') {
            if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
                return false
            }
            wx.showToast({
                title: '微信登录失败',
            })
            return false
        }
        util.login().then((res) => {
            return util.request(api.AuthLoginByWeixin, {
                code: res.code,
                userInfo: e.detail
            }, 'POST');
        }).then((res) => {
            console.log(res)
            if (res.data.errno !== 0) {
                wx.showToast({
                    title: '微信登录失败',
                })
                return false;
            }
            // 设置用户信息
            this.setData({
                userInfo: res.data.data.userInfo,
                showLoginDialog: false
            });
            app.globalData.userInfo = res.data.data.userInfo;
            app.globalData.token = res.data.data.token;
            wx.setStorageSync('userInfo', JSON.stringify(res.data.data.userInfo));
            wx.setStorageSync('token', res.data.data.token);
        }).catch((err) => {
            console.log(err)
        })
    },

    onOrderInfoClick: function(event) {
        wx.navigateTo({
            url: '/pages/ucenter/order/order',
        })
    },

    onSectionItemClick: function(event) {

    },

    // TODO 移到个人信息页面
    exitLogin: function() {
        wx.showModal({
            title: '',
            confirmColor: '#b4282d',
            content: '退出登录？',
            success: function(res) {
                if (res.data.confirm) {
                    wx.removeStorageSync('token');
                    wx.removeStorageSync('userInfo');
                    wx.switchTab({
                        url: '/pages/index/index'
                    });
                }
            }
        })

    }
})