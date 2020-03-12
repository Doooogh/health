
var vm = new Vue({
	el: '#app',

	data:{
		varList: [],	//list
		page: [],		//分页类
		KEYWORDS:'',	//检索条件,关键词
		showCount: -1,	//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,	//当前页码
		add:false,		//增
		del:false,		//删
		edit:false,		//改
		toExcel:false,	//导出到excel权限
		loading:false	,//加载状态
		FAMILY_ID:'',  
		isCreate:false,  //是否是改家庭组创建者
		info:[],  //家庭组信息
    },

	methods: {

        //初始执行
        init() {
			var FID = this.getUrlKey('FAMILY_ID');	//当接收过来的FID不为null时,表示此页面是修改进来的
			
			if(null != FID){
				this.FAMILY_ID = FID;
				this.getList();
			}
			//复选框控制全选,全不选
			$('#zcheckbox').click(function(){
				 if($(this).is(':checked')){
					 $("input[name='ids']").click();
				 }else{
					 $("input[name='ids']").attr("checked", false);
				 }
			});
        },

        //获取列表
        getList: function(){
        	this.loading = true;
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'familyuser/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {
					KEYWORDS:this.KEYWORDS,
					tm:new Date().getTime(),
					FAMILY_ID:this.FAMILY_ID,
					},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.varList;
        			 vm.page = data.page;
        			 vm.hasButton();
        			 vm.loading = false;
					 if(data.isCreate){
						 vm.isCreate=true;
					 }
					 vm.info=data.info;
        			 $("input[name='ids']").attr("checked", false);
        		 }else if ("exception" == data.result){
                 	showException("家庭群组人员数据表",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },

    	//新增
    	goAdd: function (){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="新增";
 			 diag.URL = '../../health/familyuser/familyuser/familyuser_edit.html?FAMILY_ID='+vm.FAMILY_ID;
    		 diag.Width = 1000;
    		 diag.Height = 800;
    		 diag.Modal = true;				//有无遮罩窗口
    		 diag. ShowMaxButton = true;	//最大化按钮
    	     diag.ShowMinButton = true;		//最小化按钮
    		 diag.CancelEvent = function(){ //关闭事件
    	    /* 	 var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
    			 if(varSon != null && varSon.style.display == 'none'){
    			
    			} */
					 vm.getList();
    			diag.close();
    		 };
    		 diag.show();
    	},

		toAddHealthInfo:function(id){
			/* var diag = new top.Dialog();
			diag.Drag=true;
			diag.Title ="查看健康信息";
			diag.URL = '../../health/healthinfo/healthinfo/healthinfo_list.html?USER_ID='+id;
			diag.Width = 1000;
			diag.Height = 800;
			diag.Modal = true;				//有无遮罩窗口
			diag. ShowMaxButton = true;	//最大化按钮
			diag.ShowMinButton = true;		//最小化按钮
			diag.CancelEvent = function(){ //关闭事件
			    			diag.close();
			};
			diag.show(); */
			window.open('../../healthinfo/healthinfo/healthinfo_list1.html?USER_ID='+id);
		},
		toData:function(id){
			window.open('../../healthinfo/healthinfo/healthinfo_data.html?USER_ID='+id);
		},

    	//修改
    	goEdit: function(id){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="编辑";
    		 diag.URL = '../../health/familyuser/familyuser/familyuser_edit.html?FID='+id;
    		 diag.Width = 1000;
    		 diag.Height = 800;
    		 diag.Modal = true;				//有无遮罩窗口
    		 diag. ShowMaxButton = true;	//最大化按钮
    	     diag.ShowMinButton = true;		//最小化按钮
    		 diag.CancelEvent = function(){ //关闭事件
    			 var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
    			 if(varSon != null && varSon.style.display == 'none'){
    				 vm.getList();
    			}
    			diag.close();
    		 };
    		 diag.show();
    	},

    	//删除
    	goDel: function (id){
    		swal({
    			title: '',
                text: "确定要删除吗?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                	this.loading = true;
                	$.ajax({
                		xhrFields: {
                            withCredentials: true
                        },
            			type: "POST",
            			url: httpurl+'familyuser/delete',
            	    	data: {FAMILYUSER_ID:id,tm:new Date().getTime()},
            			dataType:'json',
            			success: function(data){
            				if("success" == data.result){
        		                swal("删除成功", "已经从列表中删除!", "success");
        		                vm.getList();
	        				 }else{
	     		                 swal("删除失败!", "请先删除明细数据!", "warning");
	     		                 vm.loading = false;
	        				 }
            			}
            		});
                }
            });
    	},

      	//判断按钮权限，用于是否显示按钮
        hasButton: function(){
        	var keys = 'familyuser:add,familyuser:del,familyuser:edit,toExcel';
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'head/hasButton',
        		data: {keys:keys,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			vm.add = data.familyuserfhadminadd;		//新增权限
        			vm.del = data.familyuserfhadmindel;		//删除权限
        			vm.edit = data.familyuserfhadminedit;	//修改权限
        			vm.toExcel = data.toExcel;						//导出到excel权限
        		 }else if ("exception" == data.result){
                 	showException("按钮权限",data.exception);		//显示异常
                 }
        		}
        	})
        },

        //导出excel
		goExcel: function (){
			swal({
               	title: '',
                text: '确定要导出到excel吗?',
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                	window.location.href = httpurl+'familyuser/excel';
                }
            });
		},
		//批量操作
    	makeAll: function (msg){
    		swal({
                title: '',
                text: msg,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
    	        	var str = '';
					console.log(vm.info.CREATE_BY);
    				for(var i=0;i < document.getElementsByName('ids').length;i++){
    					  if(document.getElementsByName('ids')[i].checked){
							  var idd=document.getElementsByName('ids')[i].value;
							 var userId=document.getElementsByName('ids')[i].getAttribute("user_id");
							  if(userId==vm.info.CREATE_BY){
								     continue;
							  }
								  if(str=='') str += idd;
								  else str += ',' + idd;
    					  	
    					  }
    				}
					
    				if(str==''){
    					$("#cts").tips({
    						side:2,
    			            msg:'点这里全选',
    			            bg:'#AE81FF',
    			            time:3
    			        });
    	                swal("", "您没有选择任何内容,不能删除自己!", "warning");
    					return;
    				}else{
    					if(msg == '确定要删除选中的数据吗?'){
    						this.loading = true;
    						$.ajax({
    							xhrFields: {
    	                            withCredentials: true
    	                        },
    							type: "POST",
    							url: httpurl+'familyuser/deleteAll?tm='+new Date().getTime(),
    					    	data: {DATA_IDS:str},
    							dataType:'json',
    							success: function(data){
    								if("success" == data.result){
    									swal("删除成功", "已经从列表中删除!", "success");
    		        				 }
    								vm.getList();
    							}
    						});
    					}
    				}
                }
            });
    	},
        //-----分页必用----start
        nextPage: function (page){
        	this.currentPage = page;
        	this.getList();
        },
        changeCount: function (value){
        	this.showCount = value;
        	this.getList();
        },
        toTZ: function (){
        	var toPaggeVlue = document.getElementById("toGoPage").value;
        	if(toPaggeVlue == ''){document.getElementById("toGoPage").value=1;return;}
        	if(isNaN(Number(toPaggeVlue))){document.getElementById("toGoPage").value=1;return;}
        	this.nextPage(toPaggeVlue);
        },
       //-----分页必用----end
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