
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
		USER_ID:'', //用户id
		userInfo:[],  //个人信息
		START_TIME:'', //开始时间
		END_TIME:'',  //结束时间
		myChartObj:new Object(),  
		COLUMN:'HEART_RATE',//类型
		eOption:{
				            title: {
				                text: '数据展示',
				            },
				            tooltip: {
				                trigger: 'axis'
				            },
				          
				            toolbox: {
				                show: true,
				                feature: {
				                    dataZoom: {
				                        yAxisIndex: 'none'
				                    },
				                    dataView: {readOnly: false},
				                    magicType: {type: ['line', 'bar']},
				                    restore: {},
				                    saveAsImage: {}
				                }
				            },
				            xAxis: {
				                type: 'category',
				                boundaryGap: false,
				                data: []   //时间
				            },
				            yAxis: {
				                type: 'value',
				                axisLabel: {
				                    formatter: ''   //计量单位
				                }
				            },
				            series: [
				                {
				                    name: '数据',
				                    type: 'line',
				                    data: [],  //数据
				                    markPoint: {
				                       /* data: [
				                            {name: '周最低', value: -6, xAxis: 3, yAxis: -1.5}
				                        ] */
				                    },
				                    markLine: {
				                        data: [
				                            {type: 'average', name: '平均值'},
				                            [{
				                                symbol: 'none',
				                                x: '90%',
				                                yAxis: 'max'
				                            }, {
				                                symbol: 'circle',
				                                label: {
				                                    position: 'start',
				                                    formatter: '最大值'
				                                },
				                                type: 'max',
				                                name: '最高点'
				                            }]
				                        ]
				                    }
				                }
				            ]
				        }, //echarts 数据
		
    },

	methods: {

        //初始执行
        init() {
			var UID = this.getUrlKey('USER_ID');
			if(null!=UID&&''!=UID&&undefined!=UID){
				this.USER_ID=UID;
			}
			this.getPInfo();
			this.showEData();
			this.getEData();
        },

		//获取个人基本信息
		getPInfo:function () {
			$.ajax({
				xhrFields: {
			        withCredentials: true
			    },
				type: "POST",
				url: httpurl+'basicinfo/getPInfo',
				data: {
					USER_ID:this.USER_ID,
					tm:new Date().getTime()
					},
				dataType:'json',
				success: function(data){
					if("success" == data.result){
			            vm.userInfo=data.pd;
						vm.userInfo.BIRTHDAY=vm.userInfo.BIRTHDAY.substring(0,10);
					 }else{
			             swal("获取个人信息失败!", "请联系管理员!", "warning");
					 }
				}
			});
		},
		
		
		getEData:function(type){
			if(undefined!=type&&''!=type&&''!=type){
				this.COLUMN=type;
			}
			$.ajax({
				xhrFields: {
			        withCredentials: true
			    },
				type: "POST",
				url: httpurl+'healthinfo/dataAnalysisECharts',
				data: {
					USER_ID:this.USER_ID,
					COLUMN:this.COLUMN,  //数据类型
					START_TIME:this.START_TIME,  //开始时间
					END_TIME:this.END_TIME,  //结束时间
					tm:new Date().getTime()
					},
				dataType:'json',
				success: function(data){
					if("success" == data.result){
						vm.eOption.xAxis.data=data.aData.eTime;  //时间
						vm.eOption.series[0].data=data.aData.eData;  //数据
						vm.eOption.series[0].name=data.aData.NAME;  //名称
						vm.eOption.yAxis.axisLabel.formatter= '{value} '+data.aData.UNIT;  //单位
						vm.myChartObj.setOption(vm.eOption,true);
					 }else{
			             swal("获取个人信息失败!", "请联系管理员!", "warning");
					 }
				}
			});
			
		},
		
		//根据时间来改变START_TIME 和 END_TIME
		selectThisWeek:function(dType){
			vm.getSETime(dType);
			vm.getEData();
		},
		
		//自定义时间范围
		selectTimeRange:function(){
			
		},
		
		
		//展示echarts 数据
		showEData:function(){
			// 基于准备好的dom，初始化echarts实例
			       var myChart = echarts.init(document.getElementById('main'));
				   this.myChartObj=myChart;
				   // 指定图表的配置项和数据
				      var option1 = {
				            title: {
				                text: '数据展示',
				            },
				            tooltip: {
				                trigger: 'axis'
				            },
				          
				            toolbox: {
				                show: true,
				                feature: {
				                    dataZoom: {
				                        yAxisIndex: 'none'
				                    },
				                    dataView: {readOnly: false},
				                    magicType: {type: ['line', 'bar']},
				                    restore: {},
				                    saveAsImage: {}
				                }
				            },
				            xAxis: {
				                type: 'category',
				                boundaryGap: false,
				                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
				            },
				            yAxis: {
				                type: 'value',
				                axisLabel: {
				                    formatter: '{value} °C'
				                }
				            },
				            series: [
				                {
				                    name: '数据',
				                    type: 'line',
				                    data: [1, -3, 2, 10, 3, 2, 0],
				                    markPoint: {
				                       /* data: [
				                            {name: '周最低', value: -6, xAxis: 3, yAxis: -1.5}
				                        ] */
				                    },
				                    markLine: {
				                        data: [
				                            {type: 'average', name: '平均值'},
				                            [{
				                                symbol: 'none',
				                                x: '90%',
				                                yAxis: 'max'
				                            }, {
				                                symbol: 'circle',
				                                label: {
				                                    position: 'start',
				                                    formatter: '最大值'
				                                },
				                                type: 'max',
				                                name: '最高点'
				                            }]
				                        ]
				                    }
				                }
				            ]
				        };
				   		this.eOption=option1;	
				         // 使用刚指定的配置项和数据显示图表。
				         myChart.setOption(this.eOption);
		},
		
		
		 getStartAndEndTime:function(btn){
		    var nowDate = new Date();
		    var beginDate = null;
		    var endDate = null;
		    if(btn == 1){//本日
		        beginDate = nowDate.getFullYear() + "-" + (nowDate.getMonth()+1) + "-" + nowDate.getDate() + ' 00:00';
		        endDate = myformatter(new Date());
		    }else if(btn == "week"){//本周
		        nowDate.setDate(nowDate.getDate() - nowDate.getDay()+1);
		        beginDate = nowDate.getFullYear() + "-" + (nowDate.getMonth()+1) + "-" + nowDate.getDate() + " 00:00";
		        nowDate.setDate(nowDate.getDate() + 6);
		        endDate = nowDate.getFullYear() + "-" + (nowDate.getMonth()+1) + "-" + nowDate.getDate() + " 23:59";
		    }else if(btn == "month"){//本月
		        beginDate = nowDate.getFullYear() + "-" + (nowDate.getMonth()+1) + "-01 00:00";
		        var day = new Date(nowDate.getFullYear(), nowDate.getMonth()+1, 0);
		        endDate = nowDate.getFullYear() + "-" + (nowDate.getMonth()+1) + "-" + day.getDate() + " 23:59";
		    }else if(btn == "季度"){//本季
		        if(now.getMonth()+1 <= 3){
		            beginDate = nowDate.getFullYear() + "-01-01 00:00";
		            endDate = nowDate.getFullYear() + "-03-31 23:59";
		        }else if(now.getMonth()+1 > 3 && now.getMonth()+1 <= 6){
		            beginDate = nowDate.getFullYear() + "-04-01 00:00";
		            endDate = nowDate.getFullYear() + "-06-30 23:59";
		        }else if(now.getMonth()+1 > 6 && now.getMonth()+1 <= 9){
		            beginDate = nowDate.getFullYear() + "-07-01 00:00";
		            endDate = nowDate.getFullYear() + "-09-30 23:59";
		        }else if(now.getMonth()+1 > 9 && now.getMonth()+1 <= 12){
		            beginDate = nowDate.getFullYear() + "-10-01 00:00";
		            endDate = nowDate.getFullYear() + "-12-31 23:59";
		        }
		    }else if(btn == "year"){//本年
		        beginDate = nowDate.getFullYear() + "-01-01 00:00";
		        var day = new Date(nowDate.getFullYear(), 12, 0);
		        endDate = nowDate.getFullYear() + "-12-" + day.getDate() + " 23:59";
		    }
			vm.START_TIME=beginDate;
			vm.END_TIME=endDate;
		},
		
		 getSETime:function(type){
			
			if("week"==type){
				 vm.START_TIME=dayjs().startOf('week').add(1,"day").format('YYYY-MM-DD HH:mm:ss');
				 vm.END_TIME=dayjs().endOf('week').add(1,"day").format('YYYY-MM-DD HH:mm:ss');
			 }else if("month"==type){
				 vm.START_TIME=dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss');
				 vm.END_TIME=dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss');
			 }else if("year"==type){
				 vm.START_TIME=dayjs().startOf('year').format('YYYY-MM-DD HH:mm:ss');
				 vm.END_TIME=dayjs().endOf('year').format('YYYY-MM-DD HH:mm:ss');
			 }
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