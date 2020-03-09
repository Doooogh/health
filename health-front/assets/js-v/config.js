 
var zuulUrl = 'http://127.0.0.1:8085/';					//zuul网关路由服务host

var httpurl = 'http://127.0.0.1:8085/';					//zuul网关路由服务host
 var nginxurl ='http://127.0.0.1:8088/';
 
 
 
 var httpurlBootAdmin = zuulUrl;	//监控中心服务
 var httpurlDbsync	 = zuulUrl;			//表同步微服务
 var httpurlSystem	 = zuulUrl;							//系统服务   +'fh-system/'
 var httpurlIm		 = zuulUrl;				//即时通讯IM服务
 var httpurlActiviti  = zuulUrl;			//工作流服务
 var httpurlOa  	= zuulUrl;				//OA办公服务
 var httpurlTools  	 = zuulUrl;				//系统工具服务		
 var httpurlDbmanage  = zuulUrl;			//数据库管理服务
 
 
var eurekaServer1 = 'http://127.0.0.1:8761/';			//eureka注册中心1
var eurekaServer2 = 'http://127.0.0.1:8762/';			//eureka注册中心2

var eurekaServers = new Array(eurekaServer1,eurekaServer2);	//创建数组存放eurekaServer地址

var httpurlZipkin = 'http://127.0.0.1:8003/';			//分布式跟踪服务

/* var httpurlBootAdmin = zuulUrl+'fhcloud-boot-admin/';	//监控中心服务
var httpurlDbsync	 = zuulUrl+'fh-dbsync/';			//表同步微服务
var httpurlSystem	 = zuulUrl;							//系统服务   +'fh-system/'
var httpurlIm		 = zuulUrl+'fh-im/';				//即时通讯IM服务
var httpurlActiviti  = zuulUrl+'fh-activiti/';			//工作流服务
var httpurlOa  		 = zuulUrl+'fh-oa/';				//OA办公服务
var httpurlTools  	 = zuulUrl+'fh-tools/';				//系统工具服务		
var httpurlDbmanage  = zuulUrl+'fh-dbmanage/';			//数据库管理服务 */
	
var wsname = new Array(httpurlDbsync,httpurlSystem,httpurlIm,httpurlActiviti,httpurlOa,httpurlTools,httpurlDbmanage);	//退出登录时用于清理各个微服务session缓存(根据情况添加相应微服务)
 
 //显示异常
 function showException(modular,exception){
	 swal("["+modular+"]程序异常!", "抱歉！您访问的页面出现异常，请稍后重试或联系管理员 "+exception, "warning");
 }