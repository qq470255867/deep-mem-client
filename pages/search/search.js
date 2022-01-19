// pages/search/search.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchContent: "",
    hidenX: true,
    page: 0,
    mems: [],
    count: 0

  },

  search() {
    if (this.data.searchContent.length == 0) {
      wx.showToast({
        title: '内容不能为空',
        icon: 'error',
        duration: 2000
      })
      return
    }

    let s_data = {
      'content': this.data.searchContent,
      'page': this.data.page
    }
    let that = this;
    app.addLog('查找了',this.data.searchContent)
    wx.request({
      url: app.serverUrl + '/mem/search/mem/',
      data: s_data,
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          mems: res.data.data.list,
          count: res.data.data.count
        })
        if (res.data.data.list.length==0) {
          wx.showToast({
            title: '没有找到哦',
            icon: 'error',
            duration: 2000
          })
          return
        }
      }
    })
  },

  appendmemList() {
    if (this.data.mems.length >= this.data.count) {
      wx.showToast({
        title: '没有更多了哦',
        icon: 'error',
        duration: 2000
      })
      return
    }
    this.data.page++;

    let s_data = {
      'content': this.data.searchContent,
      'page': this.data.page
    }
    let that = this;
    wx.request({
      url: app.serverUrl + '/mem/search/mem/',
      data: s_data,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: (result) => {
        that.setData({
          mems: [...this.data.mems, ...result.data.data.list]
        })
      }
    });
  },
  clearContent() {
    this.setData({
      searchContent: '',
      mems: [],
      page: 0
    })
  },
  turnTodetail(e) {
    wx.navigateTo({
      url: '../mem/mem?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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