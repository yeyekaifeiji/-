// pages/user/user.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    online:'',
    auth_info:'',
    create_time:'',
    last_ct:'',
  },

  Logout:function(){
    wx.removeStorageSync('phoneStorage')
    wx.removeStorageSync('passwordStorage')
    wx.showToast({
      title: '退出登录成功',
      icon: 'none',
      duration: 1500
    });
    app.globalData.g_isLogin = false,
    app.globalData.g_phone = '',
    app.globalData.g_password = ''
    wx.reLaunch({
      url: '../login/login',
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
          that.setData({ 
            online : res.data.data.online,
            auth_info:res.data.data.auth_info,
            create_time:res.data.data.create_time,
            //end_ct:res.data.data.end,
            last_ct:res.data.data.last_ct
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