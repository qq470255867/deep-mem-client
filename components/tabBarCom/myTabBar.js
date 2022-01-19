const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabbar: {
      type: Object,
      value: {
        "backgroundColor": "#ffffff",
        "color": "#979795",
        "selectedColor": "#1c1c1b",
        "list": [
          {
            "pagePath": "/pages/teacher/sign_home",
            "text": "首页",
            "iconPath": "../../images/home1.png",
            "selectedIconPath": "../../images/home2.png"
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
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    shareTherelease(e) {
      console.log(e.currentTarget.dataset.url);
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    },
    onSwitchTab(e){
      console.log(e.currentTarget.dataset.url)
      wx.switchTab({
        url: e.currentTarget.dataset.url,
      })
    }
  }
})
