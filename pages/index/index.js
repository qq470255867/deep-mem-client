// index.js
// 获取应用实例
const app = getApp()
const innerAudioContext = wx.createInnerAudioContext();
Page({
  data: {
    // memory:{},
    m_memory: {
      'id': '',
      'avatar': '',
      'commentNum': '',
      'content': '',
      'createDate': '',
      'depth': 0,
      'introduce': '',
      'location': '',
      'lovedNum': 0,
      'memDate': '',
      'name': '',
      'resource': '',
      'resourceType': '',
      'userId': '',
      'userLovedNum': 0
    },
    direct: '',
    user: {},
    userId: '',
    serverUrl: "",
    isloved: false,
    lovedNum: 0,
    loved: {},
    lovedNumFromMem: 0,
    mems: [],
    viewedIds: [],
    viewedId: [],
    nowclientX: "",
    switch_card: {},
    hideFlag: true, //true-隐藏 false-显示
    animationData: {}, //
    cpage: 0,
    comments: [],
    commentContent: '',
    commemtNum: 0,
    count: 0,
    nomore: false,
    levelColor: '',
    hidpretext: false,
    //查看下标
    m_index: 0,
    userFromMem: {},
    musicAnimation: '',
    bgmplay:true,
    itsMe:false,
    cur_pic_index:0
  },
  onLoad(options) {
    this.app = getApp()
    if (options.id) {
      this.getACertenMem(options.id)
    }else{
      this.getARandMem()
    }
    this.BgmPlay()
    this.setItsMe()
  },
  getARandMem() {
    let that = this;
    wx.request({
      url: app.serverUrl + '/mem/get/rand/' + this.data.m_index,
      success: (result) => {
        this.setData({
          m_memory: result.data.data.mem,
          commentNum: result.data.data.commentNum,
          lovedNum: result.data.data.userLovedNum,
          lovedNumFromMem: result.data.data.memLovedNum,
          userFromMem: result.data.data.user
        })
        that.setLevelColor(result.data.data.user.level)
        that.getloved(result.data.data.mem.id);
      }
    })
    app.addLog('查看了',this.data.m_memory.content)
  },
  turnNextPic(){
    if (!this.data.itsMe) {
      return
    }

    this.setData({
      cur_pic_index:this.data.cur_pic_index + 1
    })
    if (this.data.cur_pic_index>19) {
      this.setData({
        cur_pic_index:0
      })
    }
    wx.request({
      url: app.serverUrl + '/refresh/pic/' + this.data.m_memory.id+'/'+this.data.cur_pic_index,
      success: (result) => {
        this.setData({
         'm_memory.resource': result.data
        })
      }
    })
  },

  turnPrePic(){
    if (!this.data.itsMe) {
      return
    }

    this.setData({
      cur_pic_index:this.data.cur_pic_index - 1
    })
    if (this.data.cur_pic_index<0) {
      this.setData({
        cur_pic_index:19
      })
    }

    wx.request({
      url: app.serverUrl + '/refresh/pic/' + this.data.m_memory.id+'/'+this.data.cur_pic_index,
      success: (result) => {
        this.setData({
         'm_memory.resource': result.data
        })
      }
    })
  },

  setItsMe(){
    if (6 == wx.getStorageSync('user').id) {
      this.setData({
        itsMe:true
      })
    }
  },

  getACertenMem(id) {
    let that = this;
    wx.request({
      url: app.serverUrl + '/mem/get/' + id,
      success: (result) => {
        this.setData({
          m_memory: result.data.data.mem,
          commentNum: result.data.data.commentNum,
          lovedNum: result.data.data.userLovedNum,
          lovedNumFromMem: result.data.data.memLovedNum,
          userFromMem: result.data.data.user
        })
        that.setLevelColor(result.data.data.user.level)
        that.getloved(result.data.data.mem.id);
      }
    })
  },

  BgmPlay(){

    this.musicAnimation = wx.createAnimation({
      duration: 1400,
      timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
      delay: 0,
      transformOrigin: '50% 50% 0',
      success: function (res) {
        console.log("res")
      }
    })
    var n = 0,
      that = this;
    this.interval = setInterval(function () {
      if (that.data.bgmplay) {
        that.rotateAni(n);
        n++;
      }
     
    }, 1400);
    innerAudioContext.autoplay = true;
    innerAudioContext.src = 'http://music.163.com/song/media/outer/url?id=478507889.mp3';
    innerAudioContext.loop = true;
    innerAudioContext.play();
    innerAudioContext.onCanplay((res)=>{
      innerAudioContext.play();
    })
  },
  bgmAniopt(){
    if (this.data.bgmplay) {
    
      this.setData({
        bgmplay:false,
      })
      innerAudioContext.pause()
    }else {
      this.setData({
        bgmplay:true
      })
       innerAudioContext.play()

    }

  },
  rotateAni: function (n) {
    this.musicAnimation.rotate(180 * (n)).step()
    this.setData({
      musicAnimation: this.musicAnimation.export()
    })
  },
  onPullDownRefresh: function () {

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
        } else {
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
        lovedNumFromMem: this.data.lovedNumFromMem + 1,
      })
      this.addloved()
    } else {
      this.setData({
        isloved: false,
        lovedNum: this.data.lovedNum - 1,
        lovedNumFromMem: this.data.lovedNumFromMem - 1,
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
  switchNext() {
    if (this.data.m_index < 300 && this.data.direct == 'next') {
      //下一张
      this.setData({
        m_index: this.data.m_index + 1
      })

    } else if (this.data.m_index > 0 && this.data.direct == 'pre') {
      //  上一张
      this.data.m_index--;
    }
    this.setData({
      loved: true
    })
    this.getARandMem()
  },


  getAMemById: function (id) {
    wx.request({
      url: app.serverUrl + '/mem/idGet/' + id,
      success: (result) => {
        this.setData({
          memory: result.data.data,
          viewedId: result.data.data.id,
          lovedNumFromMem: result.data.data.lovedNum,
          commemtNum: result.data.data.commemtNum
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
          isloved: false
        })
        this.getloved(result.data.data.id);
      }
    });
  },
  showadd() {
    wx.navigateTo({
      url: '../add/add',
    })
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
  onShow: function (launchOptions) {
    this.app.slideupshow(this, 'slide_up1', -10, 1)

    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up2', -200, 1)
    }.bind(this), 200);
    if (this.data.bgmplay) {
      innerAudioContext.play()
    }

   
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
  touchstart(e) {
    console.log(e)
    this.setData({
      nowclientX: e.changedTouches[0].clientX
    })
  },
  touchend(e) {

    let nowclientX = this.data.nowclientX;
    let clientX = e.changedTouches[0].clientX;
    if (clientX - nowclientX > 50) {
      console.log("向右滑动")
      this.mCancel()
      this.translate('right');
      this.setData({
        direct: 'pre'
      })
      setTimeout(this.switchNext, 500)
    } else if (nowclientX - clientX > 50) {
      console.log("向左滑动")
      this.mCancel()
      this.translate('left');
      this.setData({
        direct: 'next'
      })
      setTimeout(this.switchNext, 500)
    }
  },
  viewimgdetail() {
    this.setData({
      bgmplay:false
    })
    console.log(this.data.m_memory.resource)
    wx.previewImage({
      urls: [this.data.m_memory.resource],
    })
  },
  //动画
  translate: function (direction) {
    let x = 0;
    if (direction == 'left') {
      x = -500
    } else if (direction == 'right') {
      x = 500
    }
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    });
    animation.opacity(0.5).translate(x, 0).step()
    animation.opacity().translate(-x, 0).step({
      duration: 0
    })
    animation.opacity().translate(0, 0).step()
    this.setData({
      switch_card: animation.export()
    })
  },
  //模态框部分
  // 点击选项
  getOption: function (e) {
    var that = this;
    that.setData({
      value: e.currentTarget.dataset.value,
      hideFlag: true,
      hidpretext: true
    })
  },
  //取消
  mCancel: function () {
    var that = this;
    that.hideModal();

    this.setData({
      cpage: 0,
      hidpretext: false
    })
  },

  // ----------------------------------------------------------------------modal
  // 显示遮罩层
  showModal: function () {

    var that = this;
    that.setData({
      hideFlag: false,
      hidpretext: true
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
        hidpretext: false,
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
    app.addCurUserExp(3)
    wx.showToast({
      title: '经验+3',
      icon: 'success',
      duration: 2000
    })
    app.addOtherExp(this.data.m_memory.userId, 3);
    let commemt = {
      'content': this.data.commentContent,
      'userId': curUid,
      'memId': this.data.m_memory.id
    }
    let cnum = 'm_memory.commentNum'
    this.setData({
      commentContent: '',
      [cnum]: this.data.m_memory.commentNum + 1
    })
    this.setData({
      commentNum: this.data.commentNum + 1
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
  //跳转前言 
  turnpretext() {
    wx.navigateTo({
      url: '../pretext/pretext',
    })
  },

  turnfeedback() {
    wx.navigateTo({
      url: '../feedback/feedback',
    })
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
  },
  turnOtherUser() {
    wx.navigateTo({
      url: '../otherUser/ohterUser?userId=' + this.data.userFromMem.id,
    })
  },
 /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    app.addLog('分享了',this.data.m_memory.content)
    return {
      title: this.data.m_memory.content,    //自定义标题   string
      path:'/pages/index/index?id='+this.data.m_memory.id,

    }
    
  },
  onShareTimeline: function(res){
    app.addLog('分享了朋友圈',this.data.m_memory.content)
    return {
      title: this.data.m_memory.content, //字符串  自定义标题
      query: `id=${this.data.m_memory.id}`,  //页面携带参数
      imageUrl:this.data.m_memory.resource   //图片地址
    }
  }


})