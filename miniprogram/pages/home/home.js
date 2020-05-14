// miniprogram/pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //时间  年 月
       time: {
         year:'',
         month:'',
         day:'',
         week:''
       },
      //  星期数组
       weeklist :['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
       //选择日期范围
       dataRange:{
        //  开始时间
        start:'',
        // 结束时间
        end:''
       },

       //标签数据
       tabData:[
        {
          title:'所有',
          type:'all',
          isActive: true
        },
        {
          title:'收入',
          type:'shouru',
          isActive: false
        },
        {
          title:'支出',
          type:'zhichu',
          isActive: false
        },
       ],

      //  选中  所有  收入 支出
      select_active: 0 ,
      //  当天收入和支出
       total_sum:{
        add_sum:'',
        res_sum:''
       },

       //当月 所有收入 支出  结余
       month_total:{
         month_add:'',
         month_res:'',
         month_jieyu:''
       },

       //账单数据
       titData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.getList();
    this.setDate();
    this.dateTime();
  },
  // 点击切换时间
  bindDateChange(e){
    let ggg = []
    console.log('demo2',e.detail.value.split('-'))
    let  ss = new Date(e.detail.value).getDay();
    console.log(this.data.weeklist)
    let mont = e.detail.value.split('-')[1];
    console.log(mont,'=============================>当前月份')
    wx.showLoading({
      title: '加载中',
    })

    // 调用云函数[get_list]  获取存储数据
    wx.cloud.callFunction({
      // 云函数名称
      name:'get_list',
      // 参数
      data:{},
      // 请求成功执行
      success: res =>{
        wx.hideLoading();
        console.log('[云函数]  [get_list]  res ==>',res);
        //符合当前条件的数组
        let suitable =[];
        let mont_suitable =[];
        //计算符合当日的数组
        for(let i = 0 ; i < res.result.data.length ; i++){
           
          if(res.result.data[i].time == e.detail.value){
            console.log(res.result.data[i]);
            suitable.push(res.result.data[i]);
          }
          
          if(res.result.data[i].time.split('-')[0] == e.detail.value.split('-')[0]){
            if(res.result.data[i].time.split('-')[1] == mont){
              mont_suitable.push(res.result.data[i]);
            }
          }
        }
        console.log(mont_suitable,'=============================ch=skjdfhksjdhf');
        let res_sum = 0;
        let add_sum =0;
        // 符合当日的
        for(let j = 0; j < suitable.length ; j++){
          console.log(suitable[j].const_type)
          if(suitable[j].const_type == 'zhichu'){
            res_sum += parseInt(suitable[j].money) ;
          }else{
            add_sum += parseInt(suitable[j].money);
          }
        }
        
        let mont_res_sum = 0;
        let mont_add_sum =0;
       for(let j = 0; j < mont_suitable.length ; j++){
        console.log(mont_suitable[j].const_type)
       if(mont_suitable[j].const_type == 'zhichu'){
        mont_res_sum += parseInt(mont_suitable[j].money) ;
       }else{
        mont_add_sum += parseInt(mont_suitable[j].money);
       }
     }
       //计算符合当月的
        console.log(mont_suitable,'===============================》当月的');
        this.setData({
          titData:suitable,
          total_sum:{add_sum,res_sum},
          month_total:{
            month_add:mont_add_sum,
            month_res:mont_res_sum,
            month_jieyu:mont_add_sum-mont_res_sum
          }
        })
      },
      //请求失败执行
      fail: err => {
        wx.hideLoading()
        console.error('[云函数] [get_list] 调用失败 err ==> ', err);
      }
    })
    ggg = e.detail.value.split('-')

    this.setData({
      time:{
        year:parseInt(ggg[0]),
        month:parseInt(ggg[1]),
        day:parseInt(ggg[2]),
        week:this.data.weeklist[ss]
      }
    })
  },
  //切换标签
  select_box:function(event){
    console.log(event.currentTarget.dataset)
    let byselect = event.currentTarget.dataset.datas;
    let byindex = event.currentTarget.dataset.index;
    console.log(byindex)
    for( let i = 0 ; i < byselect.length ; i++){
      console.log(byselect[i]);
      if(byselect[i].isActive){
        byselect[i].isActive = false;
        break;
      }
    }
    byselect[byindex].isActive = true;
    console.log(byselect);
    this.setData({
      tabData:byselect,
      select_active:byindex
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
  // 获取时间
  dateTime(){
    let date = new Date();
    let weeks = this.data.weeklist;
    this.setData({
       time:{
         year:date.getFullYear(),
         month:date.getMonth() +1,
         day:date.getDate(),
         week:weeks[date.getDay()]
       }
    })
    console.log(this.data.time);
  },

  // 获取存储数据
  getList(){
    console.log('获取存储数据');
    let new_year = new Date().getFullYear();
    let new_month = new Date().getMonth() +1;
    let new_day = new Date().getDate();
    console.log(new_year)
    wx.showLoading({
      title: '加载中',
    })

    // 调用云函数[get_list]  获取存储数据
    wx.cloud.callFunction({
      // 云函数名称
      name:'get_list',
      // 参数
      data:{},

      // 请求成功执行
      success: res =>{
        wx.hideLoading();
        console.log('[云函数]  [get_list]  res ==>',res);
        let arr =[];
        for(let i = 0; i< res.result.data.length ; i++){
          if(res.result.data[i].time.split('-')[0] == new_year){
            if(res.result.data[i].time.split('-')[1] == new_month){
              if(res.result.data[i].time.split('-')[2] == new_day){
                arr.push(res.result.data[i]);
              }
            }
          }
        }
        let add_sum = 0;
        let res_sum = 0;
        console.log(arr,'=============================>中深刻的减肥');
        for(let k =0 ; k <arr.length; k++){
          if(arr[k].const_type == 'shouru'){
            add_sum += parseInt(arr[k].money);
          }else{
            res_sum += parseInt(arr[k].money);
          }
        }
        this.setData({
          titData:arr,
          total_sum:{add_sum,res_sum}
        })
      this.get_total(res);
      },
      //请求失败执行
      fail: err => {
        wx.hideLoading()
        console.error('[云函数] [get_list] 调用失败 err ==> ', err);
      }
    })
  },

  //获取总收入 总支出
  get_total(res){
    console.log('获取总收入 和总支出 ',res);
    console.log(res.result.data.length);
    let list = res.result.data;
    // 总收入
    let add_sum = 0;
    // 总支出
    let res_sum = 0;

    
    let new_year = new Date().getFullYear();
    let new_month = new Date().getMonth() +1;

     for(let i = 0; i < list.length ; i++){
      if(list[i].time.split('-')[0] == new_year){
        if(list[i].time.split('-')[1] == new_month){
          console.log(list[i].time)
          if(list[i].const_type == 'zhichu'){
            res_sum += parseInt(list[i].money) ;
          }else{
            add_sum += parseInt(list[i].money);
          }
        }
      }

      
    }
    console.log(add_sum);
    console.log(res_sum);
    this.setData({
      month_total:{
        month_add:add_sum,
        month_res:res_sum,
        month_jieyu:add_sum - res_sum
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getList();
     this.setDate();
     this.dateTime();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

})