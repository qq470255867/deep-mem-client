// pages/add/add.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userload: false,
        userInfo: {},
        user: {},
        mem: {}
    },

    postform() {
        if (this.data.mem.content.length<3) {
            wx.showModal({
                title: '提示',
                content: '字数太少啦',
                showCancel: false,
                confirmText: '好的',
            })
            return;
        }
        app.addLog('发表了',this.data.mem.content)
        app.addCurUserExp(5)
        //发送表单
        wx.request({
            url: app.serverUrl + '/mem/post/',
            data: this.data.mem,
            header: {
                'content-type': 'application/json'
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                wx.navigateTo({ //当前页面对应的JS文件内 控制模板
                    url: '../mem/mem?id=' + res.data.data.id +'&&new=1'//需要切换到的页面路劲，此处为相对路劲，id为传递的参数
                })
            }
        })
    },

    postlistener(e) {
        let value = 'mem.userId';
        let usertmp = wx.getStorageSync('user');
        this.setData({
            mem: e.detail,
            [value]: usertmp.id
        })
        if (!this.data.userload) {
            this.getUserProfile();
        } else {
            this.postform(e);
        }

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {},

    getUserProfile: function (res) {
        wx.getUserProfile({
            desc: '用于微信账号与平台账号绑定', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                console.log("获取到的用户信息成功: ", JSON.stringify(res));
                this.setData({
                    userload: true,
                    userInfo: res,
                    userInfoStr: JSON.stringify(res)
                })
                //更新用户信息
                let userLocal = wx.getStorageSync('user')
                let userobj = JSON.parse(this.data.userInfo.rawData);

                this.setData({
                    user: {
                        "id": userLocal.userId,
                        "name": userobj.nickName,
                        "sex": userLocal.sex,
                        "avatar": userobj.avatarUrl,
                        "introduce":userLocal.introduce,
                        "level":userLocal.level,
                        "limitDepth":userLocal.limitDepth,
                        "lovedNum":userLocal.lovedNum,
                        "wxId":userLocal.wxId
                    }
                })
                console.log(this.data.user)
                wx.request({
                    url: app.serverUrl + '/user/update/',
                    data: this.data.user,
                    header: {
                        'content-type': 'application/json'
                    },
                    method: 'POST',
                    success: function (res) {
                        console.log(res.data)
                    }
                })
                this.postform();
            },
            fail: (res) => {
                console.log("获取用户个人信息失败: ", res);
                //用户按了拒绝按钮
                wx.showModal({
                    title: 'sorry',
                    content: '勉强应允不如坦诚拒绝。 —— 雨果',
                    showCancel: false,
                    confirmText: '当然！',
                    success: function (res) {
                        // 用户没有授权成功，不需要改变 isHide 的值
                        if (res.confirm) {
                            console.log('用户点击了“返回授权”');
                        }
                    }
                });
            }
        })
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

    },
    turnpretext() {
        app.addLog('进入了','前言')
        wx.navigateTo({
          url: '../pretext/pretext',
        })
      },
    
      turnfeedback() {
        app.addLog('进入了','反馈')
        wx.navigateTo({
          url: '../feedback/feedback',
        })
      }
})