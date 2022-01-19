// app.js
App({
      //  serverUrl: "http://localhost:9090",
    //  serverUrl: "http://192.168.101.53:9090",
          serverUrl: "https://www.icycraft.cn/deepmem/",
  userInfo: null,
  usercode: '',

  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        wx.request({
          url: this.serverUrl + '/user/get/openId/' + res.code,
          success: (result) => {
            wx.setStorageSync('openId', result.data.data);
            wx.request({
              url: this.serverUrl + '/user/login/' + result.data.data,
              success: (result) => {
                wx.setStorageSync('user', result.data.data)
               this.addLog('登录了','')
              }
            });
          }
        });

      }
    })
   
  },
  addLog(op,content){
    let user = wx.getStorageSync('user');
    if (user.id==6) {
      return
    }

    let log = {
      'userId':user.id,
      'op':op,
      'content':content
    }
    wx.request({
      url: this.serverUrl + '/log/add/',
      data: log,
      header: {
          'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
          console.log(res.data)
      }
  })

  },


  addCurUserExp(exp) {
    let user = wx.getStorageSync('user');
    wx.request({
      url: this.serverUrl + '/lv/exp/add/' + user.id + '/' + exp,
      success: (result) => {
        wx.request({
          url: this.serverUrl+'/user/get/'+user.id,
          success: (re) => {
            wx.setStorageSync('user', re.data.data)
          }
        });
      }
    });
  },
  addOtherExp(userId,exp) {
    wx.request({
      url: this.serverUrl + '/lv/exp/add/' + userId + '/' + exp,
      success: (result) => {
      }
    });
  },

  globalData: {
    userInfo: null,
    tabBar: {
      "backgroundColor": "#ffffff",
      "color": "#333333",
      "selectedColor": "#26C55E",
      "list": [{
          "pagePath": "/pages/teacher/sign_home",
          "text": "首页",
          "iconPath": "../../images/home1.png",
          "selectedIconPath": "../../images/home2.png"
        },
        {
          "pagePath": "/pages/mem/mem",
        },
        {
          "pagePath": "/pages/teacher/sign_launch",
          "isSpecial": true,
          "text": "发布",
          "iconPath": "../../images/publish.png",
          "selectedIconPath": "../../images/publish.png",
        },
        {
          "pagePath": "/pages/teacher/sign_my",
          "text": "我的",
          "iconPath": "../../images/my1.png",
          "selectedIconPath": "../../images/my2.png"
        }
      ]
    }
  },
  editTabbar: function () {
    //隐藏系统tabbar
    wx.hideTabBar();
    let tabbar = this.globalData.tabBar;
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },
  //动画
  //渐入，渐出实现 
  show: function (that, param, opacity) {
    var animation = wx.createAnimation({
      //持续时间800ms
      duration: 800,
      timingFunction: 'ease',
    });
    //var animation = this.animation
    animation.opacity(opacity).step()
    //将param转换为key
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export()
    //设置动画
    that.setData(json)
  },

  //滑动渐入渐出
  slideupshow: function (that, param, px, opacity) {
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
    });
    animation.translateY(px).opacity(opacity).step()
    //将param转换为key
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export()
    //设置动画
    that.setData(json)
  },

  //向右滑动渐入渐出
  sliderightshow: function (that, param, px, opacity) {
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
    });
    animation.translateX(px).opacity(opacity).step()
    //将param转换为key
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export()
    //设置动画
    that.setData(json)
  }
})