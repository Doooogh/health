
var vm=new Vue({
    el:'#main',
    data:{
        ID:'',
        ATTACHMENT:'',
        pd:[],
        varList:[],
		userList:[],
		user:'',
    },
    methods:{
        init(){
            var aId=this.getUrlKey("INFORM_ID");
            if(aId!=null&&aId!=''&&aId!=undefined){
                this.ID=aId;
                this.getData();
				this.initTable();
				
            }
        },
        getData:function () {
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl+'inform/getById',
                data: {
                    ID:this.ID,
                    tm:new Date().getTime()},
                dataType:"json",
                success: function(data){
                    if("success" == data.result){
                      vm.pd=data.pd;
                      vm.varList=data.varList;
					  vm.user=data.user;
                    }else if ("exception" == data.result){
                        showException("按钮权限",data.exception);		//显示异常
                    }
                }
            })
        },
        downloadAtt:function(id,url){
            window.location.href=httpurl+"inform/download?ID="+id+"&URL="+url;
        },
        getUrlKey: function (name) {
            return decodeURIComponent(
                (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
        },
		initTable:function(){
			$.ajax({
			    xhrFields: {
			        withCredentials: true
			    },
			    type: "POST",
			    url: httpurl+'inform/findInformUser',
			    data: {
			        ID:this.ID,
			        tm:new Date().getTime()
					},
			    dataType:"json",
			    success: function(data){
			        if("success" == data.result){
			          vm.userList=data.users;
					  $('#exampleTable')
					         .bootstrapTable(
					             {
									method: 'get', // 服务器数据的请求方式 get or post
									iconSize: 'outline',
									striped: true, // 设置为true会有隔行变色效果
									dataType: "json", // 服务器返回的数据类型
									singleSelect: false, // 设置为true将禁止多选
									pageSize: 5, // 如果设置了分页，每页数据条数
									pageNumber: 1, // 如果设置了分布，首页页码
									sortable: true,
									pagination: true,
									fixedColumns: true,
									fixedNumber: 2,
									showLoading:false,
									sidePagination: "client", // 设置在哪里进行分页，可选值为"client" 或者 "server",
									data:vm.userList,
									responseHandler: function (data) {
										return data;
									},
									columns: 
									[
										{
											field: 'USER_ID',
											title: '序号',
											formatter: function (value, row, index) {
												return index+1;
											}
										},
										{
											field: 'USERNAME',
											title: '用户名',
											formatter: function (value, row, index) {
												return "<span style='color:black'>"+value+"</span>";
											}
										},
										{
											field: 'isNot',
											title: '状态',
											formatter: function (value, row, index) {
												if(value=='1'){
													return "<span style='font-weight:bold'>未查看</span>";
												}else{
													return "<span >已查看</span>";
												}
											}
										},
									],
									data:vm.userList
					  								
					             });
								 $("#exampleTable").bootstrapTable('hideLoading');
			        }else if ("exception" == data.result){
			            showException("按钮权限",data.exception);		//显示异常
			        }
			    }
			});

		}
    },
    mounted() {
        this.init();
    }

});
