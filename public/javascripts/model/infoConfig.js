(function() {
    var infoConfig = {
        dataStore: {
            treeObj: {},
            editIndex: "",
            //数据获取网页链接
            ajaxUrl: ""
        },
        /**
         * 初始化
         * @return {[type]} [description]
         */
        init: function() {
            this.initSocket();
            this.initTree();
            this.initGrid();
            this.dataStore.ajaxUrl = location.protocol + "//" + location.host + "/config";
            this.initEvent();
        },
        initSocket: function() {
            var that = this;
            this.socket = io.connect('/');
            this.socket.on('message', function(data) {
                data = JSON.parse(data);
                $('#messages').append('<div class="' + data.type + '">' + data.message +
                    '</div>');
            });
            this.socket.on('grap', function(res) {
                switch (res.type) {
                    case "msg":
                        $('#messages').append('<div class="' + res.type + '">' + res.message + '</div>');
                        break;
                    case "res":
                        var list_errList = res.infoObj.list_errList,
                            iCount = list_errList.length,
                            sHtml = "";
                        for (var i = 0; i < iCount; i++) {
                            sHtml += "<tr><td>" + list_errList[i].type + "</td><td>" + list_errList[i].url + "</td><td>" + list_errList[i].reseaon + "</td></tr>";
                        }
                        $("#tbGrapResult tbody").html(sHtml);
                        break;
                }
            });
        },
        /**
         * 初始化分类树
         * @return {[type]} [description]
         */
        initTree: function() {
            var that = this;
            var setting = {
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "_id"
                    }
                },
                callback: {
                    onRightClick: function(event, treeId, treeNode) {
                        that.dataStore.treeObj.selectNode(treeNode);
                        $('#mm_p').menu('show', {
                            left: event.clientX,
                            top: event.clientY
                        });
                    },
                    onClick: function(event, treeId, treeNode, clickFlag) {
                        var sSite = treeNode.site;
                        var gridObj = that.dataStore.gridObj;
                        //如果存在站点信息，则获取该站点下相关配置的网址信息
                        if (sSite) {
                            var param = {
                                type: "site",
                                site: sSite
                            };
                            that.SendAjaxReq4Json(sUrl, param, function(dataInfo) {
                                if (dataInfo.state == "ok") {
                                    gridObj.datagrid('loadData', {
                                        total: dataInfo.objList.length,
                                        rows: dataInfo.objList
                                    });
                                } else {
                                    alert(dataInfo.msg);
                                }
                            }, function(msgInfo) {
                                var s = msgInfo;
                            });
                        }
                        //如果非站点节点点击，则清空右边的网址信息
                        else {
                            gridObj.datagrid('loadData', []);
                        }
                    }
                }
            };
            //获取分类信息
            var sUrl = location.protocol + "//" + location.host + "/config",
                param = {
                    type: "cate"
                };

            this.SendAjaxReq4Json(sUrl, param, sucFunc, errFunc);

            function sucFunc(dataInfo) {
                if (dataInfo.state == "ok") {
                    exp.ztreeHelper.initTree('cateTree', setting, dataInfo.objList);
                    that.dataStore.treeObj = exp.ztreeHelper.getTreeObj('cateTree');
                } else {
                    alert(dataInfo.msg);
                }
            }

            function errFunc(msgInfo) {
                var s = msgInfo;
            }
        },
        initEvent: function() {
            var that = this;
            $(".grap").live("click", function(e) {
                var urlList = [],
                    dom = $(e.target),
                    sUrl = dom.attr("_id"),
                    sSrc = dom.attr("src"),
                    sRemark = dom.attr("remark");

                var urlObj = {
                    url: sUrl,
                    src: sSrc,
                    remark: sRemark
                };
                urlList.push(urlObj);
                that.grap(urlList);
            });
        },
        /**
         * 新增分类
         */
        addCate: function() {
            this.operCate("add");
        },
        /**
         * 修改分类
         * @return {[type]} [description]
         */
        modCate: function() {
            this.operCate("mod");
        },
        /**
         * 删除分类
         * @return {[type]} [description]
         */
        delCate: function() {
            var that = this,
                treeObj = this.dataStore.treeObj,
                nodes = treeObj.getSelectedNodes(),
                node;
            if (nodes.length > 0) {
                node = nodes[0];
            } else {
                return;
            }

            $.dialog({
                title: "删除确认",
                content: "真的要删除该分类吗?",
                ok: function() {
                    //获取分类信息
                    var sUrl = location.protocol + "//" + location.host + "/config",
                        param = {
                            type: "removeCate",
                            nodeObj: {
                                _id: node._id
                            }
                        };
                    that.SendAjaxReq4Json(sUrl, param, sucFunc, errFunc);
                    return true;
                },
                width: 229,
                height: 60,
                okVal: "确认",
                cancelVal: "取消",
                cancel: true,
                min: 0,
                max: 0,
                resize: 0
            });

            function sucFunc(dataInfo) {
                if (dataInfo.state == "ok") {
                    treeObj.removeNode(node);
                    alert("删除成功");
                } else {
                    alert(dataInfo.msg);
                }
            }

            function errFunc(msgInfo) {
                var s = msgInfo;
            }
        },
        /**
         * 分类操作
         * @param  {[type]} type 'add':新增,'mod':修改
         * @return {[type]}      [description]
         */
        operCate: function(type) {
            var that = this,
                treeObj = this.dataStore.treeObj,
                nodes = treeObj.getSelectedNodes(),
                node,
                newNode;
            //看是否有节点选中
            if (nodes.length > 0) {
                node = nodes[0];
            } else {
                return;
            }
            //获取分类信息
            var sUrl = location.protocol + "//" + location.host + "/config",
                param = {
                    type: "saveCate"
                };

            var sTypeName = type == "add" ? "新增分类" : "修改分类",
                sName = type == "add" ? "" : " value='" + node.name + "'",
                sHref = type == "add" ? "" : " value='" + node.site + "'",
                sContent = "<div style='margin:5px'><span style='margin-right:15px'>名称:</span><input style='width:300px' type='text' id='inpName' " + sName + "></div>" +
                "<div style='margin:5px'><span style='margin-right:15px'>网址:</span><input style='width:300px' type='text' id='inpHref' " + sHref + "></div>";
            //跳出对话框
            $.dialog({
                title: sTypeName,
                content: sContent,
                ok: function() {
                    var sCateName = $("#inpName").val(),
                        sSiteUrl = $("#inpHref").val();
                    //alert(sCateName);
                    if (sCateName) {
                        if (type == "add") {
                            var sId = that.guidGenerator();
                            newNode = {
                                _id: sId,
                                pId: node._id,
                                name: sCateName,
                                site: sSiteUrl,
                                isParent: sSiteUrl ? false : true
                            };
                        } else if (type == "mod") {
                            node.name = sCateName;
                            node.site = sSiteUrl;
                            node.isParent = sSiteUrl ? false : true;
                            newNode = {
                                _id: node._id,
                                pId: node.pId,
                                name: sCateName,
                                site: sSiteUrl,
                                isParent: sSiteUrl ? false : true
                            };
                        }
                        param.nodeObj = newNode;
                        //发送请求到服务器端，进行数据库操作
                        that.SendAjaxReq4Json(sUrl, param, sucFunc, errFunc);
                        return true;
                    } else {
                        alert("请输入分类名称");
                        return false;
                    }
                },
                width: 400,
                height: 60,
                okVal: "保存",
                cancelVal: "关闭",
                cancel: true,
                min: 0,
                max: 0,
                resize: 0,
                lock: 1
            });

            function sucFunc(dataInfo) {
                //数据库操作成功后修改树节点信息
                if (dataInfo.state == "ok") {
                    if (type == "add") {
                        treeObj.addNodes(node, dataInfo.nodeObj);
                    } else if (type == "mod") {
                        node.name = dataInfo.nodeObj.name;
                        treeObj.updateNode(node);
                    }
                } else {
                    alert(dataInfo.msg);
                }
            }

            function errFunc(msgInfo) {
                var s = msgInfo;
            }
        },
        initGrid: function() {
            var that = this;
            var colList = [{
                field: 'ck',
                checkbox: true
            }, {
                field: 'src',
                title: '频道',
                width: 100,
                sortable: true,
                //align: 'center',
                editor: 'text'
            }, {
                field: '_id',
                title: '网址',
                width: 360,
                sortable: true,
                //align: 'center',
                editor: 'text'
            }, {
                field: 'remark',
                title: '属性',
                sortable: true,
                width: 200,
                //align: 'center',
                editor: 'text'
            }, {
                field: 'oper',
                title: '操作',
                sortable: true,
                width: 200,
                //align: 'center',
                editor: 'text',
                formatter: function(value, row, index) {
                    var sResult = "";
                    if (row._id) {
                        sResult = "<a href='#' class='grap' _id='" + row._id + "' src='" + row.src + "' remark='" + row.remark + "'>采集</a>";
                        return sResult;
                    } else {
                        return value;
                    }
                }
            }, {
                field: 'site',
                hidden: 1
            }];

            var toolbarList = [{
                text: '新增',
                iconCls: 'icon-add',
                disabled: false,
                handler: function() {
                    var nodeList = that.dataStore.treeObj.getSelectedNodes();
                    if (nodeList.length > 0) {
                        if (nodeList[0].site) {
                            that.showEditWin('add', nodeList[0].site);
                        } else {
                            alert("非网站节点不允许添加网址！");
                        }
                    } else {
                        alert("请选择分类！");
                    }
                    return;
                }
            }, {
                text: '修改',
                iconCls: 'icon-edit',
                disabled: false,
                handler: function() {
                    that.showEditWin('mod');
                }
            }, {
                text: '删除',
                iconCls: 'icon-remove',
                disabled: false,
                handler: function() {
                    var gridObj = that.dataStore.gridObj,
                        sUrl = that.dataStore.ajaxUrl,
                        checkedList = gridObj.datagrid('getChecked'),
                        iCount = checkedList.length,
                        objList = [];

                    for (var i = 0; i < iCount; i++) {
                        objList.push({
                            _id: checkedList[i]._id
                        });
                    }

                    var param = {
                        type: "removeSite",
                        objList: checkedList
                    };

                    that.SendAjaxReq4Json(sUrl, param, function(dataInfo) {
                        if (dataInfo.state == "ok") {
                            for (var i = iCount - 1; i >= 0; i--) {
                                var index = gridObj.datagrid('getRowIndex', checkedList[i]);
                                gridObj.datagrid('deleteRow', index);
                            }
                        } else {
                            alert(dataInfo.msge);
                        }
                    }, function(msgInfo) {

                    });
                }
            }];

            this.dataStore.gridObj = $('#siteInfo').datagrid({
                //checkOnSelect:false,
                selectOnCheck: false,
                nowrap: true,
                striped: true,
                //pageSize: 1,
                //pageList: [100, 80, 60, 40, 20, 10,1],
                //pagination: true,
                idField: '_id',
                columns: [colList],
                rownumbers: true,
                singleSelect: true,
                toolbar: toolbarList,
                onClickRow: function(index) {
                },
                onDblClickRow: function(index, row) {
                    that.showEditWin('mod');
                }
            });
        },
        endEditing: function() {
            var that = this;
            if (that.dataStore.editIndex == undefined) {
                return true;
            }
            var gridObj = that.dataStore.gridObj;
            if (gridObj.datagrid('validateRow', that.dataStore.editIndex)) {
                gridObj.datagrid('endEdit', that.dataStore.editIndex);
                that.dataStore.editIndex = undefined;
                return true;
            } else {
                return false;
            }
        },
        showEditWin: function(operType, siteUrl) {
            var that = this,
                sTypeName = "",
                sSrc = "",
                sHref = "",
                sSite = siteUrl ? siteUrl : "",
                sRemark = "",
                sContent = "",
                sDisabled = "";

            if (operType == "add") {
                sTypeName = "新增配置信息";
                sRemark = "<select style='width:300px' id='selRemark'><option value='宏观'>宏观</option><option value='行业'>行业</option><option value='证券' selected>证券</option></select>";
            } else {
                sTypeName = "修改配置信息";
                sDisabled = "disabled='disabled'";
                var gridObj = this.dataStore.gridObj;
                var selectedRow = gridObj.datagrid('getSelected');
                if (selectedRow) {
                    sSite = selectedRow.site;
                    sSrc = "value='" + selectedRow.src + "'";
                    sHref = "value='" + selectedRow._id + "'";
                    sRemark = "<select style='width:300px' id='selRemark'><option value='宏观'>宏观</option><option value='行业'>行业</option><option value='证券'>证券</option></select>";
                    var sTmpReg = "/^(.*?)('" + selectedRow.remark + "')(.*)$/";
                    sRemark = sRemark.replace(eval(sTmpReg), "$1$2 selected $3");
                } else {
                    alert("请选择需要修改的对象");
                    return;
                }
            }
            sContent = "<div style='margin:5px'><span style='margin-right:15px'>频道:</span><input style='width:300px' type='text' id='inpSrc' " + sSrc + "></div>" +
                "<div style='margin:5px'><span style='margin-right:15px'>网址:</span><input " + sDisabled + " style='width:300px' type='text' id='inpHref' " + sHref + "></div>" +
                "<div style='margin:5px'><span style='margin-right: 15px;'>属性:</span>" + sRemark + "</div>";

            $.dialog({
                title: sTypeName,
                content: sContent,
                ok: function() {
                    var nodeList = that.dataStore.treeObj.getSelectedNodes(),
                        sSrc = $("#inpSrc").val(),
                        sHref = $("#inpHref").val(),
                        sRemark = $("#selRemark").val(),
                        param = {},
                        sSiteName = "";
                    //判断添加的网址是否是属于这个网站的，是允许添加，不是不允许添加
                    if (sHref.indexOf(sSite) >= 0) {
                        var sUrl = location.protocol + "//" + location.host + "/config";
                        //判断是否都填全了
                        if (sSrc && sHref && sRemark) {
                            if (nodeList.length > 0) {
                                sSiteName = nodeList[0].name;
                            }
                            param = {
                                type: "saveSite",
                                objInfo: {
                                    _id: sHref,
                                    src: sSrc,
                                    remark: sRemark,
                                    site: sSite,
                                    siteName: sSiteName
                                }
                            };
                            //发送请求到服务器端，进行数据库操作
                            that.SendAjaxReq4Json(sUrl, param, sucFunc, errFunc);
                            return true;
                        } else {
                            alert("请完善未填项！");
                            return false;
                        }
                    } else {
                        alert("您当前添加的网址并不属于该网站!");
                        return false;
                    }
                },
                width: 400,
                height: 60,
                okVal: "保存",
                cancelVal: "关闭",
                cancel: true,
                min: 0,
                max: 0,
                resize: 0,
                lock: 1
            });

            function sucFunc(dataInfo) {
                //数据库操作成功后修改树节点信息
                if (dataInfo.state == "ok") {
                    var gridObj = that.dataStore.gridObj;
                    if (operType == "add") {
                        gridObj.datagrid('appendRow', dataInfo.objInfo);
                    } else if (operType == "mod") {
                        var selectedRow = gridObj.datagrid('getSelected');
                        var index = gridObj.datagrid('getRowIndex', selectedRow);
                        gridObj.datagrid('updateRow', {
                            index: index,
                            row: dataInfo.objInfo
                        });
                    }
                } else {
                    alert(dataInfo.msg);
                }
            }

            function errFunc(msgInfo) {
                var s = msgInfo;
            }
        },
        grap: function(urlList) {
            var param = {
                urlList: urlList
            };

            this.socket.emit('grap', param);
        }
    };

    exp.ModObj = infoConfig;

})();

window.ModObj = imp(["genTools", "getDataTools", "dataTools", "ModObj"]);

$(function() {
    ModObj.init();
});