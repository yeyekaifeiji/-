var app = getApp();
Page({
  data: {
    phone: '',
    password: '',
    isLogin:app.globalData.g_isLogin
  },

  // 获取输入账号 
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 登录 
  login: function () {
    if (this.data.phone.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '用户名和密码不能为空',
        icon: 'none',
        duration: 1500
      })
    } else {
      // 这里修改成跳转的页面 
      wx.showToast({
        title: '登录成功',
        icon: 'none',
        duration: 1500
      })
    }
  },

  //登录OneNET
  loginOneNET: function(){
    var that = this; //this不可以直接在wxAPI函数内部使用 var为全局变量
    if (this.data.phone.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '用户名和密码不能为空',
        icon: 'none',
        duration: 1500
      })
    }
    wx.request({
      url: 'http://api.heclouds.com/devices/' + that.data.phone,
      header:{
        'api-key': that.data.password
      },
      method:'get',
      
      success: function (res) {
        console.log(res)
        console.log(res.data.errno)   //打印错误条数
        if(res.data.errno==0){
          wx.setStorage({
            key:"phoneStorage",
            data:that.data.phone
          });
          wx.setStorage({
            key:"passwordStorage",
            data:that.data.password,
            success:function(){
              console.log("密码缓存成功")
            }
          });
          // that.setData({ 
          //   isLogin: true ,
          //   online : 
          // })
          app.globalData.g_online = res.data.data.online
          app.globalData.g_isLogin = true,
          app.globalData.g_phone = that.data.phone,
          app.globalData.g_password = that.data.password,
          console.log(app.globalData.g_isLogin)
          wx.showToast({
            title: '登录成功',
            icon: 'none',
            duration: 1500
          });
           wx.reLaunch({
            url: '../shouye/shouye',
          });
        }
        else{
          wx.showToast({
            title:res.data.error,
            icon:'none',
            duration:1500
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
  }
}) 