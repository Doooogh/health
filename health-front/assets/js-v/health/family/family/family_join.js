
var vm = new Vue({
	el: '#app',

	data:{
		pd: [],						//存放字段参数
		FAMILY_ID:'',
		hasFamily:false,   //是否查询到家庭组
		familyInfo:[],  //家庭组信息
		joinStatus:false,   //是否已经加入到该家庭组
    },

	methods: {

        //初始执行
        init() {
       
        },

        //去加入
    	joinFamily: function (){
			vm.hadJoin();
			if(vm.joinStatus){
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
					url: httpurl+'familyuser/joinFamily',
					async: false,
			    	data: {
						FAMILY_ID:this.FAMILY_ID,
						tm:new Date().getTime(),
						},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	swal("", "加入成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("家人群组添加",data.exception);//显示异常
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
		
		//判断是否已经加入
		hadJoin: function (){
			
		    //发送 post 请求提交保存
		    $.ajax({
		        	xhrFields: {
		                withCredentials: true
		            },
					type: "POST",
					url: httpurl+'familyuser/hadJoin',
					async: false,
			    	data: {
						FAMILY_ID:this.FAMILY_ID,
						tm:new Date().getTime(),
						},
					dataType:"json",
					success: function(data){
		                if("success" == data.result){
							if(data.joinStatusRes){
								swal("", "您已经在改家庭组!", "warning");
								vm.joinStatus=true;
							}else{
								vm.joinStatus=false;
							}
		                }else if ("exception" == data.result){
		                	showException("家人群组添加",data.exception);//显示异常
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
    	getInfo: function(){
			
			if(this.FAMILY_ID == '' || this.FAMILY_ID == undefined){
				$("#FAMILY_ID").tips({
					side:3,
			        msg:'请输入家庭组ID',
			        bg:'#AE81FF',
			        time:2
			    });
				this.FAMILY_ID = '';
				this.$refs.FAMILY_ID.focus();
			return false;
			}
			
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'family/getInfo',
		    	data: {
					FAMILY_ID:this.FAMILY_ID,
					tm:new Date().getTime()
					},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
						vm.hasFamily=true;
                     	vm.familyInfo = data.familyInfo;	
                     }else if ("exception" == data.result){
                     	showException("家人群组查找",data.exception);	//显示异常
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
