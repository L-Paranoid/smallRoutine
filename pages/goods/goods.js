var app = getApp();
var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var api = require('../../config/linkApi.js');

Page({
    data: {
        id: 0,
        goods: {},
        gallery: [],
        attribute: [],
        issueList: [],
        comment: [],
        brand: {},
        specificationList: [],
        productList: [],
        relatedGoods: [],
        cartGoodsCount: 0,
        userHasCollect: 0,
        number: 1,
        checkedSpecText: '请选择规格数量',
        openAttr: false,
        noCollectImage: "/static/images/icon_collect.png",
        hasCollectImage: "/static/images/icon_collect_checked.png",
        collectBackImage: "/static/images/icon_collect.png"
    },
    getGoodsInfo: function() {
        let _this = this;
        util.request(api.GoodsDetail, { id: _this.data.id }).then(function(res) {
            if (res.data.errno === 0) {
                _this.setData({
                    goods: res.data.data.info,
                    gallery: res.data.data.gallery,
                    attribute: res.data.data.attribute,
                    issueList: res.data.data.issue,
                    comment: res.data.data.comment,
                    brand: res.data.data.brand,
                    specificationList: res.data.data.specificationList,
                    productList: res.data.data.productList,
                    userHasCollect: res.data.data.userHasCollect
                });

                if (res.data.userHasCollect == 1) {
                    _this.setData({
                        'collectBackImage': _this.data.hasCollectImage
                    });
                } else {
                    _this.setData({
                        'collectBackImage': _this.data.noCollectImage
                    });
                }

                WxParse.wxParse('goodsDetail', 'html', res.data.data.info.goods_desc, _this);

                _this.getGoodsRelated();
            }
        });

    },
    getGoodsRelated: function() {
        let _this = this;
        util.request(api.GoodsRelated, { id: _this.data.id }).then(function(res) {
            if (res.data.errno === 0) {
                _this.setData({
                    relatedGoods: res.data.data.goodsList,
                });
            }
        });

    },
    clickSkuValue: function(event) {
        let _this = this;
        let specNameId = event.currentTarget.dataset.nameId;
        let specValueId = event.currentTarget.dataset.valueId;

        //判断是否可以点击

        //TODO 性能优化，可在wx:for中添加index，可以直接获取点击的属性名和属性值，不用循环
        let _specificationList = this.data.specificationList;
        for (let i = 0; i < _specificationList.length; i++) {
            if (_specificationList[i].specification_id == specNameId) {
                for (let j = 0; j < _specificationList[i].valueList.length; j++) {
                    if (_specificationList[i].valueList[j].id == specValueId) {
                        //如果已经选中，则反选
                        if (_specificationList[i].valueList[j].checked) {
                            _specificationList[i].valueList[j].checked = false;
                        } else {
                            _specificationList[i].valueList[j].checked = true;
                        }
                    } else {
                        _specificationList[i].valueList[j].checked = false;
                    }
                }
            }
        }
        this.setData({
            'specificationList': _specificationList
        });
        //重新计算spec改变后的信息
        this.changeSpecInfo();

        //重新计算哪些值不可以点击
    },

    //获取选中的规格信息
    getCheckedSpecValue: function() {
      debugger;
        let checkedValues = [];
        let _specificationList = this.data.specificationList;
        for (let i = 0; i < _specificationList.length; i++) {
            let _checkedObj = {
                nameId: _specificationList[i].specification_id,
                valueId: 0,
                valueText: ''
            };
            for (let j = 0; j < _specificationList[i].valueList.length; j++) {
                if (_specificationList[i].valueList[j].checked) {
                    _checkedObj.valueId = _specificationList[i].valueList[j].id;
                    _checkedObj.valueText = _specificationList[i].valueList[j].value;
                }
            }
            checkedValues.push(_checkedObj);
        }

        return checkedValues;

    },
    //根据已选的值，计算其它值的状态
    setSpecValueStatus: function() {

    },
    //判断规格是否选择完整
    isCheckedAllSpec: function() {
        return !this.getCheckedSpecValue().some(function(v) {
            if (v.valueId == 0) {
                return true;
            }
        });
    },
    getCheckedSpecKey: function() {
        let checkedValue = this.getCheckedSpecValue().map(function(v) {
            return v.valueId;
        });

        return checkedValue.join('_');
    },
    changeSpecInfo: function() {
        let checkedNameValue = this.getCheckedSpecValue();

        //设置选择的信息
        let checkedValue = checkedNameValue.filter(function(v) {
            if (v.valueId != 0) {
                return true;
            } else {
                return false;
            }
        }).map(function(v) {
            return v.valueText;
        });
        if (checkedValue.length > 0) {
            this.setData({
                'checkedSpecText': checkedValue.join('　')
            });
        } else {
            this.setData({
                'checkedSpecText': '请选择规格数量'
            });
        }

    },
    getCheckedProductItem: function(key) {
        return this.data.productList.filter(function(v) {
            if (v.goods_specification_ids == key) {
                return true;
            } else {
                return false;
            }
        });
    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        this.setData({
            id: parseInt(options.id)
                // id: 1181000
        });
        var _this = this;
        this.getGoodsInfo();
        util.request(api.CartGoodsCount).then(function(res) {
            if (res.data.errno === 0) {
                _this.setData({
                    cartGoodsCount: res.data.data.cartTotal.goodsCount
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

    },
    switchAttrPop: function() {
        if (this.data.openAttr == false) {
            this.setData({
                openAttr: !this.data.openAttr
            });
        }
    },
    closeAttr: function() {
        this.setData({
            openAttr: false,
        });
    },
    addCannelCollect: function() {
        let _this = this;
        //添加或是取消收藏
        util.request(api.CollectAddOrDelete, { typeId: 0, valueId: this.data.id }, "POST")
            .then(function(res) {
                let _res = res;
                if (_res.data.errno == 0) {
                    if (_res.data.data.type == 'add') {
                        _this.setData({
                            'collectBackImage': _this.data.hasCollectImage
                        });
                    } else {
                        _this.setData({
                            'collectBackImage': _this.data.noCollectImage
                        });
                    }

                } else {
                    wx.showToast({
                        image: '/static/images/icon_error.png',
                        title: _res.errmsg,
                        mask: true
                    });
                }
            });
    },
    openCartPage: function() {
        wx.switchTab({
            url: '/pages/cart/cart',
        });
    },
    addToCart: function() {
        var _this = this;
        if (this.data.openAttr === false) {
            //打开规格选择窗口
            this.setData({
                openAttr: !this.data.openAttr
            });
        } else {

            //提示选择完整规格
            if (!this.isCheckedAllSpec()) {
                wx.showToast({
                    image: '/static/images/icon_error.png',
                    title: '请选择规格',
                    mask: true
                });
                return false;
            }

            //根据选中的规格，判断是否有对应的sku信息
            let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());
            if (!checkedProduct || checkedProduct.length <= 0) {
                //找不到对应的product信息，提示没有库存
                wx.showToast({
                    image: '/static/images/icon_error.png',
                    title: '库存不足',
                    mask: true
                });
                return false;
            }

            //验证库存
            if (checkedProduct.goods_number < this.data.number) {
                //找不到对应的product信息，提示没有库存
                wx.showToast({
                    image: '/static/images/icon_error.png',
                    title: '库存不足',
                    mask: true
                });
                return false;
            }

            //添加到购物车
            util.request(api.CartAdd, { goodsId: this.data.goods.id, number: this.data.number, productId: checkedProduct[0].id }, "POST")
                .then(function(res) {
                    let _res = res;
                    if (_res.data.errno == 0) {
                        wx.showToast({
                            title: '添加成功'
                        });
                        _this.setData({
                            openAttr: !_this.data.openAttr,
                            cartGoodsCount: _res.data.data.cartTotal.goodsCount
                        });
                    } else {
                        wx.showToast({
                            image: '/static/images/icon_error.png',
                            title: _res.errmsg,
                            mask: true
                        });
                    }

                });
        }

    },
    cutNumber: function() {
        this.setData({
            number: (this.data.number - 1 > 1) ? this.data.number - 1 : 1
        });
    },
    addNumber: function() {
        this.setData({
            number: this.data.number + 1
        });
    }
})