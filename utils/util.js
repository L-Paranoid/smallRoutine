var api = require('../config/linkApi.js');
const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
        n = n.toString()
        return n[1] ? n : '0' + n
    }
    /*封装微信request*/
function request(url, data = {}, method = 'GET') {
    return new Promise(function(resolve, reject) {
        wx.request({
            url: url,
            data: data,
            method: method,
            header: {
                'Content-Type': 'application/json',
                'X-Nideshop-Token': wx.getStorageSync('token')
            },
            success: function(res) {
                if (res.statusCode == 200) {
                    if (res.data.errno == 401) {
                        let code = null;
                        return login().then((res) => {
                            let code = res.code;
                            return getUserInfo();
                        }).then((userInfo) => {
                            request(api.AuthLoginByWeixin, { code: code, userInfo: userInfo }, 'POST').then(res => {
                                if (res.data.errno === 0) {
                                    //储存用户信息
                                    wx.setStorageSync('userInfo', res.data.userInfo);
                                    wx.setStorageSync('token', res.data.token);
                                    resolve(res);
                                } else {
                                    reject(res);
                                }
                            }).catch((err) => {
                                reject(err);
                            })
                        }).catch((err) => {
                            reject(err);
                        })
                    } else {
                        resolve(res);
                    }
                } else {
                    reject(res.errMsg);
                }
            },
            fail: function(err) {
                reject(err);
            }
        })
    });
}

function get(url, data = {}) {
    request(url, data, "GET");
}

function post(url, data = {}) {
    request(url, data, "POST");
}
//检查微信会话是否过期
function checkSession() {
    return new Promise(function(resolve, reject) {
        wx.checkSession({
            success: function() {
                resolve(true);
            },
            fail: function() {
                reject(false);
            }
        })
    });
}
//调用微信登录
function login() {
    return new Promise(function(resolve, reject) {
        wx.login({
            success: function(res) {
                if (res.code) {
                    resolve(res);
                } else {
                    reject(res);
                }
            },
            fail: function(err) {
                reject(err);
            }
        });
    });
}

function getUserInfo() {
    return new Promise(function(resolve, reject) {
        wx.getUserInfo({
            withCredentials: true,
            success: function(res) {
              //原写法 res.detail.errMsg
                if (res.errMsg === 'getUserInfo:ok') {
                    resolve(res);
                } else {
                    reject(res);
                }
            },
            fail: function(err) {
                reject(err);
            }
        })
    })
}

//判断用户是否需要登录
function redirect(url) {
    if (false) {
        wx.redirectTo({
            url: '/pages/auth/login/login',
        });
        return false;
    } else {
        wx.redirectTo({
            url: url
        });
    }
}
//显示错误提示
function showErrorToast(msg) {
    wx.showToast({
        title: msg,
        image: '/static/images/icon_error.png'
    })
}
module.exports = {
    formatTime,
    request,
    get,
    post,
    redirect,
    showErrorToast,
    checkSession,
    login,
    getUserInfo
}