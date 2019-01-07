//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    mapcontext:{},
    dwidth:0,
    dheight:0,
    log: 0,
    lat: 0,
    controls:[],
    markers:[
      {
        iconPath: '/pics/bike.png',
        width: 40,
        height: 40,
        longitude: 113.32999,
        latitude: 23.099999
      },
      {
        iconPath: '/pics/bike.png',
        width: 40,
        height: 40,
        longitude: 113.32999,
        latitude: 23.092599
      },
    ],
    marker:{
      iconPath:'/pics/bike.png',
      width:40,
      height:40,
      longitude: 110.32452,
      latitude: 20.099994
    }
  },
  
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: (res) => { that.setData({
        dwidth:res.screenWidth,
        dheight:res.screenHeight,
        controls: [
          { id: 1, iconPath: '/pics/open.png', position: { width: 50, height: 50, left: res.screenWidth -202, top: res.screenHeight-160},clickable:true },
          { id: 2, iconPath: '/pics/target.png', position: { width: 25, height: 25, left: res.screenWidth - 352, top: res.screenHeight - 150 }, clickable: true },
          { id: 3, iconPath: '/pics/pin.png', position: { width: 25, height: 25, left: res.screenWidth/2 - 15, top: res.screenHeight/2 - 55 }, clickable: false },
          { id: 4, iconPath: '/pics/add.png', position: { width: 35, height: 35, left:  15, top:  15 }, clickable: true },
        ]
      }) },
    })
    wx.getLocation({
     success: function(res) {
       that.setData({
         log: res.longitude,
         lat: res.latitude
       });
     },
   });
 
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
//controls tap事件
  controltap: function(e){
    console.log(e.controlId);
    var id = e.controlId;
    if(id==2){
      this.mapcontext.moveToLocation();
    }
    if(id==4){
      var marker = this.data.marker;
      marker.longitude = this.data.log;
      marker.latitude = this.data.lat;
      var bikes = this.data.markers;
      // bikes.push(marker);
      // this.setData({
      //   markers:bikes
      // })
      wx.request({
        url: 'http://localhost:8080/add_bike',
        data:{
          longitude: this.data.log,
          latitude: this.data.lat,
        },
        method:'POST',
        success:function(res){
          console.log(res);
        }
      })
      
    }
  },

  onReady(){
    this.mapcontext = wx.createMapContext('mymap', this);
  },

  regionChange:function(e){
    if(e.type=='end'){
      this.mapcontext.getCenterLocation({
        success: (res)=>{
          this.setData({
            log: res.longitude,
            lat: res.latitude
          });
        }
      })
    }
  }
})
