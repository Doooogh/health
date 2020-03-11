
var vm = new Vue({
	el: '#app',

	data:{
BASICINFO_ID: '',	//主键ID
		pd: [],						//存放字段参数
        SEX: '',
		msg:'add',
		userList:[],  //所有用户列表
		isAdmin:false,  //是否是管理员,
		// cUseId:'', //如果不是管理员  当前用户id
		USER_ID:'', //用户id
		sexList:[],  //性别集合
    },

	methods: {

        //初始执行
        init() {
        	var FID = this.getUrlKey('FID');	//当接收过来的FID不为null时,表示此页面是修改进来的
        	if(null != FID){
        		this.msg = 'edit';
        		this.BASICINFO_ID = FID;
        		this.getData();
        	}
			this.getUserList();
			// this.getUserInfo();
        	setTimeout(function(){
        		vm.getDict();
            },200);
        },



        //去保存
    	save: function (){

		/* 	if(this.pd.NAME == '' || this.pd.NAME == undefined){
				$("#NAME").tips({
					side:3,
		            msg:'请输入姓名',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.NAME = '';
				this.$refs.NAME.focus();
			return false;
			}*/
			
			if(vm.isAdmin){
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
			}
			if(this.SEX == ''){
				$("#SEX").tips({
					side:3,
		            msg:'请输入性别',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.SEX = '';
				this.$refs.SEX.focus();
			return false;
			} 
			this.pd.BIRTHDAY = $("#BIRTHDAY").val();
			if(this.pd.BIRTHDAY == '' || this.pd.BIRTHDAY == undefined){
				$("#BIRTHDAY").tips({
					side:3,
		            msg:'请输入生日',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.BIRTHDAY = '';
				this.$refs.BIRTHDAY.focus();
			return false;
			}
			if(this.pd.HEIGHT == '' || this.pd.HEIGHT == undefined){
				$("#HEIGHT").tips({
					side:3,
		            msg:'请输入身高',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.HEIGHT = '';
				this.$refs.HEIGHT.focus();
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
			this.pd.ALLERGIC_HISTORY = $("#ALLERGIC_HISTORY").val();
			if(this.pd.ALLERGIC_HISTORY == '' || this.pd.ALLERGIC_HISTORY == undefined){
				this.pd.ALLERGIC_HISTORY='无';
			/* 	$("#ALLERGIC_HISTORY").tips({
					side:3,
		            msg:'请输入过敏史',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.ALLERGIC_HISTORY = '';
				this.$refs.ALLERGIC_HISTORY.focus();
			return false; */
			}
			this.pd.DISEASES_HISTORY = $("#DISEASES_HISTORY").val();
			if(this.pd.DISEASES_HISTORY == '' || this.pd.DISEASES_HISTORY == undefined){
				this.pd.DISEASES_HISTORY='无';
			/* 	$("#DISEASES_HISTORY").tips({
					side:3,
		            msg:'请输入疾病史',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.DISEASES_HISTORY = '';
				this.$refs.DISEASES_HISTORY.focus();
			return false; */
			}
			this.pd.FA_DISEASES_HISTORY = $("#FA_DISEASES_HISTORY").val();
			if(this.pd.FA_DISEASES_HISTORY == '' || this.pd.FA_DISEASES_HISTORY == undefined){
				this.pd.FA_DISEASES_HISTORY='无';
				/* $("#FA_DISEASES_HISTORY").tips({
					side:3,
		            msg:'请输入家族病史',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.FA_DISEASES_HISTORY = '';
				this.$refs.FA_DISEASES_HISTORY.focus();
			return false; */
			}
			this.pd.OTHERS = $("#OTHERS").val();
			if(this.pd.OTHERS == '' || this.pd.OTHERS == undefined){
				this.pd.OTHERS='无';
				/* $("#OTHERS").tips({
					side:3,
		            msg:'请输入其他信息',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.OTHERS = '';
				this.$refs.OTHERS.focus();
			return false; */
			}
		
    		$("#showform").hide();
    		$("#jiazai").show();

            //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'basicinfo/'+this.msg,
			    	data: {BASICINFO_ID:this.BASICINFO_ID,
				/* 	NAME:this.pd.NAME,*/
					SEX:this.SEX, 
					BIRTHDAY:this.pd.BIRTHDAY,
					HEIGHT:this.pd.HEIGHT,
					WEIGHT:this.pd.WEIGHT,
					ALLERGIC_HISTORY:this.pd.ALLERGIC_HISTORY,
					DISEASES_HISTORY:this.pd.DISEASES_HISTORY,
					FA_DISEASES_HISTORY:this.pd.FA_DISEASES_HISTORY,
					OTHERS:this.pd.OTHERS,
					USER_ID:this.USER_ID,
					IS_NEW:this.pd.IS_NEW,
			    	tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("用户基本信息",data.exception);//显示异常
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
				url: httpurl+'basicinfo/goEdit',
		    	data: {BASICINFO_ID:this.BASICINFO_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
						vm.SEX = data.pd.SEX;
						vm.USER_ID=data.pd.USER_ID;
						vm.pd.BIRTHDAY=data.pd.BIRTHDAY.substring(0,10);
						$("#BIRTHDAY").val(data.pd.BIRTHDAY);
                     }else if ("exception" == data.result){
                     	showException("用户基本信息",data.exception);	//显示异常
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
		
		//根据userId来获取该用户的信息
		getUserInfo:function(){
			var selectUserId='';
			debugger;
			if(this.isAdmin){
				selectUserId=$("#USER_ID").val();
				if(''!=selectUserId){
					vm.USER_ID=selectUserId;
				}
			}
			if(this.USER_ID!=''){
				$.ajax({
					xhrFields: {
				    withCredentials: true
					},
					type: "POST",
					url: httpurl+'user/getUserInfo',
					data:{
						USER_ID:this.USER_ID,
						 tm:new Date().getTime()
					},
					dataType:'json',
					success: function(data){
						if("success"==data.result){
							var user=data.userInfo;
							vm.NAME=user.NAME;
							if(undefined==user.SEX||null==user.SEX){
								vm.SEX=vm.sexList[0].BAINMA;
							}
						} else if ("exception" == data.result){
				                showException("个人信息添加",data.exception);	//显示异常
				                $("#showform").show();
				                $("#jiazai").hide();
				        }
					}
				});
			}
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
						if(data.isAdmin){
							vm.isAdmin=true;
						}else{
							vm.USER_ID=data.userId;
						}
					} else if ("exception" == data.result){
                            showException("个人信息添加",data.exception);	//显示异常
                            $("#showform").show();
                            $("#jiazai").hide();
                    }
				}
			});
		},
	
    	//获取数据字典数据
  	//获取数据字典数据
		getDict: function (){
				$.ajax({
					xhrFields: {
                    withCredentials: true
                	},
					type: "POST",
					url: httpurl+'dictionaries/getLevels?tm='+new Date().getTime(),
			    	data: {DICTIONARIES_ID:'a1a4aae234794f5b8f59f31f101d1c3a'},
					dataType:'json',
					success: function(data){
						 $("#SEX").append("<option value=''>请选择性别</option>");
						 vm.sexList=data.lise;
						 $.each(data.list, function(i, dvar){
							 if(vm.SEX == dvar.BIANMA){
							  	$("#SEX").append("<option value="+dvar.BIANMA+" selected>"+dvar.NAME+"</option>");
							 }else{
								$("#SEX").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
							 }
						 });
					}
				});
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
