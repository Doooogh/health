
var vm = new Vue({
	el: '#app',

	data:{
HEALTHINFO_ID: '',	//主键ID
		pd: [],						//存放字段参数
		msg:'add',
		USER_ID:'',
    },

	methods: {

        //初始执行
        init() {
        	var FID = this.getUrlKey('FID');	//当接收过来的FID不为null时,表示此页面是修改进来的
			var U_ID = this.getUrlKey('USER_ID');  //如果不为NULL user_id 为 替别人添加数据 user_id 为别人的user_id
			if(null!=U_ID){
				this.USER_ID=U_ID
			}
        	if(null != FID){
        		this.msg = 'edit';
        		this.HEALTHINFO_ID = FID;
        		this.getData();
        	}
        	setTimeout(function(){
        		vm.getDict();
            },200);
        },

        //去保存
    	save: function (){

			if(this.pd.STEP_NUMBER == '' || this.pd.STEP_NUMBER == undefined){
				$("#STEP_NUMBER").tips({
					side:3,
		            msg:'请输入步数',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.STEP_NUMBER = '';
				this.$refs.STEP_NUMBER.focus();
			return false;
			}
			if(this.pd.HEART_RATE == '' || this.pd.HEART_RATE == undefined){
				$("#HEART_RATE").tips({
					side:3,
		            msg:'请输入心率',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.HEART_RATE = '';
				this.$refs.HEART_RATE.focus();
			return false;
			}
			if(this.pd.WEIGHT == '' || this.pd.WEIGHT == undefined){
				$("#WEIGHT").tips({
					side:3,
		            msg:'请输入体重',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.WEIGHT = '';
				this.$refs.WEIGHT.focus();
			return false;
			}
			if(this.pd.BLOOD_PRESSURE == '' || this.pd.BLOOD_PRESSURE == undefined){
				$("#BLOOD_PRESSURE").tips({
					side:3,
		            msg:'请输入血压',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.BLOOD_PRESSURE = '';
				this.$refs.BLOOD_PRESSURE.focus();
			return false;
			}
			if(this.pd.SLEEP_TIME == '' || this.pd.SLEEP_TIME == undefined){
				$("#SLEEP_TIME").tips({
					side:3,
		            msg:'请输入睡眠时长',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.SLEEP_TIME = '';
				this.$refs.SLEEP_TIME.focus();
			return false;
			}
			this.pd.OTHER_INFO = $("#OTHER_INFO").val();
			if(this.pd.OTHER_INFO == '' || this.pd.OTHER_INFO == undefined){
				$("#OTHER_INFO").tips({
					side:3,
		            msg:'请输入其他信息',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.OTHER_INFO = '';
				this.$refs.OTHER_INFO.focus();
			return false;
			}

    		$("#showform").hide();
    		$("#jiazai").show();

            //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'healthinfo/'+this.msg,
			    	data: {
							USER_ID:this.USER_ID,
							HEALTHINFO_ID:this.HEALTHINFO_ID,
							STEP_NUMBER:this.pd.STEP_NUMBER,
							HEART_RATE:this.pd.HEART_RATE,
							WEIGHT:this.pd.WEIGHT,
							BLOOD_PRESSURE:this.pd.BLOOD_PRESSURE,
							SLEEP_TIME:this.pd.SLEEP_TIME,
							OTHER_INFO:this.pd.OTHER_INFO,
							tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("健康数据",data.exception);//显示异常
                        	$("#showform").show();
                    		$("#jiazai").hide();
                        }
                    }
				}).done().fail(function(){
                   swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                   $("#showform").show();
           		   $("#jiazai").hide();
                });
    	},

    	//根据主键ID获取数据
    	getData: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'healthinfo/goEdit',
		    	data: {HEALTHINFO_ID:this.HEALTHINFO_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
						$("#CREATE_DATE").val(data.pd.CREATE_DATE);
                     }else if ("exception" == data.result){
                     	showException("健康数据",data.exception);	//显示异常
                     	$("#showform").show();
                 		$("#jiazai").hide();
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                  $("#showform").show();
          		  $("#jiazai").hide();
               });
    	},

    	//获取数据字典数据
  	//获取数据字典数据
		getDict: function (){
		},

    	//根据url参数名称获取参数值
        getUrlKey: function (name) {
            return decodeURIComponent(
                (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
        }

	},

	mounted(){
        this.init();
    }
})
