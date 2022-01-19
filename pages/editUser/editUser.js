// pages/editUser/editUser.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        user: {
            'id': '',
            'name': '',
            'sex': '',
            'avatar': '',
            'introduce': '',
            'lovedNum': 0,
            'wxId': '',
            'limitDepth': 3
        },
        depths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        sexs: ['保密', '男', '女'],
        userInfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setUser()
    },
    setUser() {
        let usertmp = wx.getStorageSync('user');
        this.setData({
            user: usertmp
        })
    },
    inputchange(e) {
        let value = e.detail.value
        this.setData({
            'user.introduce': value
        })
    },
    bindDepthChange(e) {
        let d = e.detail.value;
        this.setData({
            'user.limitDepth': d
        })
    },
    bindsexChange(e) {
        let s = e.detail.value;

        if (s == '0') {
            s = '保密'
        } else if (s == '1') {
            s = '男'
        } else if (s == '2') {
            s = '女'
        }
        this.setData({
            'user.sex': s
        })
    },
    bindEdit() {
        wx.request({
            url: app.serverUrl + '/user/update/',
            data: this.data.user,
            header: {
                'content-type': 'application/json'
            },
            method: 'POST',
            success: function (res) {
               
                wx.setStorageSync('user', res.data.data)
                wx.navigateBack()
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

    }
})