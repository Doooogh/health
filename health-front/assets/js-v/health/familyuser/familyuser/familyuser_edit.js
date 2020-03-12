
var vm = new Vue({
	el: '#app',

	data:{
		FAMILYUSER_ID: '',	//主键ID
		pd: [],						//存放字段参数
		msg:'add',
		userList:[],  //用户列表
		USER_ID:'',
		FAMILY_ID:'',
		joinStatus:false,  //是否有该用户
    },

	methods: {

        //初始执行
        init() {
        	var FID = this.getUrlKey('FID');	//当接收过来的FID不为null时,表示此页面是修改进来的
        	var FA_ID = this.getUrlKey('FAMILY_ID');	
        	if(null != FID){
        		this.msg = 'edit';
        		this.FAMILYUSER_ID = FID;
        		this.getData();
        	}
			this.FAMILY_ID=FA_ID;
			this.getUserList();
        	setTimeout(function(){
        		vm.getDict();
            },200);
        },

        //去保存
    	save: function (){

			if(this.pd.FAMILY_ID == '' || this.pd.FAMILY_ID == undefined){
				$("#FAMILY_ID").tips({
					side:3,
		            msg:'请输入family_id',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.FAMILY_ID = '';
				this.$refs.FAMILY_ID.focus();
			return false;
			}
			if(this.pd.USER_ID == '' || this.pd.USER_ID == undefined){
				$("#USER_ID").tips({
					side:3,
		            msg:'请输入user_id',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.USER_ID = '';
				this.$refs.USER_ID.focus();
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
					url: httpurl+'familyuser/'+this.msg,
			    	data: {FAMILYUSER_ID:this.FAMILYUSER_ID,
					FAMILY_ID:this.pd.FAMILY_ID,
					USER_ID:this.pd.USER_ID,
			    	tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("家庭群组人员数据表",data.exception);//显示异常
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


		addUser:function(){
			this.USER_ID=$("#USER_ID").val();
			if(this.USER_ID == '' || this.USER_ID == undefined){
				$("#USER_ID").tips({
					side:3,
			        msg:'请选择用户',
			        bg:'#AE81FF',
			        time:2
			    });
				this.USER_ID = '';
				this.$refs.USER_ID.focus();
			return false;
			}
			alert(this.USER_ID);
			//判断改家庭组是否有该用户
			vm.hadJoin();
			if(vm.joinStatus){
				return false;
			}
			//发送 post 请求提交保存
			$.ajax({
			    	xhrFields: {
			            withCredentials: true
			        },
					type: "POST",
					url: httpurl+'familyuser/add',
			    	data: {
					FAMILYUSER_ID:this.FAMILYUSER_ID,
					FAMILY_ID:this.FAMILY_ID,
					USER_ID:this.USER_ID,
			    	tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
			            if("success" == data.result){
							vm.joinStatus=false;  //将加入状态恢复
			            	swal("", "添加成功", "success");
			            	setTimeout(function(){
			            		top.Dialog.close();//关闭弹窗
			                },1000);
			            }else if ("exception" == data.result){
			            	showException("添加家庭组成员失败",data.exception);//显示异常
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
						USER_ID:this.USER_ID,
						tm:new Date().getTime(),
						},
					dataType:"json",
					success: function(data){
						if("success" == data.result){
								if(data.joinStatusRes){
									swal("", "该用户已经在此家庭组!", "warning");
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
	
		//获取用户列表 并且判断是否是管理员
		getUserList:function(){
			$.ajax({
				xhrFields: {
			    withCredentials: true
				},
				type: "POST",
				url: httpurl+'user/getAllUser',
				data:{
					 tm:new Date().getTime()
				},
				dataType:'json',
				success: function(data){
					if("success"==data.result){
						vm.userList=data.list;
					} else if ("exception" == data.result){
                            showException("个人信息添加",data.exception);	//显示异常
                            $("#showform").show();
                            $("#jiazai").hide();
                    }
				}
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
				url: httpurl+'familyuser/goEdit',
		    	data: {FAMILYUSER_ID:this.FAMILYUSER_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
                     }else if ("exception" == data.result){
                     	showException("家庭群组人员数据表",data.exception);	//显示异常
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
