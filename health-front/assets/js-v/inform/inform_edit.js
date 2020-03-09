var vm = new Vue({
    el: '#app',
    data:{
        ID: '',	//主键ID
        pd: [],						//存放字段参数
        msg:'add',
        attachment:'',
        hasFile:false,
        TYPE:'',
        apd:[],
        draft:0
    },

    methods: {

        //初始执行
        init() {
            var FID = this.getUrlKey('FID');	//当接收过来的FID不为null时,表示此页面是修改进来的
            if(null != FID){
                this.msg = 'edit';
                this.ID = FID;
                this.getData();
                // this.getUser();
                this.getTree();
            }else{
                this.getUser();
                this.getTree();
            }

            setTimeout(function(){
                vm.getDict();
            },200);
        },

        //去保存
        save: function (){
            if(this.pd.TITLE == '' || this.pd.TITLE == undefined){
                $("#TITLE").tips({
                    side:3,
                    msg:'请输入通知标题',
                    bg:'#AE81FF',
                    time:2
                });
                this.pd.TITLE = '';
                this.$refs.TITLE.focus();
                return false;
            }

            if(this.pd.INITIATOR_NAME == '' || this.pd.INITIATOR_NAME == undefined){
                $("#INITIATOR_NAME").tips({
                    side:3,
                    msg:'请输入发起人姓名',
                    bg:'#AE81FF',
                    time:2
                });
                this.pd.INITIATOR_NAME = '';
                this.$refs.INITIATOR_NAME.focus();
                return false;
            }
            if(this.TYPE == '' || this.TYPE == undefined){
                $("#TYPE").tips({
                    side:3,
                    msg:'请输入类型',
                    bg:'#AE81FF',
                    time:2
                });
                this.TYPE = '';
                this.$refs.TYPE.focus();
                return false;
            }

            var treeObj = $.fn.zTree.getZTreeObj("leftTree");
            var nodes = treeObj.getCheckedNodes(true);
            vm.getDepartmentIds(nodes);

            if(this.pd.DEPARTMENT_ID == '' || this.pd.DEPARTMENT_ID == undefined){
                $("#leftTree").tips({
                    side:3,
                    msg:'请选择接收人',
                    bg:'#AE81FF',
                    time:2
                });
                this.pd.DEPARTMENT_ID = '';
                return false;
            }

            if(!this.hasFile){
                layer.msg('图片或者附件还没有上传需要继续吗？', {
                    time: 0, //不自动关闭
                    // skin: 'demo-class'
                    btn: ['继续', '取消']
                    ,yes: function(index){
                        $("#showform").hide();
                        $("#jiazai").show();
                        layer.close(index);
                        $.ajax({
                            xhrFields: {
                                withCredentials: true
                            },
                            type: "POST",
                            url: httpurl+'inform/'+vm.msg,
                            data: {
                                ID:vm.pd.ID,
                                TITLE:vm.pd.TITLE,
                                ATTACHMENT:vm.attachment,
                                INITIATOR:vm.pd.INITIATOR,
                                INITIATOR_NAME:vm.pd.INITIATOR_NAME,
                                TYPE:vm.TYPE,
                                GROUP:vm.pd.GROUP,
                                DEPARTMENT_ID:vm.pd.DEPARTMENT_ID,
                                CONTENT:vm.pd.CONTENT,
                                tm:new Date().getTime(),
                                DRAFT:0,
                            },
                            dataType:"json",
                            success: function(data){
                                if("success" == data.result){
                                    top.vm.topTask();
                                    top.vm.topInform();
                                    swal("", "保存成功", "success");
                                    setTimeout(function(){
                                        top.Dialog.close();//关闭弹窗
                                    },1000);
                                }else if ("exception" == data.result){
                                    showException("通知",data.exception);//显示异常
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
                    btn2:function () {
                        $("#showform").show();
                        $("#jiazai").hide();
                    },
                });
            }else{
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: "POST",
                    url: httpurl+'inform/'+vm.msg,
                    data: {
                        ID:vm.pd.ID,
                        TITLE:vm.pd.TITLE,
                        ATTACHMENT:vm.attachment,
                        INITIATOR:vm.pd.INITIATOR,
                        INITIATOR_NAME:vm.pd.INITIATOR_NAME,
                        TYPE:vm.TYPE,
                        GROUP:vm.pd.GROUP,
                        DEPARTMENT_ID:vm.pd.DEPARTMENT_ID,
                        CONTENT:vm.pd.CONTENT,
                        DRAFT:0,   //是否为草稿
                        tm:new Date().getTime()
                    },
                    dataType:"json",
                    success: function(data){
                        if("success" == data.result){
                            swal("", "保存成功", "success");
                            setTimeout(function(){
                                top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                            showException("通知",data.exception);//显示异常
                            $("#showform").show();
                            $("#jiazai").hide();
                        }
                    }
                }).done().fail(function(){
                    swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                    $("#showform").show();
                    $("#jiazai").hide();
                });
            }

        },
        saveDraft:function(){
            if(this.pd.TITLE == '' || this.pd.TITLE == undefined){
                $("#TITLE").tips({
                    side:3,
                    msg:'请输入通知标题',
                    bg:'#AE81FF',
                    time:2
                });
                this.pd.TITLE = '';
                this.$refs.TITLE.focus();
                return false;
            }

            if(this.pd.INITIATOR_NAME == '' || this.pd.INITIATOR_NAME == undefined){
                $("#INITIATOR_NAME").tips({
                    side:3,
                    msg:'请输入发起人姓名',
                    bg:'#AE81FF',
                    time:2
                });
                this.pd.INITIATOR_NAME = '';
                this.$refs.INITIATOR_NAME.focus();
                return false;
            }
            if(this.TYPE == '' || this.TYPE == undefined){
                $("#TYPE").tips({
                    side:3,
                    msg:'请输入类型',
                    bg:'#AE81FF',
                    time:2
                });
                this.TYPE = '';
                this.$refs.TYPE.focus();
                return false;
            }
            var treeObj = $.fn.zTree.getZTreeObj("leftTree");
            var nodes = treeObj.getCheckedNodes(true);
            vm.getDepartmentIds(nodes);
            if(this.pd.DEPARTMENT_ID == '' || this.pd.DEPARTMENT_ID == undefined){
                $("#leftTree").tips({
                    side:3,
                    msg:'请选择接收人',
                    bg:'#AE81FF',
                    time:2
                });
                this.pd.DEPARTMENT_ID = '';
                return false;
            }


            if(!this.hasFile){
                layer.msg('图片或者附件还没有上传需要继续吗？', {
                    time: 0, //不自动关闭
                    // skin: 'demo-class'
                    btn: ['继续', '取消']
                    ,yes: function(index){
                        $("#showform").hide();
                        $("#jiazai").show();
                        layer.close(index);
                        $.ajax({
                            xhrFields: {
                                withCredentials: true
                            },
                            type: "POST",
                            url: httpurl+'inform/'+vm.msg,
                            data: {
                                ID:vm.pd.ID,
                                TITLE:vm.pd.TITLE,
                                ATTACHMENT:vm.attachment,
                                INITIATOR:vm.pd.INITIATOR,
                                INITIATOR_NAME:vm.pd.INITIATOR_NAME,
                                TYPE:vm.TYPE,
                                GROUP:vm.pd.GROUP,
                                DEPARTMENT_ID:vm.pd.DEPARTMENT_ID,
                                CONTENT:vm.pd.CONTENT,
                                DRAFT:1,   //是否为草稿
                                tm:new Date().getTime()
                            },
                            dataType:"json",
                            success: function(data){
                                if("success" == data.result){
                                    /* top.vm.topTask();
                                    top.vm.topInform(); */
                                    swal("", "保存成功", "success");
                                    setTimeout(function(){
                                        top.Dialog.close();//关闭弹窗
                                    },1000);
                                }else if ("exception" == data.result){
                                    showException("通知",data.exception);//显示异常
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
                    btn2:function () {
                        $("#showform").show();
                        $("#jiazai").hide();
                    },
                });
            }else{
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: "POST",
                    url: httpurl+'inform/'+vm.msg,
                    data: {
                        ID:vm.pd.ID,
                        TITLE:vm.pd.TITLE,
                        ATTACHMENT:vm.attachment,
                        INITIATOR:vm.pd.INITIATOR,
                        INITIATOR_NAME:vm.pd.INITIATOR_NAME,
                        TYPE:vm.TYPE,
                        GROUP:vm.pd.GROUP,
                        DEPARTMENT_ID:vm.pd.DEPARTMENT_ID,
                        CONTENT:vm.pd.CONTENT,
                        DRAFT:1,   //是否为草稿
                        tm:new Date().getTime()
                    },
                    dataType:"json",
                    success: function(data){
                        if("success" == data.result){
                            swal("", "保存成功", "success");
                            setTimeout(function(){
                                top.Dialog.close();//关闭弹窗
                            },1000);
                        }else if ("exception" == data.result){
                            showException("通知",data.exception);//显示异常
                            $("#showform").show();
                            $("#jiazai").hide();
                        }
                    }
                }).done().fail(function(){
                    swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                    $("#showform").show();
                    $("#jiazai").hide();
                });
            }
        },

        getTree:function(){
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl+'department/listTreeAll',
                data: {
                    tm:new Date().getTime(),
                    ID:this.ID
                },
                dataType:"json",
                success: function(data){
                    var setting = {
                        check: {
                            enable: true,
                            chkboxType : {
                                "Y" : "ps",
                                "N" : "ps",
                            }
                        },
                        data: {
                            simpleData: {
                                enable: true
                            },
                            key: {
                                url: "xUrl"
                            },
                        },
                        callback:{
                            onCheck: vm.setDId
                        },
                        showLine: true,

                    };
                    var zTreeNodes = eval(data.zTreeNodes);
                    zTree = $.fn.zTree.init($("#leftTree"), setting, zTreeNodes);
                }
            }).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                $("#showform").show();
                $("#jiazai").hide();
            });


        },

        getDepartmentIds:function(nodes){
            vm.pd.DEPARTMENT_ID='';
            $.each(nodes,function(pIndex,pEle){
                var res=0;
                if(pEle.children!=undefined&&pEle.children!=null&&pEle.children.length!=0){
                    $.each(pEle.children,function(cIndex,cEle){
                        if(!cEle.checked){
                            res=1;
                        }
                    });
                    if(res==0){
                        vm.pd.DEPARTMENT_ID+=(pEle.id+",");
                    }
                }else{
                    if(pEle.checked){
                        vm.pd.DEPARTMENT_ID+=(pEle.id+",");
                    }
                }
            });
            if(vm.pd.DEPARTMENT_ID!=null&&vm.pd.DEPARTMENT_ID!=''){
                vm.pd.DEPARTMENT_ID=vm.pd.DEPARTMENT_ID.substring(0,vm.pd.DEPARTMENT_ID.length-1);
            }
        },
        //根据主键ID获取数据
        getData: function(){
            //发送 post 请求
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl+'inform/goEdit',
                data: {ID:this.ID,tm:new Date().getTime()},
                dataType:"json",
                success: function(data){
                    if("success" == data.result){
                        vm.pd = data.pd;							//参数map
                        vm.attachment=data.pd.ATTACHMENT;
                        vm.TYPE=data.pd.TYPE;
                        $("#TYPE").val(vm.TYPE);
                        if(vm.attachment!=""){
                            vm.hasFile=true;
                        }
                        vm.apd=data.apd;
                        var ap=vm.apd;
                        if(ap!=null||ap!=undefined){
                            $.each(
                                ap,function (index,element) {
                                    var tr = $(['<tr id="upload-'+ index +'">'
                                        ,'<td>'+ element.ORIGINAL_NAME +'</td>'
                                        // ,'<td>'+ (file.size/1014).toFixed(1) +'kb</td>'
                                        ,'<td></td>'
                                        ,'<td>上传成功</td>'
                                        ,'<td>'
                                        ," <button class='layui-btn layui-btn-xs layui-btn-danger demo-delete' onclick='deleteFile("+element.ID+","+index+")'>删除</button>"
                                        ,'</td>'
                                        ,'</tr>'].join(''));
                                    $('#demoList').append(tr);
                                }
                            );
                        }


                    }else if ("exception" == data.result){
                        showException("通知",data.exception);	//显示异常
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

        getUser:function(){
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl+'inform/getUser',
                data: {tm:new Date().getTime()},
                dataType:"json",
                success: function(data){
                    if("success" == data.result){
                        vm.pd=data.pd;					//参数map
                    }else if ("exception" == data.result){
                        showException("通知",data.exception);	//显示异常
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
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl+'dictionaries/getLevelsByNameEn',
                data: {NAME_EN:'INFORM_TYPE',tm:new Date().getTime()},//请假类型
                dataType:'json',
                success: function(data){
                    $("#TYPE").html('<option value="">通知类型</option>');
                    $.each(data.list, function(i, dvar){
                        if(dvar.NAME==vm.TYPE){
                            $("#TYPE").append("<option value="+dvar.NAME+" selected>"+dvar.NAME+"</option>");
                        }
                        $("#TYPE").append("<option value="+dvar.NAME+">"+dvar.NAME+"</option>");
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

layui.use('upload', function() {
    var $ = layui.jquery
        , upload = layui.upload;
    var ids="";
    //多文件列表示例
    var demoListView = demoListView1=$('#demoList')
        ,uploadListIns = upload.render({
        url: httpurl+'/inform/attachmentLoad',
        elem: '#testList'
        ,accept: 'file',
        multiple: true
        ,auto: false
        ,bindAction: '#sub',
        size: "512000"
        ,choose: function(obj){
            var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
            //读取本地文件
            obj.preview(function(index, file, result){
                var tr = $(['<tr id="upload-'+ index +'">'
                    ,'<td>'+ file.name +'</td>'
                    ,'<td>'+ (file.size/1014).toFixed(1) +'kb</td>'
                    ,'<td>等待上传</td>'
                    ,'<td>'
                    ,'<button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>'
                    ,'<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>'
                    ,'</td>'
                    ,'</tr>'].join(''));

                //单个重传
                tr.find('.demo-reload').on('click', function(){
                    obj.upload(index, file);
                });

                //删除
                tr.find('.demo-delete').on('click', function(){
                    delete files[index]; //删除对应的文件
                    tr.remove();
                    uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                });

                demoListView.append(tr);
            });
        }
        ,done: function(res, index, upload){
            if(res.code == 0){ //上传成功
                var tr = demoListView.find('tr#upload-'+ index),
                    tds = tr.children();
                tds.eq(2).html('<span style="color: #5FB878;">上传成功</span>');
                // tds.eq(3).html('<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete" >删除</button>'); //清空操作
                tds.eq(3).html(" <button class='layui-btn layui-btn-xs layui-btn-danger demo-delete'  onclick='deleteFile("+res.ids+")'>删除</button>"); //清空操作   onclick='deleteFile("+res.ids+","+index+")'
                if(ids==""){
                    ids+=(res.ids);
                }else{
                    ids+=(","+res.ids);
                }
                return delete this.files[index]; //删除文件队列已经上传成功的文件
            }
            this.error(index, upload);
        },
        allDone:function (obj) {

            if(obj.aborted==0){
                parent.layer.msg("操作成功");
                if(vm.attachment==""||vm.attachment==undefined){
                    vm.attachment=ids;
                }else{
                    vm.attachment+=(","+ids);
                }
                vm.hasFile=true;
                console.log(vm.attachment);

            }
            if(obj.aborted!=0){
                var msg="有"+obj.aborted+"个图片上传失败";
                if(obj.aborted==0){
                    msg="出现错误";
                }
            }

        }
        ,error: function(index, upload){
            var tr = demoListView.find('tr#upload-'+ index)
                ,tds = tr.children();
            tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
            tds.eq(3).find('.demo-reload').removeClass('layui-hide'); //显示重传
        }
    });




});

function deleteFile(id) {
    $("#demoList").on('click', '.demo-delete', function () {
        var tr=$(this);

        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: "POST",
            url: httpurl+'inform/deleteFileById',
            data: {
                ID:id,
            },
            success: function(data){
                if("success" == data.result){
                    tr.closest('tr').remove();
                    var newatt=vm.attachment.split(",");
                    newatt=_.pull(newatt, id+'');
                    vm.attachment=_.join(newatt, [separator=','])
                }else if ("exception" == data.result){
                    showException("文章管理",data.exception);//显示异常
                }
            }
        }).done().fail(function(){
            swal("登录失效!", "请求服务器无响应，稍后再试", "warning");

        });

    });

    //删除

}

