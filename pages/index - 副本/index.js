// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    memory: {},
    user: {},
    userId: '',
    serverUrl: "",
    isloved: false,
    lovedNum: 0,
    loved: {},
    lovedNumFromMem:0
  },
  onLoad() {
    this.app = getApp()
    //  app.editTabbar();
    this.getAMem();
  },
  onPullDownRefresh: function () {
    this.getAMem();

  },
  onReachBottom: function () {
    // this.getAMem();
    // wx.pageScrollTo({
    //   scrollTop: 0
    // })
  },
  getloved(memId) {
    let curUserId = wx.getStorageSync('user').id;
    let requestBody = {
      'userId': curUserId,
      'memId': memId
    }
    wx.request({
      url: app.serverUrl + '/loved/get/',
      data: requestBody,
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: (result) => {
        if (result.data.data) {
          this.setData({
            isloved: true
          })
        }
      }
    })
  },

  lovedopt(e) {
    console.log(this.data.isloved)
    if (!this.data.isloved) {
      this.setData({
        isloved: true,
        lovedNum: this.data.lovedNum + 1,
        lovedNumFromMem: this.data.lovedNumFromMem + 1
      })
    this.addloved()
    } else {
      this.setData({
        isloved: false,
        lovedNum: this.data.lovedNum - 1,
        lovedNumFromMem: this.data.lovedNumFromMem - 1
      })
      this.delloved()
    }
  },
  addloved() {
    let curUserId = wx.getStorageSync('user').id;
    let requestBody = {
      'userId': curUserId,
      'memId': this.data.memory.id
    }
    wx.request({
      url: app.serverUrl + '/loved/add/',
      data: requestBody,
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: (result) => {
        if (result.data.data) {
          this.setData({
            isloved: true
          })
        }
      }
    })
  },
  delloved() {
    let curUserId = wx.getStorageSync('user').id;
    let requestBody = {
      'userId': curUserId,
      'memId': this.data.memory.id
    }
    wx.request({
      url: app.serverUrl + '/loved/del/',
      data: requestBody,
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: (result) => {
        if (result.data.data) {
          this.setData({
            isloved: false
          })
        }
      }
    })
  },

  //获取随机一条记忆
  getAMem: function () {
    wx.request({
      url: app.serverUrl + '/mem/get',
      success: (result) => {
        this.setData({
          memory: result.data.data,
          lovedNumFromMem:result.data.data.lovedNum
        })
        //获取用户
        wx.request({
          url: app.serverUrl + '/user/get/' + result.data.data.userId,
          success: (result) => {
            this.setData({
              user: result.data.data,
              lovedNum: result.data.data.lovedNum
            })

          }
        });
        //获取点赞
        this.setData({
          isloved:false
        })
        this.getloved(result.data.data.id);
      }
    });
  },
  getUerByid(id) {
    wx.request({
      url: app.serverUrl + '/user/get/' + id,
      success: (result) => {
        this.setData({
          user: result.data.data
        })
      }
    });
  },
  //页面展示时，触发动画
  onShow: function () {
    this.app.slideupshow(this, 'slide_up1', -10, 1)

    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up2', -200, 1)
    }.bind(this), 200);
  },
  //页面隐藏时，触发渐出动画
  onHide: function () {
    //你可以看到，动画参数的200,0与渐入时的-200,1刚好是相反的，其实也就做到了页面还原的作用，使页面重新打开时重新展示动画
    this.app.slideupshow(this, 'slide_up1', 200, 0)
    //延时展现容器2，做到瀑布流的效果，见上面预览图
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up2', 200, 0)
    }.bind(this), 200);
  }

})