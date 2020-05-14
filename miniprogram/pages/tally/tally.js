// miniprogram/pages/tally/tally.js
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    // 账单类型
    img_type:[],
    // 方式类型
    xuanze:[
      {tit:'支付宝',bool:false},
      {tit:'微信',bool:false},
      {tit:'信用卡',bool:false},
      {tit:'储蓄卡',bool:false},
      {tit:'现金',bool:false},
    ],
    getInfo:{
      time:'选择记账日期',
      money:0,
      text:''
    },
     //选择日期范围
     dataRange:{
      //  开始时间
      start:'',
      // 结束时间
      end:''
     },

    //  选择收入支出
    select:[
      {tit:'收入',type:'shouru',bool:true},
      {tit:'支出',type:'zhichu',bool:false}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     wx.showLoading({
      title: '加载中',
    });
    // 调用时间
    this.setDate();
    // 调用云函数
     wx.cloud.callFunction({
      //  调用云函数名称
      name: 'get_img_type',
      data: {},
      success: res => {
        wx.hideLoading();
        console.log('[云函数] [res] 调用成功: ', res)
        console.log(res.result.data)
        this.setData({
          img_type:res.result.data
        })
        console.log(this.data.img_type)
      },
      fail: err => {
        wx.hideLoading();
        console.error('[云函数] [res] 调用失败', err)
      }
    })

  },
  // 选择类型
  select_type(e){
    console.log(e);
    let demo = e.currentTarget.dataset.demo;
    let index = e.currentTarget.dataset.index;
    console.log('e.currentTarget.dataset.demo',demo)
     for(let i = 0 ; i < demo.length ; i++){
       if(demo[i].bool){
       demo[i].bool = false;
       break;
       }
     }
    demo[index].bool = true;
    this.setData({
      img_type:demo
    })
  },
  // 账户选择
  select_xuanze(e){
    console.log(e)
    let list = e.currentTarget.dataset.list;
    let index = e.currentTarget.dataset.index;
    for(let i = 0 ; i < list.length ; i++){
      if(list[i].bool){
        list[i].bool = false;
        break;
      }
    }
    list[index].bool  = true;
    this.setData({
      xuanze:list
    })
  },
  // 选择收入支出
  by_select(e){
    console.log(e)
    let select_list = e.currentTarget.dataset.by_list;
    let index = e.currentTarget.dataset.index;
    console.log(select_list[index]);
    console.log(index)
     for(let i = 0; i < select_list.length ; i++){
       if(select_list[i].bool){
         select_list[i].bool = false;
       }
     }
     select_list[index].bool = true;
     this.setData({
       select:select_list
     })
  },

   //设置日期
   setDate(){
    let date = new Date().toLocaleDateString().split('/');
    console.log(date);
    let month = date[1] >= 10 ? date[1] : '0'+date[1];
    let day = date[2] >= 10 ? date[2] : '0'+daet[2];

    console.log(month,day)
    let start = date[0]-1 + '-' + month + '-' + day;
    let end = parseInt(date[0])+1 + '-' + month + '-' + day;
    console.log(start,end);
    this.setData({
      dataRange:{
        start,
        end
      }
    })
  },
  // 时间改变
  bindDateChange(e){
    this.data.getInfo[e.currentTarget.dataset.title] = e.detail.value;
    this.setData({
      getInfo:this.data.getInfo
    })
    console.log(this.data.getInfo)
    // this.data.getInfo
    // console.log(a)
  },


  // 提交数据
  save_data(){
    // 数据类型
    let data = {};
    console.log(this.data.select,'保存');
    // 获取收入类型或者支出类型
    for(let i = 0 ; i< this.data.select.length; i++){
      if(this.data.select[i].bool){
        data.const = this.data.select[i].tit;
        data.const_type = this.data.select[i].type;
        break;
      }
    }

    // 获取账单类型
    let isSelect = false;
    let tit_text = '';
    for(let j = 0 ; j <this.data.img_type.length; j++){
      if(this.data.img_type[j].bool){
        data.img_title =this.data.img_type[j].title;
        data.icon_url = this.data.img_type[j].icon_url;
        data.img_type = this.data.img_type[j].type;
        data.img_id = this.data.img_type[j]._id;
        isSelect = true;
        tit_text = this.data.img_type[j].title;
        break;
      }
    }
    if(!isSelect){
      wx.showToast({
        title: '请选择账单类型',
        icon: 'none',
        duration: 2000,
        mask:true
      });
      return;
    }
    let isSelect2 = false;
    // 获取方式类型
    for(let k = 0; k <this.data.xuanze.length ; k++){
      if(this.data.xuanze[k].bool){
        data.xuanze_type = this.data.xuanze[k].tit;
        isSelect2 = true;
        break;
      }
    }
    if(!isSelect2){
      wx.showToast({
        title: '请选择支付方式',
        icon: 'none',
        duration: 2000,
        mask:true
      });
      return;
    }

    // 获取输入的内容

      // 获取输入账单日期
    data.time  =  this.data.getInfo.time ;
    if(data.time == '选择记账日期'){
      wx.showToast({
        title: '选择记账日期',
        icon: 'none',
        duration: 2000,
        mask:true
      })
      return;
    }
    // 获取输入账单的金额
    data.money = this.data.getInfo.money;
    if(data.money == 0){
      wx.showToast({
        title: '请输入账单金额',
        icon: 'none',
        duration: 2000,
        mask:true
      })
      return;
    }
    // 获取输入账单备注
    if(this.data.getInfo.text == ''){
      this.data.getInfo.text = tit_text;
    }
    data.text = this.data.getInfo.text;


     // 调用云函数

     wx.showLoading({
      title: '加载中',
    });
     wx.cloud.callFunction({
      //  调用云函数名称
      name: 'add_list',
      data,
      success: res => {
        wx.hideLoading();
        console.log('[云函数] [res] 调用成功: ', res)
      },
      fail: err => {
        wx.hideLoading();
        console.error('[云函数] [res] 调用失败', err)
      }
    })
    
    console.log('data ===>',data)
  },

   //获取用户授权信息
   getUserInfo: function (res) {
     console.log('res ==> ', res);

    if (res.detial) {
      this.globalData.isAuth = true;
      this.setData({
        isAuth: true
      })
    }
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

 

})