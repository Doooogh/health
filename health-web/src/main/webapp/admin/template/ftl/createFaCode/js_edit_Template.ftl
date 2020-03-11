
var vm = new Vue({
	el: '#app',

	data:{
${objectNameUpper}_ID: '',	//主键ID
		pd: [],						//存放字段参数
<#list fieldList as var>
    <#if var[3] == "是">
        <#if var[7] != 'null'>
            ${var[0]}: '',
        </#if>
    </#if>
</#list>
		msg:'add'
    },

	methods: {

        //初始执行
        init() {
        	var FID = this.getUrlKey('FID');	//当接收过来的FID不为null时,表示此页面是修改进来的
        	if(null != FID){
        		this.msg = 'edit';
        		this.${objectNameUpper}_ID = FID;
        		this.getData();
        	}
        	setTimeout(function(){
        		vm.getDict();
            },200);
        },

        //去保存
    	save: function (){

<#list fieldList as var>
    <#if var[3] == "是">
        <#if var[7] != 'null'>
			if(this.${var[0]} == ''){
				$("#${var[0]}").tips({
					side:3,
		            msg:'请输入${var[2] }',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.${var[0]} = '';
				this.$refs.${var[0]}.focus();
			return false;
			}
        <#elseif var[1] == 'Date'>
			this.pd.${var[0]} = $("#${var[0]}").val();
			if(this.pd.${var[0]} == '' || this.pd.${var[0]} == undefined){
				$("#${var[0]}").tips({
					side:3,
		            msg:'请输入${var[2] }',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.${var[0]} = '';
				this.$refs.${var[0]}.focus();
			return false;
			}
        <#else>
			if(this.pd.${var[0]} == '' || this.pd.${var[0]} == undefined){
				$("#${var[0]}").tips({
					side:3,
		            msg:'请输入${var[2] }',
		            bg:'#AE81FF',
		            time:2
		        });
				this.pd.${var[0]} = '';
				this.$refs.${var[0]}.focus();
			return false;
			}
        </#if>
    </#if>
</#list>

    		$("#showform").hide();
    		$("#jiazai").show();

            //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'${objectNameLower}/'+this.msg,
			    	data: {${objectNameUpper}_ID:this.${objectNameUpper}_ID,
<#list fieldList as var>
    <#if var[3] == "是">
        <#if var[7] != 'null'>
            ${var[0]}:this.${var[0]},
        <#else>
            ${var[0]}:this.pd.${var[0]},
        </#if>
    </#if>
</#list>
			    	tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	swal("", "保存成功", "success");
                        	setTimeout(function(){
                        		top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("${TITLE}",data.exception);//显示异常
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
				url: httpurl+'${objectNameLower}/goEdit',
		    	data: {${objectNameUpper}_ID:this.${objectNameUpper}_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;							//参数map
<#list fieldList as var>
    <#if var[3] == "是">
        <#if var[7] != 'null'>
						vm.${var[0]} = data.pd.${var[0]};
        <#elseif var[1] == 'Date'>
						$("#${var[0]}").val(data.pd.${var[0]});
        </#if>
    </#if>
</#list>
                     }else if ("exception" == data.result){
                     	showException("${TITLE}",data.exception);	//显示异常
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
		getDict: function (){
<#list fieldList as var>
    <#if var[3] == "是">
        <#if var[1] == 'String'>
            <#if var[7] != 'null'>
				$.ajax({
					xhrFields: {
                    withCredentials: true
                	},
					type: "POST",
					url: httpurl+'dictionaries/getLevels?tm='+new Date().getTime(),
			    	data: {DICTIONARIES_ID:'${var[7]}'},
					dataType:'json',
					success: function(data){
						 $("#${var[0]}").append("<option value=''>请选择${var[2]}</option>");
						 $.each(data.list, function(i, dvar){
							 if(vm.${var[0]} == dvar.BIANMA){
							  	$("#${var[0]}").append("<option value="+dvar.BIANMA+" selected>"+dvar.NAME+"</option>");
							 }else{
								$("#${var[0]}").append("<option value="+dvar.BIANMA+">"+dvar.NAME+"</option>");
							 }
						 });
					}
				});
            </#if>
        </#if>
    </#if>
</#list>
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
