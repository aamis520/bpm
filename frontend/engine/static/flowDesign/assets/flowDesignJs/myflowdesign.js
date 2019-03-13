$(function () {
  jsPlumb.bind("ready",function () {

    //保存当前选中的label的id
    //使用curLabelId的地方比较多，所以置顶声明
    var curLabelId = '';

    var defaults = {
      Scope:'',
      drawData:{},
      fnClick:function () {
        console.log('click');
      },
      fnDblClick:function () {
        console.log("dblclick")
      },
      fnRepeat:function () {
        console.log("连线重复");
      },
      mtAfterDrop:function (param) {
        console.log('连线成功之后调用');
      },
      // 画布右键点击
      canvasMenus : {
        "one": function(t) {console.log('画面右键')}
      },
      // 步骤右键点击
      processMenus: {
        "one": function(t) {console.log('步骤右键')}
      },
      /*右键菜单样式*/
      menuStyle: {
        border: '1px solid #5a6377',
        minWidth:'150px',
        padding:'5px 0'
      },
      itemStyle: {
        fontFamily : 'verdana',
        color: '#333',
        border: '0',
        padding:'5px 15px 5px 20px'
      },
      itemHoverStyle: {
        border: '0',
        color: '#fff',
        backgroundColor: '#5a6377'
      },
      //节点、连线、label的样式
      anchorStyle:{
        border:"1px solid #ccc"
      },
      anchorHoverStyle:{
        border:"1px solid #f00"
      },
      //向前线的样式
      forwardConnectorStyle:{
        lineWidth:2,
        strokeStyle:"#0ff",
        joinstyle:"round"
      },
      //返回线的样式
      backwardConnectorStyle:{
        lineWidth:2,
        strokeStyle:"#f00",
        joinstyle:"round"
      },
      connectorHoverStyle:{
        lineWidth:2,
        strokeStyle:"#f0f"
      },
      labelStyle:{
        zIndex:10,
        background:"#ffff00"
      },
      labelHoverStyle:{
        zIndex:10,
        background:"#df1523"
      }
    };

    var aConnections = [];
    function setConnections(conn,remove) {
      if(remove != true){
        //这里为添加连线动作
        aConnections.push(conn);
      }else{
        //删除连线动作
        var idx = -1;
        for(var i = 0;i < aConnections.length; i++){
          if(aConnections[i] == conn){
            idx = i;
            break;
          }
        }
        if(idx != -1){
          aConnections.splice(idx,1);
        }
      }
      if(aConnections.length > 0){
        var s = '';
        for(var j = 0; j < aConnections.length; j++){
          var from = aConnections[j].sourceId;
          var target = aConnections[j].targetId;
          var type = aConnections[j].endpoints[0].connectorClass;
          s = s + "<input type='hidden' sourceid='"+from+"' targetid='"+target+"' lineType='"+type+"'>";
        }
        $('#process_info_div').html(s);
      }else{
        $('#process_info_div').html('');
      }
      // jsPlumb.repaintEverything();//重画
    }

    //type为forward/backward,这里是回显数据调用的连线样式
    function initEndposintsData(type) {
      if(type == "forward"){
        $(".node-flag-forward").each(function (idx,ele) {
          var parent = $(ele).parent();
          jsPlumb.makeSource($(ele),{
            parent:parent,
            anchor:"Continuous",
            deleteEndpointsOnDetach:false,
            endpoint:["Dot",{radius:1}],
            connector:["Flowchart",{stub:[5,5]}],
            connectorClass:"forward",
            connectorStyle:defaults.forwardConnectorStyle,
            hoverPaintStyle:defaults.connectorHoverStyle,
            dragOptions:{_type:"forward"},
            maxConnections:-1
          })
        })
      }else if(type == "backward"){
        $(".node-flag-forward").each(function (idx,ele) {
          var parent = $(ele).parent();
          jsPlumb.makeSource($(ele),{
            parent:parent,
            anchor:"Continuous",
            deleteEndpointsOnDetach:false,
            endpoint:["Dot",{radius:1}],
            connector:["Flowchart",{stub:[5,5]}],
            connectorClass:"backward",
            connectorStyle:defaults.backwardConnectorStyle,
            hoverPaintStyle:defaults.connectorHoverStyle,
            dragOptions:{},
            maxConnections:-1
          })
        })
      }
    }

    //这是新建连线调用的链接线的样式
    function initEndposints() {
      $(".node-flag-forward").each(function (idx,ele) {
        var _parent = $(ele).parent();
        jsPlumb.makeSource($(ele),{
          parent:_parent,
          anchor:"Continuous",
          deleteEndpointsOnDetach:false,
          endpoint:["Dot",{radius:1}],
          connector:["Flowchart",{stub:[5,5]}],
          connectorClass:"forward",
          connectorStyle:defaults.forwardConnectorStyle,
          hoverPaintStyle:defaults.connectorHoverStyle,
          dragOptions:{},
          maxConnections:-1,
          //makeSource中需要用connectorOverlays实现Overlays
          connectorOverlays:[
            ["Arrow",{location:1}],
            ["Label",{
              label:"未设置条件",
              location:0.3,
              id:"",
              cssClass:"aLabel aLabelData"+new Date().getTime(),
              hoverClass:"",
              events:{
                "click":function(label,ev){
                  curLabelId = ev.target.id;
                  var conditionId = $('#'+ev.target.id).attr("conditionid");
                  if(!conditionId){
                    conditionId = "empty";
                  }
                  var messageconditionId =  $('#'+ev.target.id).attr("messageconditionid");
                  if(!messageconditionId){
                    messageconditionId = "empty";
                  }
                  var _flowid = $("#" + _scope).find("input.flowid").val();
                  var _scope = _parent.attr("scope");
                  if(_scope == "mainDiv_1"){
                    _flowid = getUrlParam("flowid")
                  }
                  var toParentVue = {};
                  var priority = $("#"+ev.target.id).attr("priority");
                  toParentVue.conditionId = conditionId;
                  toParentVue.priority = priority;
                  toParentVue.isConditionModalShow = true;
                  toParentVue.messageconditionId = messageconditionId;
                  toParentVue.messageflowid = _flowid;
                  parent.postMessage(
                    toParentVue,
                    '*'
                  )
                }
              }
            }]
          ]
        })
      });
      $(".node-flag-backward").each(function (idx,ele) {
        var _parent = $(ele).parent();
        jsPlumb.makeSource($(ele),{
          parent:_parent,
          anchor:"Continuous",
          deleteEndpointsOnDetach:false,
          endpoint:["Dot",{radius:1}],
          connector:["Flowchart",{stub:[5,5]}],
          connectorClass:"backward",
          connectorStyle:defaults.backwardConnectorStyle,
          hoverPaintStyle:defaults.connectorHoverStyle,
          dragOptions:{},
          maxConnections:-1,
          connectorOverlays:[
            ["Arrow",{location:1}],
            ["Label",{
              label:"未设置",
              location:0.3,
              id:"",
              cssClass:"aLabel aLabelData"+new Date().getTime(),
              hoverClass:"",
              events:{
                "click":function(label,ev){
                  curLabelId = ev.target.id;
                  var _scope = _parent.attr("scope");
                  var _flowid = $("#" + _scope).find("input.flowid").val();
                  if(_scope == "mainDiv_1"){
                    _flowid = getUrlParam("flowid")
                  }

                  var reversemessageconditionid = $('#'+ev.target.id).attr("reversemessageconditionid");
                  if(!reversemessageconditionid){
                    reversemessageconditionid = "empty";
                  }

                  var toParentVue = {};
                  toParentVue.reversemessageconditionid = reversemessageconditionid;
                  toParentVue.reversemessageconditionflowid = _flowid;
                  toParentVue.isReverseConditionModalShow = true;
                  parent.postMessage(
                    toParentVue,
                    '*'
                  )
                }
              }
            }]
          ]
        })
      })
    }


    $.fn.flowDesign = function (options) {
      var _canvas = $(this);
      //保存当前右键点击选中的元素的id
      // var _input = "<input type='hidden' id='active_id' value='0'>";
      var _input = $("#active_id");
      var _process_info_div = "<div id='process_info_div' style='display: none;'></div>";
      _canvas.append(_process_info_div);
      //替换默认参数及函数
      $.each(options,function (key,val) {
        if(typeof val == "object"  && defaults[key]){
          $.extend(defaults[key],val)
        }else{
          defaults[key] = val;
        }
      });

      // 画布点击右键
      var contextmenu = {
        bindings: defaults.canvasMenus,
        menuStyle : defaults.menuStyle,
        itemStyle : defaults.itemStyle,
        itemHoverStyle : defaults.itemHoverStyle
      };
      $(this).contextMenu('canvasMenu',contextmenu);

      //定义覆盖物的样式
      jsPlumb.importDefaults({
        DragOptions:{cursor:"pointer"},
        EndpointStyle:{fillStyle:"#225588"},
        Endpoint:["Dot",{radius:1}],
        Anchor:"Continuous",
        ConnectorZIndex:5,
        HoverPaintStyle:defaults.connectorHoverStyle
      });

      //接收由vue传过来的信息,有条件的id,描述,优先级
      window.addEventListener("message",function(ev){
        var _priority = ev.data.priority ? ev.data.priority : 0;
        var _desc = ev.data.desc ? ev.data.desc : "";
        var _conditionid = ev.data.conditionid;
        if(ev.data.conditionid){
          $("#"+curLabelId).html(_priority + '.' + _desc);
          $("#"+curLabelId).attr("conditionid",_conditionid);
          $("#"+curLabelId).attr("priority",_priority)
        }
        // 这是通知人员的条件信息id
        if(ev.data.messageconditionid){
          $("#"+curLabelId).attr("messageconditionid",ev.data.messageconditionid);
        }
      });

      // 接收由vue传过来的信息，有反向条件的id
      window.addEventListener("message",function (ev) {
          if(ev.data.reversemessageconditionid){
            $("#"+curLabelId).html("已设置")
            $("#" + curLabelId).attr("messageconditionid",ev.data.reversemessageconditionid)
          }

      });

      //ie9以下，用VML画图
      if( $.support.msie && $.support.version < '9.0' ){
        jsPlumb.setRenderMode(jsPlumb.VML);
      } else { //其他浏览器用SVG
        jsPlumb.setRenderMode(jsPlumb.SVG);
      }

      // 初始化anchor
      var drawData = defaults.drawData;
      if(drawData && drawData.nodeList){
        $.each(drawData.nodeList,function (idx,node) {
          var anchorDiv = document.createElement('div');
          var anchorId = node.id;
          var _usrs = "";
          if(node.usrsid){
            _usrs = node.usrsid.toString();
          }
          var _groups = "";
          if(node.groupsid) {
             _groups = node.usrsid.toString();
          }
          var _apartments = "";
          if(node.apartmentsid){
            _apartments = node.apartmentsid.toString();
          }
          var _page = "";
          if(node.page){
            _page = node.page;
          }
          var personStatus = "未选择";
          if( (node.usrsid && node.usrsid.length > 0) || (node.apartmentsid && node.apartmentsid.length > 0) || (node.groupsid && node.groupsid.length > 0) ){
            personStatus = "已选择";
          }
          var isAdmin = false;
          if(node.isAdmin){
              isAdmin = node.isAdmin;
          }
          var endnodeconditionid = "";
          if(node.endConditionID){
            endnodeconditionid = node.endConditionID;
          }
          if(!node.nodeDesc || node.nodeDesc == "undifined"){
            node.nodeDesc = ''
          }
          if(!node.nodeName || node.nodeName == "undifined"){
            node.nodeName = ''
          }
          $(anchorDiv).attr("id",anchorId)
            .attr("class","node-step")
            .attr("nodeid",node.nodeid)
            .attr("scope",defaults.Scope)
            .attr("targetid","")
            .attr("nodetype","")
            .attr("endnodeconditionid",endnodeconditionid)
            .attr("style","position:absolute;"+node.style)
            .html("<a class='node-flag-backward badge badge-info'>&times;</a>" +
              "<img src='"+node.img+"' width='50' height='50'>" +
              "<a class='node-flag-forward badge badge-info'>&times;</a>" +
              "<p class='nodeID' page='"+_page+"'>节点ID：<span>"+node.nodeid+"</span></p>" +
              "<p class='nodeName'>节点名称：<span>"+node.nodeName+"</span></p>" +
              "<p class='nodeDesc'>节点描述：<span>"+node.nodeDesc+"</span></p>"+
              "<p class='nodeperson' usrs='"+_usrs+"' groups='"+_groups+"' apartments='"+_apartments+"' isadmin='"+isAdmin+"'>人员：<span>"+personStatus+"</span></p>"
            ).mousedown(function (e) {
              if(e.which == 3){
                $("#active_id").val(node.id);
                contextmenu.bindings = defaults.processMenus;
                $(this).contextMenu("processMenu",contextmenu);

                //只有自动审批节点，显示设置自动审批的右键菜单选项
                if($("#"+node.id).attr("nodetype") != "autocheck"){
                  $("#addAutoCheckCondition").css("display","none")
                }else{
                  $("#addAutoCheckCondition").css("display","block");
                }

                // 只有结束节点显示结束节点赋值条件
                if($("#" + node.id).attr("nodetype") != "end"){
                    $("#addEndNodeCondition").css("display","none");
                    $("#addNodePages").css("display","block");
                    $("#addPersons").css("display","block");
                }else{
                    $("#addEndNodeCondition").css("display","block");
                    $("#addNodePages").css("display","none");
                    $("#addPersons").css("display","none");
                }
              }
            });

          if(node.type){
            $(anchorDiv).attr("nodetype",node.type)
          }

          if(node.autocheckID){
            $(anchorDiv).attr("autocheckmsgid",node.autocheckID)
          }
          _canvas.append(anchorDiv)
        })
      }

      if(drawData && drawData.flowList && drawData.flowList.length > 0){
        $.each(drawData.flowList,function (idx,flow) {
          var CurId = _canvas.find("#"+flow.sourceId);
          if(CurId) {
            CurId.attr("sourceid", flow.sourceId);
            //判断当前有无targetId节点，没有的话，加上一个节点属性
            if (CurId.attr("targetid") == "") {
              CurId.attr("targetid", flow.targetId);
            }
            //如果新加入的节点属性已存在，return；不存在，加入进去
            if(CurId.attr("targetid")){
              if (!CurId.attr("targetid").match(flow.targetId)) {
                CurId.attr("targetid", CurId.attr("targetid") + "," + flow.targetId)
              }

              if(flow.type == "forward"){
                if(typeof CurId.attr("obverse") == "undefined"){
                  CurId.attr("obverse",flow.targetId)
                    .attr("reverse","");
                }
                if(! CurId.attr("obverse").match(flow.targetId)){
                  CurId.attr("obverse",CurId.attr("obverse")+","+flow.targetId)
                    .attr("reverse","");
                }
              }

              if(flow.type == "backward"){
                if(typeof CurId.attr("reverse") == "undefined"){
                  CurId.attr("reverse",flow.targetId)
                    .attr("obverse","");
                }
                if(! CurId.attr("reverse").match(flow.targetId)){
                  CurId.attr("reverse",CurId.attr("reverse")+","+flow.targetId)
                    .attr("obverse","");
                }
              }
            };
          }
        })
      }

      // 给anchor绑定事件
      var timer = null;
      $("#mainDiv").on('click','.node-step',function () {
        $("#active_id").val($(this).attr("id"));
        clearTimeout(timer);
        timer = setTimeout(defaults.fnClick,300);
      }).on("dblclick",function () {
        clearTimeout(timer);
        defaults.fnDblClick();
      });

      //使anchor可以拖动
      jsPlumb.draggable(jsPlumb.getSelector(".node-step"));

      //绑定添加连线动作   并做记录
      jsPlumb.bind("jsPlumbConnection",function (info) {
        setConnections(info.connection);
      });

      // 绑定删除连线动作，并做记录
      jsPlumb.bind("jsPlumbConnectionDetached",function (info) {
        setConnections(info.connection,true);
      });

      //绑定删除连线确认动作

      jsPlumb.bind("dblclick",function (c) {
        if(confirm("确定取消连线吗?")){
          jsPlumb.detach(c)
        }
      });

       initEndposints();
      //连线成功的回调函数
      function mtAfterDrop(param) {
        defaults.mtAfterDrop({
          sourceId:$("#"+param.sourceId).attr('sourceId'),
          targetId:$("#"+param.targetId).attr('targetId')
        });
      }

      jsPlumb.makeTarget(jsPlumb.getSelector(".node-step"),{
        dropOptions:{ hoverClass:"hover", activeClass:"active" },
        anchor:"Continuous",
        maxConnections:-1,
        endpoint:[ "Dot", { radius:1 } ],
        paintStyle:{ fillStyle:"#ec912a",radius:1 },
        hoverPaintStyle:this.connectorHoverStyle,
        allowLoopback:false,
        beforeDrop:function (params) { //这里必须return true;不 return 或者return false将不会画线
          if(params.sourceId == params.targetId){
            alert("不能连接自己 ");
            return false;
          }
          var j = 0;
          $("#process_info_div").find("input").each(function (i) {
            var str = $("#"+params.sourceId).attr("sourceId") + ','
              + $("#"+params.targetId).attr("targetId");
            if(params.sourceId == $(this).attr("sourceid") && params.targetId == $(this).attr("targetid")){
              j++;
              return;
            }
          });

          if(j > 0){
            defaults.fnRepeat();
            return false;
          }else{
            mtAfterDrop(params);
            return true;
          }
          return true;   //暂时先返回true
        }

      });

      //回显数据,链接关联的步骤,同时创建label并显示其内容和添加事件
      var _canvas_design = function () {
        if(_canvas.find(".node-step").length > 0){
          _canvas.find(".node-step").each(function () {
            var sourceId = $(this).attr("sourceId");
            var targetId = $(this).attr("targetId");
            var obverse = $(this).attr("obverse");
            var reverse = $(this).attr("reverse");

            if(obverse){
              var obverse_arr = obverse.split(",");
            }
            if(reverse){
              var reverse_arr = reverse.split(",");
            }
            if(targetId){
              var targetId_arr= targetId.split(",");
            }
            var drawData = defaults.drawData;

            //targetId可能是多个，但sourceId只能有一个
            if(targetId_arr){
              $.each(targetId_arr,function (idx,targetId) {
                var conditionID = "";
                var overlayHtml = "未设置";
                //保存的时候用的正则/aLabelData[0-9]*/
                var overlayClass = "aLabelData"+new Date().getTime();

                var messageconditionID = "";
                if(targetId != '' && targetId != 0){
                  var isSource = false,
                      isTarget = false,
                      isObverse = false,
                      isReverse = false;
                  $.each(drawData.flowList,function (i,row) {

                    if(row.sourceId == sourceId){
                      isSource = true;
                    }
                    if(targetId == row.targetId){
                      isTarget = true;
                    }

                    if(row.sourceId == sourceId && targetId == row.targetId){
                      if(drawData.flowList[i].type == "forward"){
                        isObverse = true;
                      }else if(drawData.flowList[i].type == "backward"){
                        isReverse = true;
                      }
                      conditionID = row.conditions.conditionID;
                      overlayHtml = row.conditions.overlayHtml;
                      priority = row.conditions.priority;

                      messageconditionID = row.messageID;

                    }
                  });

                  if(isSource && isTarget && isObverse ){

                    initEndposintsData("forward");
                    jsPlumb.connect({
                      source:sourceId,
                      target:targetId,
                      overlays:[
                        ["Arrow",{location:1}],
                        ["Label",{
                          label:overlayHtml,
                          location:0.3,
                          id:"",
                          cssClass:"aLabel "+overlayClass,
                          hoverClass:"",
                          events:{
                            "click":function(label,ev){
                              curLabelId = ev.target.id;
                              var conditionId = $('#'+ev.target.id).attr("conditionid");
                              if(!conditionId){
                                conditionId = "empty";
                              }
                              var messageconditionId =  $('#'+ev.target.id).attr("messageconditionid");
                              if(!messageconditionId){
                                messageconditionId = "empty";
                              }
                              var _scope = $("#" + sourceId).attr("scope");
                              var _flowid = _canvas.find("input.flowid").val();
                              if(_scope == "mainDiv_1" ){
                                _flowid = getUrlParam("flowid");
                              }
                              var toParentVue = {};
                              var priority = $("#"+ev.target.id).attr("priority");
                              toParentVue.conditionId = conditionId;
                              toParentVue.priority = priority;
                              toParentVue.isConditionModalShow = true;
                              toParentVue.messageconditionId = messageconditionId;
                              toParentVue.messageflowid = _flowid;
                                parent.postMessage(
                                toParentVue,
                                '*'
                              )
                            }
                          }
                        }]
                      ]
                    });

                    if(conditionID){
                      $("."+overlayClass).attr("conditionid",conditionID);
                    }
                    if(priority){
                      $("."+overlayClass).attr("priority",priority)
                    }
                    if(messageconditionID){
                      $("."+overlayClass).attr("messageconditionid",messageconditionID);
                    }
                  }

                  if(isSource && isTarget &&  isReverse ){
                    initEndposintsData("backward");
                    jsPlumb.connect({
                      source:sourceId,
                      target:targetId,
                      overlays:[
                        ["Arrow",{location:1}],
                        ["Label",{
                          label:overlayHtml,
                          location:0.3,
                          id:"",
                          cssClass:"aLabel "+overlayClass,
                          hoverClass:"",
                          events:{
                            "click":function(label,ev){
                              curLabelId = ev.target.id;
                              var _scope = $("#" + sourceId).attr("scope");

                              var _flowid = _canvas.find("input.flowid").val();
                              if(_scope == "mainDiv_1" ){
                                _flowid = getUrlParam("flowid");
                              }

                              var messageconditionid =  $('#'+ev.target.id).attr("messageconditionid");
                              if(!messageconditionid){
                                messageconditionid = "empty";
                              }
                              var toParentVue = {};
                              toParentVue.isReverseConditionModalShow = true;
                              toParentVue.reversemessageconditionid = messageconditionid;
                              toParentVue.reversemessageconditionflowid = _flowid;
                              parent.postMessage(
                                toParentVue,
                                '*'
                              )
                            }
                          }
                        }]
                      ]
                    });
                    if(conditionID){
                      _canvas.find("."+overlayClass).attr("conditionid",conditionID);
                    }
                    if(priority){
                      _canvas.find("."+overlayClass).attr("priority",priority)
                    }
                    if(messageconditionID){
                      $("."+overlayClass).attr("messageconditionID",messageconditionID);
                      $("."+overlayClass).html("已设置")
                    }
                  }
                }
              })
            }
          })
        }
      };
      _canvas_design();

      //获取当前url参数
      function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return decodeURI(r[2]); return null; //返回参数值
      }

      //调用
      var flowDesign = {
        changeNodeId:function (oldid,newid) {
            jsPlumb.setId(oldid,newid);
        },
        addNode:function (row) {
          if(!row.id){
            return false;
          }
          var nodeDiv = document.createElement("div");
          var nodeId = row.id;
          var nodetype = row.nodetype;
          $(nodeDiv).attr("id",nodeId)
            .attr("sourceId",nodeId)
            .attr("targetId","")
            .attr("nodeid","")
            .attr("nodetype",nodetype)
            .attr("scope",defaults.Scope)
            .attr("endnodeconditionid","")
            .attr("style","position:absolute;"+row.style)
            .addClass("node-step")
            .html("<a class='node-flag-backward badge badge-info' id=''>&times;</a>" +
              "<img src='"+row.img+"' width='50' height='50'>" +
              "<a class='node-flag-forward badge badge-info' id=''>&times;</a>" +
              "<p class='nodeID' page=''>节点ID：<i style='font-style: normal;'>未设置</i></p>" +
              "<p class='nodeName'>节点名称：<i style='font-style: normal;'>未设置</i></p>" +
              "<p class='nodeDesc'>节点描述：<i style='font-style: normal;'>未设置</i></p> "+
              "<p class='nodeperson' usrs='' groups='' apartments='' isadmin='false'>人员：<span>未选择</span></p>")
            .mousedown(function (e) {
              if(e.which == 3){
                $("#active_id").val(nodeId);
                contextmenu.bindings = defaults.processMenus;
                $(this).contextMenu("processMenu",contextmenu);

                //只有自动审批节点，显示设置自动审批的右键菜单选项
                if($("#"+nodeId).attr("nodetype") != "autocheck"){
                  $("#addAutoCheckCondition").css("display","none")
                }else{
                  $("#addAutoCheckCondition").css("display","block");
                }

                // 只有结束节点显示结束节点赋值条件,结束节点不可设置人员，不可配置页面
                if($("#" + nodeId).attr("nodetype") != "end"){
                  $("#addEndNodeCondition").css("display","none");
                  $("#addnodepages").css("display","block");
                  $("#addPersons").css("display","block");
                }else{
                  $("#addEndNodeCondition").css("display","block");
                  $("#addnodepages").css("display","none");
                  $("#addPersons").css("display","none");
                }
              }
            });
          _canvas.append(nodeDiv);
          jsPlumb.draggable(jsPlumb.getSelector(".node-step"));

          initEndposints();

          jsPlumb.makeTarget(jsPlumb.getSelector("#"+_canvas.attr("id")+" .node-step"),{
            dropOptions:{ hoverClass:"hover", activeClass:"active" },
            anchor:"Continuous",
            maxConnections:-1,
            endpoint:[ "Dot", { radius:1 } ],
            paintStyle:{ fillStyle:"#ec912a",radius:1 },
            hoverPaintStyle:this.connectorHoverStyle,
            beforeDrop:function (params) {
              if(params.sourceId == params.targetId){
                alert("不能连接自己");
                return false;
              }
              var j = 0;
              $("#process_info_div").find("input").each(function (i) {
                if(params.sourceId == $(this).attr("sourceid") && params.targetId == $(this).attr("targetid")){
                  j++;
                  return;
                }
              });
              if(j > 0){
                defaults.fnRepeat();
                return false;
              }else{
                mtAfterDrop(params);
                return true;
              }
            }
          })
        },

        delNode:function (activeId) {
          if(activeId < 0){
            return false;
          }
          $("#"+activeId).remove();
          jsPlumb.deleteEndpoint(activeId);
          return true;
        },

        getDesignInfo:function (_scope) {
          var allData = {};//所有数据
          var aDrawData = {};//UI数据
          var judgeData = {};//判断数据，和只有子流程才有的数据
          aDrawData["flowTotal"] = "0";
          aDrawData["nodeTotal"] =  _canvas.find("div.node-step").length;
          aDrawData["flowList"] = [];
          aDrawData["nodeList"] = [];
          var nodesData = [];//节点数据
          var flowsData = [];//流程链接数据

          var _flowname = "";
          if(_canvas.find("input.flowname").val()){
             _flowname = _canvas.find("input.flowname").val();
          }

          var _flowdesc = "";
          if(_canvas.find("input.flowdesc").val()){
             _flowdesc = _canvas.find("input.flowdesc").val();
          }

          // 这里主要是针对子流程，主流程永远用update方式，主流程一直能拿到flowid
          // 子流程能拿到flowid，走update，拿不到走create
          var _flowid = "";
          if(_canvas.find("input.flowid").val() ){
              _flowid = _canvas.find("input.flowid").val();
          }

          var _flowtype = "";
          if(_canvas.find("input.flowtype").val()){
              _flowtype = _canvas.find("input.flowtype").val();
          }


          // 这是判断子流程的数据
          judgeData.flowdesc = _flowdesc;
          judgeData.flowname = _flowname;
          judgeData.flowid = _flowid;
          judgeData.flowtype = _flowtype;

          //这里保存的是节点的数据
          _canvas.find("div.node-step").each(function (i) {
            if($(this).attr("id")){
              var pId = $(this).attr("id");
              var nodeid = $(this).attr("nodeid");
              var pLeft = $(this).css("left");
              var pTop = $(this).css("top");
              var pImg = $(this).find("img").attr("src");
              var pNodeName = $(this).find(".nodeName>span").text();
              var pNodeDesc = $(this).find('.nodeDesc>span').text();
              var usrinfo = $(this).find(".nodeperson").attr("id");
              var nodetype = $(this).attr("nodetype");
              var autocheckid = $(this).attr("autocheckmsgid");
              var usrs = $(this).find(".nodeperson").attr("usrs");
              var apartments = $(this).find(".nodeperson").attr("apartments");
              var groups = $(this).find(".nodeperson").attr("groups");
              var isAdmin = $(this).find(".nodeperson").attr("isadmin");
              var page = $(this).find(".nodeID").attr("page");
              var endNodeConditionid = '';
              if(nodetype == "end"){
                endNodeConditionid = $(this).attr("endnodeconditionid");
              }
              var usrsArr = [];
              if(usrs){
                 usrsArr = usrs.split(",");
              }
              var groupsArr = [];
              if(groups){
                  groupsArr = groups.split(",");
              }
              var apartmentsArr = [];
              if(apartments){
                  apartmentsArr = apartments.split(",");
              }

              // 这是节点UI
              var nodeFlowObj = {
                id:pId,
                img:pImg,
                nodeName:pNodeName,
                nodeDesc:pNodeDesc,
                nodeid:nodeid,
                type:nodetype,
                isAdmin:isAdmin,
                usrsid:usrsArr,
                groupsid:groupsArr,
                apartmentsid:apartmentsArr,
                page:page,
                style:"left:"+pLeft+";top:"+pTop+";"
              };

              if(nodetype == "end"){
                nodeFlowObj["endConditionID"] = endNodeConditionid;
              }

              // 这是节点数据
              var nodeDataObj = {
                nodeid:nodeid,
                name:pNodeName,
                desc:pNodeDesc,
                isAdmin:isAdmin,
                usrid:usrsArr,
                groupid:groupsArr,
                apartmentid:apartmentsArr,
                type:nodetype,
                page:page
              };

              if(nodetype == "end"){
                nodeDataObj["endConditionID"] = endNodeConditionid;
              }

              if(nodetype == "autocheck" && autocheckid){
                nodeDataObj["autocheckID"] = autocheckid;
                nodeFlowObj["autocheckID"] = autocheckid;
              }
              //保存UI
              aDrawData["nodeList"].push(nodeFlowObj);
              //保存数据
              nodesData.push(nodeDataObj);
            }
          });

          //获取所有的连接线，条件也在其中，消息的条件id也在其中
          var _allConnections = jsPlumb.getAllConnections();

          // 这是没判断属于哪个流程下的链接，条件也在其中
          var allConnections = _allConnections.jsPlumb_DefaultScope;

          // 这里获取到的是当前流程下的连接线，条件也在其中
          var scopeConnections = [];
          if(allConnections) {
            for (var i = 0; i < allConnections.length; i++) {
              var sourceid = allConnections[i].sourceId;
              var scope = $("#" + sourceid).attr("scope");
              if (scope == _scope) {
                scopeConnections.push(allConnections[i])
              }
            }
          }
          //scopeConnections，即为有链接线，为undefined，则没有链接线
          if(scopeConnections) {
            aDrawData["flowTotal"] = scopeConnections.length;

            for (var i = 0, _length = scopeConnections.length; i < _length; i++) {
              //这俩是UI的id
              var sourceId = scopeConnections[i].sourceId;
              var targetId = scopeConnections[i].targetId;
              var type = scopeConnections[i].endpoints[0].connectorClass;
              var _overlayId = scopeConnections[i].overlays[1].canvas.id;
              var conditionId = '';
              if($("#" + _overlayId).attr("conditionId")){
                  conditionId = $("#" + _overlayId).attr("conditionId")
              };

              var overlayClasses = $("#" + _overlayId).attr("class");

              // todo：这里最好是取overlay的id，但设置不上，就用了class
              //这里取到的class为_jsPlumb_overlay aLabel aLabelData1499148319991，可能有_jsPlumb_hover
              //需要找出aLabelData1499148319991
              var reg = /aLabelData[0-9]*/;
              var overlayClass = overlayClasses.match(reg)[0];
              var overlayHtml = $("#" + _overlayId).html();
              var _priority = $("#" + _overlayId).attr("priority");

              // 这是消息的id
              var _messageconditionid = $("#" + _overlayId).attr("messageconditionid");

              //这里是保存UI
              var flowObj = {};
              flowObj.type = type;
              if(_flowdesc){
                flowObj.desc = _flowdesc;
              }
              if(_flowname){
                flowObj.name = _flowname;
              }
              flowObj.sourceId = sourceId;
              flowObj.targetId = targetId;
              flowObj.conditions = {};
              flowObj.conditions.conditionID = "";
              if (conditionId) {
                flowObj.conditions.conditionID = conditionId;
              }
              if(_priority){
                flowObj.conditions.priority = _priority;
              }
              flowObj.messageID = "";
              if(_messageconditionid){
                flowObj.messageID = _messageconditionid;
              }

              flowObj.conditions.conditionID = conditionId;
              flowObj.conditions.overlayHtml = overlayHtml;
              flowObj.conditions.overlayClass = overlayClass;
              aDrawData["flowList"].push(flowObj);

              //这里是保存数据
              var flowDataObj = {};
              var _start = $("#" + sourceId).attr("nodeid");
              var _end = $("#" + targetId).attr("nodeid");

              flowDataObj.conditions = {};
              flowDataObj.conditions.conditionID = '';
              if (conditionId) {
                flowDataObj.conditions.conditionID = conditionId;
              }
              flowDataObj.messageID = "";
              if(_messageconditionid){
                flowDataObj.messageID = _messageconditionid;
              }

              flowDataObj.start = _start;
              flowDataObj.end = _end;
              flowDataObj.priority = _priority;
              flowDataObj.type = type;
              flowsData.push(flowDataObj);
            }
          }

          allData.judgeData = judgeData;
          allData.flowsData = flowsData;
          allData.flowview = aDrawData;
          allData.nodesData = nodesData;
          return JSON.stringify(allData);
        }
      };
      return flowDesign;
    }
  })
})
