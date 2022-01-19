// pages/mem/mem.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    userFromMem:{},
    userId: '',
    serverUrl: "",
    isloved: false,
    lovedNum: 0,
    loved: {},
    lovedNumFromMem: 0,
    hideFlag: true, //true-隐藏 false-显示
    animationData: {}, //
    cpage: 0,
    comments: [],
    commentContent: '',
    commemtNum: 0,
    count: 0,
    nomore: false,
    levelColor:''
  },

  getAMemById: function (id) {
    let that = this;
    wx.request({
      url: app.serverUrl + '/mem/idGet/' + id,
      success: (result) => {
        this.setData({
          m_memory: result.data.data.mem,
          commemtNum:  result.data.data.commentNum,
          lovedNum:result.data.data.userLovedNum,
          lovedNumFromMem :result.data.data.memLovedNum,
          userFromMem: result.data.data.user
        })
    
        that.setLevelColor(result.data.data.user.level)
        that.getloved(result.data.data.mem.id);
      }
    });
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
        }else {
          this.setData({
            isloved: false
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
      'memId': this.data.m_memory.id,
      'memUserId': this.data.m_memory.userId
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
      'memId': this.data.m_memory.id,
      'memUserId': this.data.m_memory.userId
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.app = getApp()
    this.getAMemById(options.id)
    if (options.new) {
      wx.showToast({
        title: '经验+5',
        icon: 'success',
        duration: 2000
      })
    }
   app.addLog('查看了',this.data.m_memory.content)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
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
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  viewimgdetail() {
    console.log(this.data.m_memory.resource)
    wx.previewImage({
      urls: [this.data.m_memory.resource],
    })
  },
  onUnload: function () {

  },
  //模态框部分
  // 点击选项
  getOption: function (e) {
    var that = this;
    that.setData({
      value: e.currentTarget.dataset.value,
      hideFlag: true
    })
  },
  //取消
  mCancel: function () {
    var that = this;
    that.hideModal();

    this.setData({
      cpage: 0
    })
  },

  // ----------------------------------------------------------------------modal
  // 显示遮罩层
  showModal: function () {

    var that = this;
    that.setData({
      hideFlag: false
    })
    // 创建动画实例
    var animation = wx.createAnimation({
      duration: 400, //动画的持续时间
      timingFunction: 'ease', //动画的效果 默认值是linear->匀速，ease->动画以低速开始，然后加快，在结束前变慢
    })
    this.animation = animation; //将animation变量赋值给当前动画
    var time1 = setTimeout(function () {
      that.slideIn(); //调用动画--滑入
      clearTimeout(time1);
      time1 = null;
    }, 100)

    //获取数据
    this.getComment()

  },

  // 隐藏遮罩层
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 400, //动画的持续时间 默认400ms
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    that.slideDown(); //调用动画--滑出
    var time1 = setTimeout(function () {
      that.setData({
        hideFlag: true,
        cpage: 0
      })
      clearTimeout(time1);
      time1 = null;
    }, 220) //先执行下滑动画，再隐藏模块

  },
  //动画 -- 滑入
  slideIn: function () {
    this.animation.translateY(0).step() // 在y轴偏移，然后用step()完成一个动画
    this.setData({
      //动画实例的export方法导出动画数据传递给组件的animation属性
      animationData: this.animation.export()
    })
  },
  //动画 -- 滑出
  slideDown: function () {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },
  // 获取评论
  getComment() {
    wx.request({
      url: this.app.serverUrl + '/com/get/' + this.data.m_memory.id + '/' + 0,
      success: (result) => {
        this.setData({
          comments: result.data.data.list,
          count: result.data.data.count
        })
      }
    })
  },
  appendComment() {
    if (this.data.comments.length >= this.data.count) {
      this.setData({
        nomore: true
      })
      return
    }
    this.data.cpage++;
    wx.request({
      url: this.app.serverUrl + '/com/get/' + this.data.m_memory.id + '/' + this.data.cpage,
      success: (result) => {
        this.setData({
          comments: [...this.data.comments, ...result.data.data.list]

        })
      }
    })
  },
  //新增评论
  addComment() {
    if (this.data.commentContent.length == 0) {
      wx.showToast({
        title: '内容不能为空',
        icon: 'error',
        duration: 2000
      })
      return
    }
    let curUid = wx.getStorageSync('user').id;
    let commemt = {
      'content': this.data.commentContent,
      'userId': curUid,
      'memId': this.data.m_memory.id
    }
    this.setData({
      commentContent: '',
      commemtNum: this.data.commemtNum + 1
    })
    let that = this;
    wx.request({
      url: app.serverUrl + '/com/add/',
      data: commemt,
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        that.getComment()
      }
    })

  },

  getUserProfile: function (res) {
    wx.getUserProfile({
      desc: '用于微信账号与平台账号绑定', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("获取到的用户信息成功: ", JSON.stringify(res));
        this.setData({
          userInfo: res
        })
        //更新用户信息
        let userStr = wx.getStorageSync('user')
        let userId = userStr.id;
        let userobj = JSON.parse(this.data.userInfo.rawData);
        this.setData({
          user: {
            "id": userId,
            "name": userobj.nickName,
            "sex": userobj.gender,
            "avatar": userobj.avatarUrl
          }
        })
        console.log(this.data.user)
      },
      fail: (res) => {
        console.log("获取用户个人信息失败: ", res);
        //用户按了拒绝按钮
        wx.showModal({
          title: 'sorry',
          content: '忠于自己才是正确的选择',
          showCancel: false,
          confirmText: '没错！',
          success: function (res) {
            // 用户没有授权成功，不需要改变 isHide 的值
            if (res.confirm) {
              wx.navigateBack()
              console.log('用户点击了“返回授权”');
            }
          }
        });
      }
    })
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
    app.addLog('分享了',this.data.m_memory.content)
    return {
      title: this.data.m_memory.content,    //自定义标题   string
      path:'/pages/index/index?id='+this.data.m_memory.id,

    }
  },
  setLevelColor(level) {
    if (level == 1) {
      this.setData({
        levelColor: 'rgb(127,255,0)'
      })
    } else if (level == 2) {
      this.setData({
        levelColor: 'rgb(255,127,80)'
      })
    } else if (level == 3) {
      this.setData({
        levelColor: 'rgb(0,255,255)'
      })
    } else if (level == 4) {
      this.setData({
        levelColor: 'rgb(255,140,0)'
      })
    } else if (level == 5) {
      this.setData({
        levelColor: 'rgb(255,20,147)'
      })
    } else if (level == 6) {
      this.setData({
        levelColor: 'rgb(125, 250, 9)'
      })
    } else if (level == 7) {
      this.setData({
        levelColor: 'rgb(30,144,255)'
      })
    } else if (level == 8) {
      this.setData({
        levelColor: 'rgb(125, 250, 9)'
      })
    } else if (level == 9) {
      this.setData({
        levelColor: 'rgb(255,0,255)'
      })
    } else if (level == 10) {
      this.setData({
        levelColor: 'rgb(75,0,130)'
      })
    } else if (level == 11) {
      this.setData({
        levelColor: 'rgb(240,128,128)'
      })
    } else if (level == 12) {
      this.setData({
        levelColor: 'rgb(128,0,0)'
      })
    } else if (level == 13) {
      this.setData({
        levelColor: 'rgb(65,105,225)'
      })
    } else if (level == 14) {
      this.setData({
        levelColor: 'rgb(106,90,205)'
      })
    } else if (level == 15) {
      this.setData({
        levelColor: 'rgb(47,79,79)'
      })
    } else if (level == 16) {
      this.setData({
        levelColor: 'rgb(255,20,147)'
      })
    } else if (level == 17) {
      this.setData({
        levelColor: 'rgb(148,0,211)'
      })
    } else if (level == 18) {
      this.setData({
        levelColor: 'rgb(255,215,0)'
      })
    } else if (level == 19) {
      this.setData({
        levelColor: 'rgb(255,69,0)'
      })
    } else if (level == 20) {
      this.setData({
        levelColor: 'rgb(255,0,0)'
      })
    }
  }
})