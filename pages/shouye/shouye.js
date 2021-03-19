// pages/shouye/shouye.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:'',
    device_ID:'',
    online:'',
    ambienTem:'',
    ambienHum:'',
    sunlight:'',
    soil_Hum_Volt:'',
    switch4Checked:false,
    switch1Checked: false,
    switch2Checked: false,
    switch3Checked: false,
    title1:'登录成功',
    title2:'自动刷新成功',
    title3:'下拉刷新成功',
  },

/**
 * 命令下发方法
 * 参数e switch组件需要
 * 参数wu 下发的物体
 * 对应4个变量 自动模式 led灯、风扇、水泵
 */
  cmd : function (e,wu){
    var that = this; //this不可以直接在wxAPI函数内部使用 var为全局变量
    var switchStatus;
    if (e.detail.value == true){
      var num1 = 1;
    } else {num1 = 0};
    
    wx.request({
      url: 'http://api.heclouds.com/cmds?device_id=' + app.globalData.g_phone,
      header: {
        'api-key': app.globalData.g_password
      },
      data: wu + ':' + num1,
      method: "POST",
      success: function (res) {
        if(res.data.errno==0){
          console.log(res),
          wx.showToast({
            title: '下发命令成功',
            icon: 'none',
            duration: 1500
          });
        }
        else{
          if (wu == 'key1'){
            that.setData({
              switch4Checked: false,
            });
          }
          else if (wu == 'key2'){
            that.setData({
              switch1Checked: false,
            });
          }
          else if(wu == 'key4'){
            //console.log('fengshan');
            that.setData({
              switch2Checked: false,
            });
          }
          else if(wu == 'key3'){
            that.setData({
              switch3Checked: false,
            });
          }
          wx.showToast({
            title: res.data.error,
            icon: 'none',
            duration: 1500
          });
        }
      },
      fail(res) {
        console.log("请求失败", res)
        // deviceConnected = false
      }
    })
  },
  /** 
  开关事件函数
  分别传入moshi led、fengshan、shuibeng 4个参数
  发送给下位机
  发送格式：
  led:1 //点亮LED
  **/
 switch4Change: function (e){
  this.cmd(e,'key1');
},
  switch1Change: function (e){
    this.cmd(e,'key2');
  },
  switch2Change: function (e){
    this.cmd(e,'key4');
  },
  switch3Change: function (e){
    this.cmd(e,'key3');
  },

  /**
   * 获取数据函数
   * 参数t为打印数据
   * 可以获取是否在线以及其他传感器数据
   **/
  getData:function(t){
    var that = this;
    wx.request({
      url: 'http://api.heclouds.com/devices/' + app.globalData.g_phone,
      header: {
        'api-key': app.globalData.g_password
      },
      method: 'get',
      success: function (res) {
        if(res.data.errno==0){
          console.log(res),
          app.globalData.g_isLogin = true,
          app.globalData.g_online = res.data.data.online,
          that.setData({ 
            isLogin: true ,
            online : res.data.data.online
          })
          wx.showToast({
            title: t,
            icon: 'none',
            duration: 1000
          })
        }
      },
      fail(res) {
        console.log("请求失败", res)
        wx.showToast({
          title: '设备ID或API-key错误，请联系经销商',
          icon: 'none',
          duration: 1500
        })
      }
    })
    wx.request({
      url: 'http://api.heclouds.com/devices/'+ app.globalData.g_phone+'/datastreams',
      header: {
        'api-key': app.globalData.g_password
      },
      method:"GET",
      success: function (res) {
        console.log(res.data)
        that.setData({ 
          ambienTem: res.data.data[2].current_value,
          ambienHum: res.data.data[3].current_value,
          sunlight: res.data.data[1].current_value,
          soil_Hum_Volt: res.data.data[4].current_value,
          CO2: res.data.data[0].current_value
        })
      },
      fail(res) {
        console.log("请求失败",res)
        // deviceConnected = false
      }
    })
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    var that = this
    that.setData({
      isLogin: app.globalData.g_isLogin,
      device_ID:app.globalData.g_phone
    });
    wx.getStorage({
      key: 'phoneStorage',
      success: function(res) {
        app.globalData.g_phone = res.data
        //that.data.device_ID = res.data
        console.log("获取缓存成功",res.data)
      },
      fail: function(res) {console.log("获取缓存失败")},
    })
    wx.getStorage({
      key: 'passwordStorage',
      success: function(res) {
        app.globalData.g_password = res.data
        console.log("获取缓存成功",res.data)
      },
      fail: function(res) {console.log("获取缓存失败")},
    })
    
    setInterval(function () {
      if (that.data.online == true && app.globalData.g_phone.length>0){   //判断设备在线再请求更新数据
        that.getData(that.data.title2);
        //console.log("轮播请求1秒触发一次");
      }else{
        console.log("设备不在线或者其他错误")
      }
    }, 20000)    //代表20秒钟发送一次请求
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    /**
     * 加入了自动刷新功能，无需一下代码更新数据
     */
    if (that.data.isLogin = true && that.data.device_ID.length>0){
      that.getData(that.data.title1);
    }
    else{
      console.log("密码为空")
      console.log(that.data.isLogin,app.globalData.g_phone.length)
    }
    console.log("OnReady在运行")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    that.setData({
      isLogin: app.globalData.g_isLogin,
      device_ID : wx.getStorageSync('phoneStorage'),
      online : app.globalData.g_online,
    });
    console.log("onshow在运行")
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
    var that = this;
    that.getData(that.data.title3);
    wx.stopPullDownRefresh();
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