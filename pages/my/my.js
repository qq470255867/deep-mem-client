// pages/my/my.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

        user:{},
        item: 0,
        tab: 0,
        memList: [],
        lovedMemList: [],
        page: 0,
        lovedPage: 0,
        orderType: 1,
        count: 0,
        lovedCount: 0,
        nomore: false,
        nomoreloved: false,
        depths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, '全部的记忆'],
        depth: 10,
        levelColor:'',
        needExp:1,
        propercent:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.refreshUser();
        this.getmemList();
        this.getlovedmemList();
    },

    setUserToLocal() {
        wx.setStorageSync('user', this.data.user)
    },

    refreshUser(){
       let that = this;
       let userId =   wx.getStorageSync('user').id;
        wx.request({
            url: app.serverUrl + '/user/get/'+userId,
            success: (result) => {
                this.setData({
                    user:result.data.data
                })
                that.setLevelColor()
                that.setNeed()
                that.setpercent()
                that.setUserToLocal()
            }
        })
    },

    memdetail: function (e) {
        wx.navigateTo({
            url: '../mem/mem?id=' + e.currentTarget.dataset.id,
        })
    },
    getmemList() {
        let userId =  wx.getStorageSync('user').id;

        wx.request({
            url: app.serverUrl + '/mem/getByUserId/' + userId + '/' + this.data.page + '/' + this.data.depth,
            success: (result) => {
                this.setData({
                    memList: result.data.data.list,
                    count: result.data.data.count
                })
            }
        });
    },

    getlovedmemList() {
        let userId =  wx.getStorageSync('user').id;
        wx.request({
            url: app.serverUrl + '/mem/loved/getByUserId/' + userId + '/' + this.data.lovedPage + '/' + this.data.depth,
            success: (result) => {
                this.setData({
                    lovedMemList: result.data.data.list,
                    lovedCount: result.data.data.count
                })
            }
        });
    },
    appendmemList() {
        let userId =  wx.getStorageSync('user').id;
        if (this.data.memList.length >= this.data.count) {
            this.setData({
                nomore: true
            })
            return
        }
        this.data.page++;
        wx.request({
            url: app.serverUrl + '/mem/getByUserId/' + userId + '/' + this.data.page + '/' + this.data.depth,
            success: (result) => {
                this.setData({
                    memList: [...this.data.memList, ...result.data.data.list]
                })
            }
        });
    },
    appendLovedmemList() {
        let userId =  wx.getStorageSync('user').id;
        if (this.data.lovedMemList.length >= this.data.lovedCount) {
            this.setData({
                nomoreloved: true
            })
            return
        }
        this.data.lovedPage++;
        wx.request({
            url: app.serverUrl + '/mem/loved/getByUserId/' + userId + '/' + this.data.lovedPage + '/' + this.data.orderType,
            success: (result) => {
                this.setData({
                    lovedMemList: [...this.data.lovedMemList, ...result.data.data.list]
                })
            }
        });
    },
    changeTab: function (e) {
        this.setData({
            item: e.detail.current
        })
    },
    changetab: function (e) {
        this.setData({
            item: e.target.dataset.item
        })
    },
    bindDepthChange: function (e) {
        console.log(e.detail.value);
        this.setData({
            page: 0,
            depth: e.detail.value
        })
        this.getmemList()
    },
    turnToEditUser() {
        this.getUserProfile()
    },
    getUserProfile: function (res) {
        wx.getUserProfile({
            desc: '用于微信账号与平台账号绑定', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                console.log("获取到的用户信息成功: ", JSON.stringify(res));
                //更新用户信息
                let userFrom = wx.getStorageSync('user')
                let userobj = JSON.parse(res.rawData);
                console.log(res.rawData)
                let userTo = {
                    'avatar':userobj.avatarUrl,
                    'id':userFrom.id,
                    'introduce':userFrom.introduce,
                    'limitDepth':userFrom.limitDepth,
                    'lovedNum':userFrom.lovedNum,
                    'name':userobj.nickName,
                    'sex':userFrom.sex,
                    'wxId':userFrom.wxId,
                    'curExp':userFrom.curExp,
                    'level':userFrom.level
                }
                wx.setStorageSync('user', userTo)
                wx.navigateTo({
                    url: '../editUser/editUser',
                })
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
                            console.log('用户点击了“返回授权”');
                        }
                    }
                });
            }
        })
    },
    //删除记忆
    delMem(e) {
        let that = this;
        let id = e.currentTarget.dataset.index;
        console.log(e)
        wx.showModal({
            title: '删除这条回忆',
            content: '注意！此操作不可逆',
            cancelText: '取消',
            confirmText: '确定',
            success(res) {
              if (res.confirm) {
                that.data.memList.splice(id,1)
                that.setData({
                    memList:that.data.memList
                })
                wx.request({
                    url: app.serverUrl + '/mem/del/'+e.currentTarget.dataset.mid,
                    success: (result) => {

                    }
                });
                
              } else if (res.cancel) {
                wx.showModal({
                    content: '记忆中记得最牢的事情，就是一心要忘却的事情。',
                    confirmText: '谢谢',
                    showCancel:false
                })
              }
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
        this.refreshUser()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        // this.setData({
        //     page: 0,
        //     lovedPage: 0
        // })
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        this.setData({
            page: 0,
            lovedPage: 0
        })
        this.getmemList();
        this.getlovedmemList();
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        wx.showToast({
            title:'加载中....',
            icon:'loading'
        });
        this.setData({
            page: 0,
            lovedPage: 0
        })
        let userId =  wx.getStorageSync('user').id;
        wx.request({
            url: app.serverUrl + '/user/get/' + userId,
            success: (result) => {
                wx.setStorageSync('user', result.data.data)
                this.setData({
                    user : wx.getStorageSync('user')
                })
            }
          });
          this.getmemList()
          this.getlovedmemList()
          this.setLevelColor()
          this.setNeed()
          this.setpercent()
          wx.hideToast({
            success: (res) => {},
          })
          wx.stopPullDownRefresh();
    },
    //获取升级所需经验
    setNeed(){
        let level  =  wx.getStorageSync('user').level;
        let cur  =  wx.getStorageSync('user').curExp;
        let per = cur/this.data.needExp*100;
        wx.request({
            url: app.serverUrl + '/lv/exp/get/need/' + level,
            success: (result) => {
                let per = cur/result.data.data*100;
                this.setData({
                    needExp : result.data.data,
                    propercent:per
                })

            }
          });
    },
    //获取进度条
    setpercent(){
        let cur  =  wx.getStorageSync('user').curExp;
        let per = cur/this.data.needExp*100;
        this.setData({
            propercent:per
        })
    },

    setLevelColor(){
      let level =   this.data.user.level
      if (level==1) {
        this.setData({
            levelColor:'rgb(127,255,0)'
        })
    }else if(level==2){
        this.setData({
            levelColor:'rgb(255,127,80)'
        })
    }else if(level==3){
        this.setData({
            levelColor:'rgb(0,255,255)'
        })
    }else if(level==4){
        this.setData({
            levelColor:'rgb(255,140,0)'
        })
    }else if(level==5){
        this.setData({
            levelColor:'rgb(255,20,147)'
        })
    }else if(level==6){
        this.setData({
            levelColor:'rgb(125, 250, 9)'
        })
    }else if(level==7){
        this.setData({
            levelColor:'rgb(30,144,255)'
        })
    }else if(level==8){
        this.setData({
            levelColor:'rgb(125, 250, 9)'
        })
    }else if(level==9){
        this.setData({
            levelColor:'rgb(255,0,255)'
        })
    }else if(level==10){
        this.setData({
            levelColor:'rgb(75,0,130)'
        })
    }else if(level==11){
        this.setData({
            levelColor:'rgb(240,128,128)'
        })
    }else if(level==12){
        this.setData({
            levelColor:'rgb(128,0,0)'
        })
    }else if(level==13){
        this.setData({
            levelColor:'rgb(65,105,225)'
        })
    }else if(level==14){
        this.setData({
            levelColor:'rgb(106,90,205)'
        })
    }else if(level==15){
        this.setData({
            levelColor:'rgb(47,79,79)'
        })
    }else if(level==16){
        this.setData({
            levelColor:'rgb(255,20,147)'
        })
    }else if(level==17){
        this.setData({
            levelColor:'rgb(148,0,211)'
        })
    }else if(level==18){
        this.setData({
            levelColor:'rgb(255,215,0)'
        })
    }else if(level==19){
        this.setData({
            levelColor:'rgb(255,69,0)'
        })
    }else if(level==20){
        this.setData({
            levelColor:'rgb(255,0,0)'
        })
    }

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})