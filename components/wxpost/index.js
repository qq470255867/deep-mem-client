// components/FriendPub/index.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    location: null,
    images: [],
    content: '',
    imgid: 0,
    realList: [],
    date: '',
    index: 0,
    depths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    depth: 0,
    resource: '',
    
    isupload: false
  },
  /**
   * 组件生命周期
   */
  lifetimes: {
    created() {
      this.settoday()
    },


    attached() {
      this.settoday()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    post() {
      var that = this;
      /**
       * @信息传递到首页
       */
      this.triggerEvent('postlistener', {
        images: this.data.images,
        location: this.data.location,
        content: this.data.content,
        memDate: this.data.date,
        depth: this.data.depth,
        id: '',
        resource: this.data.resource,
        resourceType: '1',
        userId: '1',

      })
      this.clearpost();
    },
    clearpost() {
      this.setData({
        location: null,
        images: [],
        content: '',
        imgid: 0,
        date: '',
        index: 0,
        depth: 0,
        resource: '',
        imgtmp:'',
        isupload: false
      })
      this.settoday()
    },
    chooseImage() {
      wx.chooseImage({
        count: 1, //默认9
        sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: (res) => {
          console.log(res)
          this.setData({
            imgtmp: res.tempFilePaths[0],
            isupload: true
          })
          wx.uploadFile({
            filePath: res.tempFilePaths[0],
            name: 'file',
            url: app.serverUrl + '/mem/upload/file/',
            success: (result) => {
              console.log('result')
              console.log(result)
              let body= JSON.parse(result.data)
              this.setData({
                resource: body.data
              })
            }
          })
        }
      });
    },
    ViewImage(e) {
      wx.previewImage({
        urls: this.data.images,
        current: e.currentTarget.dataset.url
      });
    },
    DelImg(e) {
      this.data.images.splice(e.currentTarget.dataset.index, 1);
      this.setData({
        images: this.data.images
      })
    },
    getInputValue(e) {
      this.setData({
        content: e.detail.value
      })
    },
    saveEditOrNot() {
      var that = this;
      wx.showModal({
        title: '将此次编辑保留',
        content: '',
        cancelText: '不保留',
        confirmText: '保留',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            //  wx.setStorageSync('postdata', that.data)
            wx.navigateBack({
              delta: 1
            })
          } else if (res.cancel) {
            wx.clearStorageSync('postdata')
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    },
    bindDateChange: function (e) {
      this.setData({
        date: e.detail.value
      })
    },
    bindDepthChange: function (e) {
      console.log(e.detail.value);
      this.setData({

        depth: e.detail.value
      })
    },
    settoday(){
      var timestamp = Date.parse(new Date());
      var date = new Date(timestamp);
      //获取年份  
      var Y =date.getFullYear();
      //获取月份  
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      //获取当日日期 
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
      console.log("当前时间：" + Y + '-'  + M+ '-' + D );
      this.setData(
        {
          date: Y + '-'  + M+ '-' + D
        }
      )
    },

    chooseLocation() {
      let self = this
      wx.chooseLocation({
        success(res) {
          self.setData({
            location: res.name
          })
        }
      })
    }
  }
})