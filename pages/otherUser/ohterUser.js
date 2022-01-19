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
        depths: [],
        depth: 0,
        levelColor:'',
        needExp:1,
        propercent:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setUser(options.userId);
    },

    setUser(userId) {
        wx.request({
            url: app.serverUrl + '/user/get/'+userId,
            success: (result) => {
                this.setData({
                    user: result.data.data
                })
                this.getmemList();
                this.getlovedmemList();
                this.setLevelColor();
                this.setdepth()
            }
        });
    },
    memdetail: function (e) {
        wx.navigateTo({
            url: '../mem/mem?id=' + e.currentTarget.dataset.id,
        })
    },
    getmemList() {
        wx.request({
            url: app.serverUrl + '/mem/getByUserId/' + this.data.user.id + '/' + this.data.page + '/' + this.data.depth,
            success: (result) => {
                this.setData({
                    memList: result.data.data.list,
                    count: result.data.data.count
                })
            }
        });
    },

    getlovedmemList() {
        wx.request({
            url: app.serverUrl + '/mem/loved/getByUserId/' + this.data.user.id + '/' + this.data.lovedPage + '/' + this.data.depth,
            success: (result) => {
                this.setData({
                    lovedMemList: result.data.data.list,
                    lovedCount: result.data.data.count
                })
            }
        });
    },
    appendmemList() {
        if (this.data.memList.length >= this.data.count) {
            this.setData({
                nomore: true
            })
            return
        }
        this.data.page++;
        wx.request({
            url: app.serverUrl + '/mem/getByUserId/' + this.data.user.id + '/' + this.data.page + '/' + this.data.depth,
            success: (result) => {
                this.setData({
                    memList: [...this.data.memList, ...result.data.data.list]
                })
            }
        });
    },
    appendLovedmemList() {
        if (this.data.lovedMemList.length >= this.data.lovedCount) {
            this.setData({
                nomoreloved: true
            })
            return
        }
        this.data.lovedPage++;
        wx.request({
            url: app.serverUrl + '/mem/loved/getByUserId/' + this.data.user.id + '/' + this.data.lovedPage + '/' + this.data.orderType,
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
    setdepth(){
        let limit = this.data.user.limitDepth;
        let depthstmp = [];
        while(limit>=0){
        depthstmp.push(limit);
          limit--;
        }
        depthstmp =  depthstmp.reverse();
        this.setData({
            depths:depthstmp
        })
    },
    turnToEditUser() {
        this.getUserProfile()
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
        // this.setUser();
        // this.getmemList();
        // this.getlovedmemList();
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
                this.setUser();
        this.getmemList();
        this.getlovedmemList();
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