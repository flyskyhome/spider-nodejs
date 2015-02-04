/**
 * js插件:选择日期
 * @module Datepicker
 */
! function($) {

    "use strict"; // jshint ;_;


    /* Datepicker CLASS DEFINITION
     * ==================== */

    /**
     * 日期选择组件，日期支持从 1901 -  2050 年
     * @class Datepicker
     * @constructor
     * @param {String} element jQuery dom 选择器
     */

    var Datepicker = function(element) {
        this.element = $(element)
    }

    Datepicker.prototype = {
        /**
         * Datepicker 实例
         * @property constructor
         * @type {Object}
         */
        constructor: Datepicker,
        /**
         * 创建日历
         * @method create
         * @param  {Object} options 配置信息
         * @param {String} options.placement 显示位置 bottom:下方,top:上方,left:左侧,right:右侧
         * @param {String} options.format 日期格式,目前还未支持,缺省:"yyyy-mm-dd"
         * @param {String} options.yearStr 显示年的文字
         * @param {String} options.monthStr 显示月的文字
         * @param {String} options.dayStr 显示日的文字
         * @param {Object} options.lunar 农历显示设置对象
         * @param {Boolean} options.lunar.enable 是否显示
         * @param {Boolean} options.lunar.showmon 是否显示完整月信息
         * @param {Object} options.holiday 节假日显示设置对象
         * @param {Boolean} options.holiday.enable 是否显示
         * @param {Array} options.holiday.lh 农历节假日列表 格式:["0115 元宵节"]
         * @param {Array} options.holiday.gh 阳历节假日列表 格式:["0214 情人节"]
         * @return {Object}         Datepicker
         * @chainable
         */
        create: function(options) {
            this.options = options || {};

            this.element.on("click", {
                dpObj: this
            }, this.pop);

            return this;
        },
        /**
         * 弹出日历显示框
         * @param  {Event} e Event对象
         * @event click
         * @private
         */
        pop: function(e) {
            var that = e.data.dpObj;
            var target = $(e.target);
            var sVal = target.val();

            var newDataInfo = that.parse2DateObj(sVal);
            var curDate = newDataInfo.dateObj;
            var status = newDataInfo.status;
            if (!status) {
                target.css("color", "#f00");
            } else {
                target.css("color", "");
            }

            var sHtml = that.getFullMonth(curDate);

            var popObj = target.data("popover");
            var isNotExists = popObj === undefined;
            // 判断是否还未创建过
            if (!isNotExists) {
                // 已创建过,先销毁,再显示
                target.popover("destroy");
                target.popover({
                    placement: that.options.placement,
                    html: true,
                    content: sHtml,
                    curdate: curDate
                });
            } else {
                // 未创建,先初始化,再显示
                target.popover({
                    placement: that.options.placement,
                    html: true,
                    content: sHtml,
                    curdate: curDate
                });
                target.trigger("click");
            }
            // 绑定显示完成之后的事件处理        
            target.off('shown').on('shown', function(e) {
                var popoverObj = target.next();
                // pop导航按钮列表
                var navObjList = popoverObj.find(".table-condensed thead a");
                // 绑定事件
                // 上一年                
                navObjList.eq(0).on("click", function(e) {
                    that.setNewCal("preYear");
                });
                // 上一月
                navObjList.eq(1).on("click", function(e) {
                    that.setNewCal("preMonth");
                });
                // 日期信息
                navObjList.eq(2).on("click", function(e) {
                    var tar = $(e.target);
                    var sYear = that.options.yearStr,
                        sMonth = that.options.monthStr;
                    /**
                     * 创建待显示的Html信息
                     * @method createShowHtml
                     * @private
                     * @param  {number} year  年
                     * @param  {number} month 月
                     * @return {String}       待显示的html信息
                     */
                    function createShowHtml(year, month) {
                        var StartYear = Math.floor(year / 10) * 10;
                        var sHtml = "<div class='container-fluid datepicker'>",
                            sYearHtml = "<div class='row-fluid datepicker-row'><div class='span1 datepicker-nav'><i class='icon-chevron-left'></i></div><div class='span10'><div class='row-fluid'><div class='span1'></div>",
                            sMonHtml = "<div class='row-fluid datepicker-row'>",
                            sBtnHtml = "<div class='row-fluid'><div class='span12'><hr><a class='btn btn-small'>确定</a> <a class='btn btn-small'>取消</a></div></div>";
                        // 生产月信息
                        for (var i = 1; i < 13; i++) {
                            if (month == i) {
                                sMonHtml += "<div class='span3 datepicker-active'>" + i + sMonth + "</div>";
                            } else {
                                sMonHtml += "<div class='span3'>" + i + sMonth + "</div>";
                            }
                            if (i % 4 == 0) {
                                if (i != 12) {
                                    sMonHtml += "</div><div class='row-fluid datepicker-row'>";
                                } else {
                                    sMonHtml += "</div>";
                                }
                            }
                        }
                        // 生产年信息
                        for (var i = 1; i < 11; i++) {
                            if (year == StartYear + i - 1) {
                                sYearHtml += "<div class='span2 datepicker-active'>" + (StartYear + i - 1) + "</div>";
                            } else {
                                sYearHtml += "<div class='span2'>" + (StartYear + i - 1) + "</div>";
                            }
                            if (i % 5 == 0) {
                                if (i != 10) {
                                    sYearHtml += "<div class='span1'></div></div><div class='row-fluid datepicker-row'><div class='span1'></div>";
                                } else {
                                    sYearHtml += "<div class='span1'></div></div>";
                                }
                            }
                        }
                        sYearHtml += "</div><div class='span1 datepicker-nav'><i class='icon-chevron-right'></i></div></div>";
                        sHtml += sMonHtml + sYearHtml + sBtnHtml + "</div>";
                        return sHtml;
                    }
                    /**
                     * 显示日月选择框
                     * @method showYearAndMon
                     * @private
                     * @return {[type]} [description]
                     */
                    function showYearAndMon() {
                        // 当前选中的年月信息
                        var sText = tar.text(),
                            // 年月的配置信息
                            ymList = sText.split(sYear);
                        ymList[1] = ymList[1].replace(sMonth, "");
                        var sHtml = createShowHtml(ymList[0], ymList[1]);
                        // 判断是否已有弹出信息
                        var pop = tar.data("popover");
                        var isNotExists = pop === undefined;
                        if (!isNotExists) {
                            tar.popover("destroy");
                            tar.popover({
                                placement: "bottom",
                                html: true,
                                content: sHtml
                            });
                        } else {
                            // 未创建,先初始化,再显示
                            tar.popover({
                                placement: "bottom",
                                html: true,
                                content: sHtml
                            });
                            tar.trigger("click");
                        }
                    }
                    showYearAndMon();
                    // 显示完成后的处理动作
                    tar.off('shown').on('shown', function(e) {
                        var tmpPop = tar.next();
                        // 月份处理部分
                        var monList = tmpPop.find(".datepicker-row .span3");
                        monList.on("click", function(e) {
                            monList.removeClass("datepicker-active");
                            $(e.target).addClass("datepicker-active");
                        })
                        // 年份处理部分
                        var yearList = tmpPop.find(".datepicker-row .span2");
                        yearList.on("click", function(e) {
                            yearList.removeClass("datepicker-active");
                            $(e.target).addClass("datepicker-active");
                        })
                        var navList = tmpPop.find("i");
                        // 向前导航
                        navList.first().on("click", function(e) {
                            $(e.target).parent().next().find(".span2").each(function(index, domEle) {
                                if ($(domEle).text() >= "1910") {
                                    $(domEle).text($(domEle).text() - 10);
                                }
                            })
                        });
                        // 向后导航
                        navList.last().on("click", function(e) {
                            $(e.target).parent().prev().find(".span2").each(function(index, domEle) {
                                if ($(domEle).text() < "2040") {
                                    $(domEle).text($(domEle).text() - 0 + 10);
                                }
                            })
                        })
                        // 按钮处理部分
                        var btnList = tmpPop.find(".btn");
                        // 确定按钮
                        btnList.first().on("click", function(e) {
                            var selectedItem = tmpPop.find(".datepicker-active");
                            var sTmpYear = selectedItem.last().text(),
                                sTmpMon = selectedItem.first().text();
                            tar.popover("hide");
                            that.setNewCal(sTmpYear + sYear + sTmpMon);
                        })
                        // 取消按钮
                        btnList.last().on("click", function(e) {
                            tar.popover("hide");
                        })
                    });
                });
                // 下一月
                navObjList.eq(3).on("click", function(e) {
                    that.setNewCal("nextMonth");
                });
                // 下一年
                navObjList.eq(4).on("click", function(e) {
                    that.setNewCal("nextYear");
                });
                popoverObj.find(".table-condensed tbody").delegate("td", "click", function(e) {
                    var target = $(e.target);
                    if (!target.hasClass("cd")) {
                        // 考虑到农历显示时问题，所以需要根据childNodes来获取第一个的数据
                        that.setSelectedVal(target[0].childNodes[0].nodeValue, target.attr("class")).hide();
                        //that.setSelectedVal(target.text(),target.attr("class")).hide();
                    }
                });
            })
        },
        /**
         * 转换2012-01-01 之类的日期 为日期对象
         * @method parse2DateObj
         * @private
         * @param  {String} sDate 日期字符串
         * @param  {String} sSign 日期分割符
         * @return {Object}       正确返回日期对象,不正确返回当天
         */
        parse2DateObj: function(sDate, sSign) {
            // 缺省分割为 "-"
            if (sSign == undefined) {
                sSign = "-";
            }

            var dateInfoArray = sDate.split(sSign);

            if (dateInfoArray.length == 3) {
                var iYear = parseInt(dateInfoArray[0], 10);
                var iMonth = parseInt(dateInfoArray[1], 10) - 1;
                var iDay = parseInt(dateInfoArray[2], 10);

                var date = new Date(iYear, iMonth, iDay, 0, 0, 0);

                return {
                    status: 1,
                    dateObj: date
                };
            } else {
                if (sDate == "") {
                    return {
                        status: 1,
                        dateObj: new Date()
                    };
                } else {
                    return {
                        status: 0,
                        dateObj: new Date()
                    };
                }
            }
        },
        /**
         * 获取当月天数
         * @method getNowMonthDays
         * @private
         * @param  {number} year  年份
         * @param  {number} month 月份：和js默认一样 是 0 - 11,-1:表示上一年12月
         * @return {number}       当月天数
         */
        getNowMonthDays: function(year, month) {
            return new Date(year, month + 1, 0).getDate()
        },
        /**
         * 获取该月一号是周几 ,周一为第一天,如果周日为第一天，则会返回值需加 1
         * @method getStartWeek
         * @private
         * @param  {Object} dateObj 日期对象
         * @return {number}         周几
         */
        getStartWeek: function(dateObj) {
            var tempnum = dateObj.getDate() % 7;
            var week = dateObj.getDay() + 1; //今天周几 
            var startweek = week + 7 - tempnum;
            return startweek > 7 ? startweek % 7 : startweek;
        },
        /**
         * 获取当天所处一年中的第几周
         * @method getWeekSn
         * @private
         * @param  {number} year  [description]
         * @param  {number} month [description]
         * @param  {number} day   [description]
         * @return {number}       当天所处一年中的第几周
         */
        getWeekSn: function(year, month, day) {
            if (month == -1) {
                year = year - 1;
                month = 11;
                return 0;
            }
            // 全年第一天
            var Y_firstDay = new Date(year, 0, 1);
            // 全年最后一天
            var Y_lastDay = new Date(year, 11, 31);
            // 第一天是周几
            var Y_f_week = Y_firstDay.getDay();
            // 最后一天是周几
            var Y_l_week = Y_lastDay.getDay();
            // 全年天数
            var fullDays = (Y_lastDay - Y_firstDay) / (3600 * 24 * 1000);
            // 按完整周算全年天数
            var fullDays4week = Y_f_week + (Y_lastDay - Y_firstDay) / (3600 * 24 * 1000) + (7 - Y_l_week - 1);

            var daySn = this.getDaySn(year, month, day);

            var weekSn = parseInt((daySn + Y_f_week) / 7);
            (daySn + Y_f_week) % 7 == 0 ? weekSn : ++weekSn;
            return weekSn;
        },
        /**
         * 获取是全年中的第几天
         * @method getDaySn
         * @private
         * @param  {number} year  年
         * @param  {number} month 月
         * @param  {number} day   日
         * @return {number}       第几天
         */
        getDaySn: function(year, month, day) {
            var thisDate = new Date(year, month, day);
            // 全年第一天
            var Y_firstDay = new Date(year, 0, 1);
            // 间隔天数
            return parseInt((thisDate - Y_firstDay) / (3600 * 24 * 1000));
        },
        /**
         * 获取月历的Html信息
         * @method getMonth
         * @private
         * @param  {Object} dateObj 日期对象
         * @return {String}         月历的html信息
         */
        getMonth: function(dateObj) {
            // 如果非日期对象，直接退出
            if (!dateObj) return;
            var year = dateObj.getFullYear();
            var month = dateObj.getMonth();
            var date = dateObj.getDate();

            var days = this.getNowMonthDays(year, month);

            var lastMonthDays = this.getNowMonthDays(year, month - 1);

            var startweek = this.getStartWeek(dateObj) + 1;

            var weekSn = this.getWeekSn(year, month - 1, lastMonthDays - startweek + 1 + 1) + 1;
            var html = "<tr>";
            var index = 0;
            var enableLunar = this.options.lunar.enable;
            var enableholiday = this.options.holiday.enable;
            var showmon = this.options.lunar.showmon;
            var tmpI;

            var sStyle = "",
                // 假日信息
                holidayStr = "",
                // 农历信息
                solarStr = "";

            for (var i = 1; i < startweek; i++) {
                if (i == 1) {
                    html += "<td class='muted cd'>" + weekSn + "</td>";
                    weekSn++;
                }
                tmpI = lastMonthDays - startweek + i + 1;

                holidayStr = enableholiday ? this.solarDay3(year, month - 1, tmpI, showmon) : "";
                holidayStr = holidayStr != "" ? " title='" + holidayStr + "'" : "";

                solarStr = enableLunar ? "<br/>" + this.getSolarDay(year, month - 1, tmpI, showmon) : "";

                solarStr = holidayStr != "" ? "*" + solarStr : solarStr;

                html += "<td class='muted p_month'" + holidayStr + ">" + tmpI + solarStr + "</td>";
                index++;
            }

            var sn = 0;

            for (var i = 1; i <= days; i++) {

                sStyle = i == date ? " style='background-color:#8d8d8d;color:#fff'" : "";

                holidayStr = enableholiday ? this.solarDay3(year, month, i, showmon) : "";
                holidayStr = holidayStr != "" ? " title='" + holidayStr + "'" : "";

                solarStr = enableLunar ? "<br/>" + this.getSolarDay(year, month, i, showmon) : "";
                solarStr = holidayStr != "" ? "*" + solarStr : solarStr;

                if (index % 7 == 0) {
                    html += "</tr><tr><td class='muted cd'>" + weekSn + "</td>";
                    weekSn++;
                    html += "<td class='text-error'" + sStyle + holidayStr + ">" + i + solarStr + "</td>";
                    sn++;
                } else {
                    // 这个月的第几周 ,已经过了几天 剩余的等于 6 则为周六
                    if (index - sn * 7 == 6) {
                        html += "<td class='text-error'" + sStyle + holidayStr + ">" + i + solarStr + "</td>";
                    } else {
                        html += "<td" + sStyle + holidayStr + ">" + i + solarStr + "</td>";
                    }
                }
                index++;
            }

            // 多补一周
            for (var i = 0; i < 14; i++) {
                if (index % 14 == 0) {
                    break;
                }
                if (index % 7 == 0) {
                    html += "</tr><tr><td class='muted cd'>" + weekSn + "</td>";
                }
                tmpI = i + 1;

                holidayStr = enableholiday ? this.solarDay3(year, month + 1, tmpI, showmon) : "";
                holidayStr = holidayStr != "" ? " title='" + holidayStr + "'" : "";

                solarStr = enableLunar ? "<br/>" + this.getSolarDay(year, month + 1, tmpI, showmon) : "";
                solarStr = holidayStr != "" ? "*" + solarStr : solarStr;

                html += "<td class='muted n_month'" + holidayStr + ">" + tmpI + solarStr + "</td>";
                index++;
            }
            html += "</tr>";
            return html;
        },
        /**
         * 获取完整的月历视图信息
         * @method getFullMonth
         * @private
         * @param  {Object} dateObj 某天的日期对象
         * @return {String}         完整月历视图的html信息
         */
        getFullMonth: function(dateObj) {
            var year = dateObj.getFullYear(),
                month = dateObj.getMonth(),
                day = dateObj.getDate(),
                sHtml = this.getMonth(dateObj),
                sYear = this.options.yearStr,
                sMonth = this.options.monthStr;

            sHtml = "<table class='table-condensed tc'><thead>" +
                (this.options.lunar.enable ? "<tr><td colspan='8' class='lunar'>" + this.solarDay2(year, month, day, 1) + "</td></tr>" : "") +
                "<tr><td colspan='8'><a class='mr15' href='#'><i class='icon-backward'></i></a><a class='mr15' href='#'><i class='icon-chevron-left'></i></a><a href='#'>" + year + sYear + (month + 1) + sMonth + "</a><a class='ml15' href='#'><i class='icon-chevron-right'></i></a><a class='ml15' href='#'><i class='icon-forward'></i></a></td></tr>" +
                "<tr style='border-bottom:1px solid #ccc'><td></td><td>周<br/>日</td><td>周<br/>一</td><td>周<br/>二</td><td>周<br/>三</td><td>周<br/>四</td><td>周<br/>五</td><td>周<br/>六</td></tr>" +
                "</thead><tbody class='cp'>" + sHtml + "</tbody></table>";

            return sHtml;
        },
        /**
         * 获取新的日期信息
         * @method getNewDateInfo]
         * @private
         * @param  {Object} dateObj 日期对象
         * @param  {string} type    类型:preYear:上年,preMonth:上月,nextMonth:下月,nextYear:下年
         * @return {Object}         包含年月日信息的对象
         */
        getNewDateInfo: function(dateObj, type) {
            var curYear = dateObj.getFullYear(),
                curMonth = dateObj.getMonth(),
                curDay = dateObj.getDate();

            switch (type) {
                case "preYear":
                    curYear == 1901 ? curYear : curYear--;
                    break;
                case "preMonth":
                    if (curMonth - 1 == -1) {
                        if (curYear > 1901) {
                            curMonth = 11;
                            curYear--;
                        }
                    } else {
                        curMonth--;
                    }
                    break;
                case "nextMonth":
                    if (curMonth + 1 == 12) {
                        if (curYear < 2050) {
                            curMonth = 0;
                            curYear++;
                        }
                    } else {
                        curMonth++;
                    }
                    break;
                case "nextYear":
                    curYear == 2050 ? curYear : curYear++;
                    break;
                default:
                    var ymList = type.split(this.options.yearStr);
                    // 如果送进来的type格式类似为 yyyy年mm月
                    if (ymList.length > 1) {
                        return {
                            year: ymList[0],
                            month: ymList[1].replace(this.options.monthStr, "") - 1,
                            day: curDay
                        }
                    } else {
                        return undefined;
                    }
            }

            return {
                year: curYear,
                month: curMonth,
                day: curDay
            };
        },
        /**
         * 设置信息的月历信息
         * @method setNewCal
         * @private
         * @param {String} type    更新类型:preYear:上年,preMonth:上月,nextMonth:下月,nextYear:下年
         * @return {Object}         Datepicker
         */
        setNewCal: function(type) {
            // 从缓存中获取当前日期
            var target = this.element,
                curDate = target.data("popover").options.curdate,
                // 获取新的日期信息
                newDateObj = this.getNewDateInfo(curDate, type);
            // 如果未能获取到日期对象,则直接返回，不做其他处理了
            if (!newDateObj) return;

            var curYear = newDateObj.year,
                curMonth = newDateObj.month,
                curDay = newDateObj.day;

            curDate = new Date(curYear, curMonth, curDay);
            var popoverObj = this.element.next();
            // pop导航按钮列表
            var navObjList = popoverObj.find(".table-condensed thead a");
            // pop的内容区域dom
            var popContent = popoverObj.find(".table-condensed tbody");

            target.data("popover").options.curdate = curDate;
            // 获取新日历信息
            var sTmpHtml = this.getMonth(curDate);

            popContent.html(sTmpHtml);
            // 更新月历文字信息
            var sYear = this.options.yearStr;
            var sMonth = this.options.monthStr;

            navObjList.eq(2).text(curYear + sYear + (curMonth + 1) + sMonth);
            //navObjList.parent()[0].childNodes[2].nodeValue=curYear+sYear+(curMonth+1)+sMonth;

            if (this.options.lunar.enable) {
                var lunarDom = popoverObj.find(".table-condensed .lunar");

                lunarDom.text(this.solarDay2(curYear, curMonth, curDay, 1));
            }

            return this;
        },
        /**
         * 设置选中值到输入框
         * @method setSelectedVal
         * @private
         * @param {Object} date      日期对象
         * @param {String} classInfo 被操作Dom对象的class信息
         * @return {Objcet} 弹出框popOver对象
         */
        setSelectedVal: function(date, classInfo) {
            date = date.replace("*", "");
            var target = this.element,
                curDate = target.data("popover").options.curdate,
                newDateObj,
                curYear = curDate.getFullYear(),
                curMonth = curDate.getMonth() + 1;

            if (classInfo) {
                if (classInfo.indexOf("p_month") >= 0) {
                    newDateObj = this.getNewDateInfo(curDate, "preMonth");
                } else if (classInfo.indexOf("n_month") >= 0) {
                    newDateObj = this.getNewDateInfo(curDate, "nextMonth");
                }
            }

            if (newDateObj) {
                curYear = newDateObj.year;
                curMonth = newDateObj.month + 1;
            }

            this.element.val(curYear + "-" + (curMonth < 10 ? "0" + curMonth : curMonth) + "-" + (date < 10 ? "0" + date : date));

            return target.data("popover");
        },
        /**
         * 算出农历, 传入日期物件, 传回农历日期物件 ,该物件属性有 .year:农历年份,.month:农历月份,.day:农历日期,.isLeap:是否闰年:.yearCyl .dayCyl .monCyl
         * @method Lunar
         * @private
         * @param {Object} objDate 日期对象
         * @return {Objcet} 农历日期对象
         */
        Lunar: function(objDate) {
            var i, leap = 0,
                temp = 0
            var baseDate = new Date(1900, 0, 31)
            var offset = (objDate - baseDate) / 86400000
            var lunarObj = {};

            lunarObj["dayCyl"] = offset + 40
            lunarObj["monCyl"] = 14

            for (i = 1900; i < 2050 && offset > 0; i++) {
                temp = lYearDays(i)
                offset -= temp
                lunarObj["monCyl"] += 12
            }
            if (offset < 0) {
                offset += temp;
                i--;
                lunarObj["monCyl"] -= 12
            }

            lunarObj["year"] = i
            lunarObj["yearCyl"] = i - 1864

            leap = leapMonth(i) //闰哪个月 
            lunarObj["isLeap"] = false

            for (i = 1; i < 13 && offset > 0; i++) {
                //闰月 
                if (leap > 0 && i == (leap + 1) && lunarObj["isLeap"] == false) {
                    --i;
                    lunarObj["isLeap"] = true;
                    temp = leapDays(lunarObj["year"]);
                } else {
                    temp = monthDays(lunarObj["year"], i);
                }

                //解除闰月 
                if (lunarObj["isLeap"] == true && i == (leap + 1))
                    lunarObj["isLeap"] = false

                offset -= temp
                if (lunarObj["isLeap"] == false)
                    lunarObj["monCyl"]++
            }

            if (offset == 0 && leap > 0 && i == leap + 1)
                if (lunarObj["isLeap"]) {
                    lunarObj["isLeap"] = false;
                } else {
                    lunarObj["isLeap"] = true;
                    --i;
                    --lunarObj["monCyl"];
                }

            if (offset < 0) {
                offset += temp;
                --i;
                --lunarObj["monCyl"];
            }

            lunarObj["month"] = i
            lunarObj["day"] = offset + 1
            return lunarObj;
        },
        /**
         * 显示农历信息
         * @method cDay
         * @private
         * @param  {number} m 月
         * @param  {number} d 年
         * @param {Boolean} showmon 显示月份信息,缺省false
         * @return {String}   农历信息串
         */
        cDay: function(m, d, showmon, isleap) {
            var nStr1 = new Array('日', '正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二');
            var nStr2 = new Array('初', '十', '廿', '卅', '　');

            showmon ? "" : showmon = false;
            // 是否显示完整月份？ 是(是否是闰月) 否(是否是闰月)
            var s = showmon ? (isleap ? "闰" : "") + nStr1[m] + "月" : (d == 1 ? (isleap ? "闰" : "") + nStr1[m] + "月" : "");
            switch (d) {
                case 10:
                    s += '初十';
                    break;
                case 20:
                    s += '二十';
                    break;
                case 30:
                    s += '三十';
                    break;
                default:
                    s += nStr2[Math.floor(d / 10)];
                    s += d % 10 == 1 ? "一" : nStr1[d % 10];
            }
            return (s);
        },
        /**
         * 获取农历信息
         * @method getSolarDay
         * @private
         * @param  {number} year  年
         * @param  {number} month 月
         * @param  {number} day   日
         * @return {String}       农历信息
         */
        getSolarDay: function(year, month, day, showmon) {
            var sDObj = new Date(year, month, day);
            var lDObj = this.Lunar(sDObj);
            //农历BB'+(cld[d].isLeap?'闰 ':' ')+cld[d].lMonth+' 月 '+cld[d].lDay+' 日 
            return this.cDay(lDObj.month, lDObj.day, showmon, lDObj.isLeap);
        },
        /**
         * 显示农历年月日
         * @method solarDay2
         * @private
         * @param  {number} year  年
         * @param  {number} month 月
         * @param  {number} day   日
         * @return {String}       农历年月日信息
         */
        solarDay2: function(year, month, day, showmon) {
            var sDObj = new Date(year, month, day);
            var lDObj = this.Lunar(sDObj);
            var tt = '农历' + this.cDay(lDObj.month, lDObj.day, showmon, lDObj.isLeap);
            return tt;
        },
        /**
         * 显示节假日和节气信息
         * @method solarDay3
         * @private
         * @param  {number} year  年
         * @param  {number} month 月
         * @param  {number} day   日
         * @return {String}       农历年月日信息
         */
        solarDay3: function(year, month, day) {
            var lFtv = new Array("0101*春节", "0115 元宵节", "0505 端午节", "0707 七夕情人节", "0715 中元节", "0815 中秋节", "0909 重阳节", "1208 腊八节", "1224 小年", "0100*除夕")

            var sFtv = new Array("0101*元旦", "0214 情人节", "0308 妇女节", "0312 植树节", "0315 消费者权益日", "0401 愚人节", "0501 劳动节", "0504 青年节", "0512 护士节", "0601 儿童节", "0701 建党节 香港回归纪念", "0801 建军节", "0808 父亲节", "0909 南晟网周年纪念日", "0910 教师节", "0928 孔子诞辰", "1001*国庆节", "1006 老人节", "1024 联合国日", "1112 孙中山诞辰", "1220 澳门回归纪念", "1225 圣诞节", "1226 毛主席诞辰")

            this.options.holiday && this.options.holiday.gh && (sFtv = sFtv.concat(this.options.holiday.gh));
            this.options.holiday && this.options.holiday.lh && (lFtv = lFtv.concat(this.options.holiday.lh));

            var sDObj = new Date(year, month, day);
            var lDObj = this.Lunar(sDObj);
            var lDPOS = new Array(3)
            var festival = '',
                solarTerms = '',
                solarFestival = '',
                lunarFestival = '',
                tmp1, tmp2;
            //农历节日 ,是和农历比
            for (var i in lFtv)
                if (lFtv[i].match(/^(\d{2})(.{2})([\s\*])(.+)$/)) {
                    tmp1 = Number(RegExp.$1) - lDObj.month
                    tmp2 = Number(RegExp.$2) - lDObj.day
                    if (tmp1 == 0 && tmp2 == 0)
                        lunarFestival = RegExp.$4
                }

                //国历节日 
            for (var i in sFtv)
                if (sFtv[i].match(/^(\d{2})(\d{2})([\s\*])(.+)$/)) {
                    tmp1 = Number(RegExp.$1) - (month + 1)
                    tmp2 = Number(RegExp.$2) - day
                    if (tmp1 == 0 && tmp2 == 0)
                        solarFestival = RegExp.$4
                }
                //节气 
            solarTerms = this.solarDay4(year, month, day);

            if (solarTerms == '' && solarFestival == '' && lunarFestival == '')
                festival = '';
            else
                festival = solarTerms + ' ' + solarFestival + ' ' + lunarFestival;

            var cl = '<font color="#000066" STYLE="font-size:9pt;">';
            return (festival);
        },
        /**
         * 获取某一天的节气信息
         * @method solarDay4
         * @private
         * @param  {number} year  年
         * @param  {number} month 月
         * @param  {number} day   日
         * @return {String}       节气名称
         */
        solarDay4: function(year, month, day) {

            var solarTerm = new Array("小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至")

            var solarTermBase = new Array(4, 19, 3, 18, 4, 19, 4, 19, 4, 20, 4, 20, 6, 22, 6, 22, 6, 22, 7, 22, 6, 21, 6, 21);

            var solarTermIdx = '0123415341536789:;<9:=<>:=1>?012@015@015@015AB78CDE8CD=1FD01GH01GH01IH01IJ0KLMN;LMBEOPDQRST0RUH0RVH0RWH0RWM0XYMNZ[MB\\]PT^_ST`_WH`_WH`_WM`_WM`aYMbc[Mde]Sfe]gfh_gih_Wih_WjhaWjka[jkl[jmn]ope]qph_qrh_sth_W';
            var solarTermOS = '211122112122112121222211221122122222212222222221222122222232222222222222222233223232223232222222322222112122112121222211222122222222222222222222322222112122112121222111211122122222212221222221221122122222222222222222222223222232222232222222222222112122112121122111211122122122212221222221221122122222222222222221211122112122212221222211222122222232222232222222222222112122112121111111222222112121112121111111222222111121112121111111211122112122112121122111222212111121111121111111111122112122112121122111211122112122212221222221222211111121111121111111222111111121111111111111111122112121112121111111222111111111111111111111111122111121112121111111221122122222212221222221222111011111111111111111111122111121111121111111211122112122112121122211221111011111101111111111111112111121111121111111211122112122112221222211221111011111101111111110111111111121111111111111111122112121112121122111111011111121111111111111111011111111112111111111111011111111111111111111221111011111101110111110111011011111111111111111221111011011101110111110111011011111101111111111211111001011101110111110110011011111101111111111211111001011001010111110110011011111101111111110211111001011001010111100110011011011101110111110211111001011001010011100110011001011101110111110211111001010001010011000100011001011001010111110111111001010001010011000111111111111111111111111100011001011001010111100111111001010001010000000111111000010000010000000100011001011001010011100110011001011001110111110100011001010001010011000110011001011001010111110111100000010000000000000000011001010001010011000111100000000000000000000000011001010001010000000111000000000000000000000000011001010000010000000';

            var result = "";

            for (var i = month * 2; i < (month + 1) * 2; i++) {
                if (sTerm(year, i) == day) {
                    result = solarTerm[i];
                    break;
                }
            }

            return result;
            /**
             * 获取某年的第n个节气为几号
             * @param  {number} y 年
             * @param  {number} n 第n个,从0小寒开始算起
             * @return {number}   几号
             */
            function sTerm(y, n) {
                return (solarTermBase[n] + Math.floor(solarTermOS.charAt((Math.floor(solarTermIdx.charCodeAt(y - 1900)) - 48) * 24 + n)));
            }
        }
    }


    /* DatePicker PLUGIN DEFINITION
     * ===================== */

    var old = $.fn.datepicker

    $.fn.datepicker = function(option, param) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data('datepicker'),
                params = $.extend({}, $.fn.datepicker.defaults, typeof param == "object" && param);

            if (!data) $this.data('datepicker', (data = new Datepicker(this)))
            if (typeof option == 'string') data[option](params);
        })
    }

    /**
     * 缺省参数
     * @type {Object}
     */
    $.fn.datepicker.defaults = {
        // 日期显示格式
        format: "yyyy-mm-dd",
        yearStr: "年",
        monthStr: "月",
        dayStr: "日",
        placement: "bottom",
        lunar: {
            enable: false,
            // 在日历里面显示完整的月份信息,true:显示,false:只在每月初一显示月份信息
            showMon: false
        },
        holiday: {
            enable: false
        }
    }

    $.fn.datepicker.Constructor = Datepicker


    /* CAL NO CONFLICT
     * =============== */

    $.fn.datepicker.noConflict = function() {
        $.fn.datepicker = old
        return this
    }

    /* CAL DATA-API
     * ============ */
    /**
     * data-api 接口
     * @event click.datepicker.data-api
     * @param {Object} e 事件对象
     */

    $(document).on('click.datepicker.data-api', '[data-toggle="datepicker"]', function(e) {

        var $this = $(this),
            href = $this.attr('href'),
            $targetList = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))),
            option, $target, iCount = $targetList.length; //strip for ie7

        e.preventDefault();

        for (var i = 0; i < iCount; i++) {
            $target = $($targetList[i]);
            option = $target.data('datepicker') ? 'create' : $.extend($target.data(), $this.data());
            $target.datepicker('create', option);
        }

    });

}(window.jQuery);

var lunarInfo = new Array(
    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
    0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
    0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0)

var Animals = new Array("鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪");
var Gan = new Array("甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸");
var Zhi = new Array("子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥");
var now = new Date();

var SY = now.getFullYear();
var SM = now.getMonth();
var SD = now.getDate();

//==== 传入 offset 传回干支, 0=甲子 
function cyclical(num) {
    return (Gan[num % 10] + Zhi[num % 12])
}

//==== 传回农历 y年的总天数 
function lYearDays(y) {
    var i, sum = 348
    for (i = 0x8000; i > 0x8; i >>= 1)
        sum += (lunarInfo[y - 1900] & i) ? 1 : 0
    return (sum + leapDays(y))
}

//==== 传回农历 y年闰月的天数 
function leapDays(y) {
    if (leapMonth(y))
        return ((lunarInfo[y - 1900] & 0x10000) ? 30 : 29)
    else
        return (0)
}

//==== 传回农历 y年闰哪个月 1-12 , 没闰传回 0 
function leapMonth(y) {
    return (lunarInfo[y - 1900] & 0xf)
}

//====================================== 传回农历 y年m月的总天数 
function monthDays(y, m) {
    return ((lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29)
}

function YYMMDD() {
    var cl = '<font color="#0000df" STYLE="font-size:9pt;">';
    if (now.getDay() == 0)
        cl = '<font color="#c00000" STYLE="font-size:9pt;">';
    if (now.getDay() == 6)
        cl = '<font color="#00c000" STYLE="font-size:9pt;">';
    return (cl + SY + '年' + (SM + 1) + '月' + SD + '日</font>');
}

function weekday() {
    var day = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
    var cl = '<font color="#000000" STYLE="font-size:9pt;">';
    if (now.getDay() == 0)
        cl = '<font color="#ff0000" STYLE="font-size:9pt;">';
    if (now.getDay() == 6)
        cl = '<font color="#ff0000" STYLE="font-size:9pt;">';
    return (cl + day[now.getDay()] + '</font>');
}