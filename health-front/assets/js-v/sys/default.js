var vm = new Vue({
	el: '#app',
	
	data:{
		hasTask: false,  //是否有代办任务
		hasInform: false,  //是否有系统消息
		show: true,  //没有消息显示
		taskCount:0,   //代办任务条数
		informCount:0,   //系统通知条数
		taskList:[],		//代办任务集合
		informList:[]    //通知公告集合
    },
	
	methods: {
		
        //初始执行
        init() {
        	this.topTask();
        	this.topInform();
        },
		//待办任务
		topTask: function(){
			$.ajax({
				xhrFields: {
		            withCredentials: true
		        },
				type: "POST",
				url: httpurlActiviti+'/rutask/getList?tm='+new Date().getTime(), //待办任务
		    	data: encodeURI(""),
				dataType:'json',
				success: function(data){
					 var taskCount = Number(data.taskCount);
					 $("#taskCount").html(Number(taskCount));				//待办任务总数
					 if(taskCount == 0){$("#myTask").html('<li class="notification"><div class="media"><div class="media-body"><p>没有需要办理的任务</p></div></div></li>');}
					 $("#myTask").html('<li></li>');
					 vm.taskList=data.list;
					 vm.hasTask=true;
					 $.each(data.list, function(i, list){
						 $("#myTask").append('<li class="notification"><div class="media"><div class="media-body"><p>'+(i+1)+' . '+list.PNAME_+'('+list.NAME_+')</p></div></div></li>');
					 });
				/* 	 if(taskCount > 0){
						 $("#taskCount").tips({
								side:3,
					            msg:'您有任务需要办理',
					            bg:'#AE81FF',
					            time:30
					     });
					 } */
					 if ("exception" == data.result){
				          showException("待办任务",data.exception);//显示异常
				      }
				}
			});
		},
		topInform: function() {
		    $.ajax({
		        xhrFields: {
		            withCredentials: true
		        },
		        type: "POST",
		        url: httpurl + '/inform/getNoInformList?tm=' + new Date().getTime(), //待办任务
		        data: encodeURI(""),
		        dataType: 'json',
		        success: function(data) {
		            var informCount = Number(data.informCount);
		            vm.informCount=informCount;
		            if (informCount > 0) {
		                vm.show = false;
		                vm.hasInform = true;
		                // $("#taskCount").html(Number($("#taskCount").html()) + Number(informCount)); //待办任务总数
		                // $("#taskCount").html(Number(vm.taskCount+vm.informCount)); //待办任务总数
						vm.informList=data.list;
						debugger;
		            }
		            /* if (informCount == 0 && Number($("#taskCount").html()) == 0) {
		                $("#taskCount").html('');
		                $("#myInform").html('<div class="winui-message-item"><h2>没有需要办理的通知</h2><div class="content"></div></div>');
		                vm.hasInform = false;
		                if (vm.hasTask == false) {
		                    vm.show = true;
		                }
		            } */
		           /* $("#myInform").html('<li></li>');
		            $.each(data.list, function(i, list) {
		                $("#myInform").append('<div class="winui-message-item"><h2>' + (i + 1) + '.' + list.TITLE +
		                    '</h2><div class="content" style="width:50px;text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">' +
		                    list.CONTENT + '</div></div>');
		            });
		            if (informCount > 0) {
		                $("#taskCount").tips({
		                    side: 1,
		                    msg: '您有新的通知',
		                    bg: '#AE81FF',
		                    time: 30
		                });
		            }
					*/
		            if ("exception" == data.result) {
		                layer.msg("待办任务程序异常,稍后再试." + data.exception); //显示异常
		            } 
		        }
		    });
		},
		},
	mounted(){
		this.init();
	},
	});