/**
 * js插件:区域分割
 * @module Splitter
 */

!(function($) {

  "use strict"; // jshint ;_;
  /**
   * 分割区域发生改变时触发
   * @event onresize
   * @param {Object} ev  回调参数
   * @param {Object} ev.A  区域A对象
   * @param {Number} ev.A.height 区域A的高度
   * @param {Number} ev.A.width 区域A的宽度
   * @param {Object} ev.B 区域B对象
   * @param {Number} ev.B.height 区域B的高度
   * @param {Number} ev.B.width 区域B的宽度
   */

  /**
   * @class Splitter
   * @constructor
   * @param {String} element jQuery dom 选择器
   */ 
  
  var Splitter = function(element) {
      this.element = $(element)
    }

  /**
   * splitter 计数器
   * @property splitterCounter
   * @final
   */
  var splitterCounter = 0;
  
  Splitter.prototype = {
    /**
     * Splitter的一个实例
     * @property constructor
     * @type {Object}
     */   
    constructor: Splitter,
    /**
     * Splitter 创建函数
     * @method create
     * @param {Object} options 组件配置
     * @param {String} options.type 分割方式 v:垂直分割,h:水平分割
     * @param {String} options.dock 驻停位置 top:顶部,bottom:底部,left:左侧,right:右侧
     * @param {Number} options.minLeft 左侧最小尺寸
     * @param {Number} options.minRight 右侧最小尺寸
     * @param {Number} options.minTop 顶部最小尺寸
     * @param {Number} options.minBottom 底部最小尺寸
     * @param {Number} options.maxLeft 左侧最大尺寸
     * @param {Number} options.maxRight 右侧最大尺寸
     * @param {Number} options.maxTop 顶部最大尺寸
     * @param {Number} options.maxBottom 底部最大尺寸
     * @param {Number} options.sizeLeft 左侧初始尺寸
     * @param {Number} options.sizeRight 右侧初始尺寸
     * @param {Number} options.sizeTop 顶部初始尺寸
     * @param {Number} options.sizeBottom 底部初始尺寸
     * @param {Boolean} options.anchorToWindow 是否自动锚定到窗口大小 true,false 
     * @param {Boolean} options.resizeToWidth 自动调整宽度 true,false
     * @param {Function} options.onresize 参考Events onresize说明
     * @example
     * ```javascript
     *  //创建一个缺省配置的垂直分割框架 
     *  $(sSign).splitter();
     *  //创建一个水平分割框架
     *  $(sSign).splitter({type: 'h'});
     * ```
     */ 
    create: function(options) {
      this.options = options || {};

      if ($(this).is(".splitter")) return; // already a splitter
      if ($(this.element).attr("data-splitter-initialized")) return
      var zombie; // left-behind splitbar for outline resizes
      /**
       * 用于判断是否触发resize方法
       * @method resize_auto_fired
       * @return {Boolean} 判断浏览器版本是否小于ie9
       * @private
       */
      function resize_auto_fired() {
        // Returns true when the browser natively fires the resize 
        // event attached to the panes elements
        return ($.browser.msie && (parseInt($.browser.version) < 9));
      }
      /**
       * 设置bar状态
       * @method setBarState
       * @param {String} state 状态样式Class
       * @private
       */
      function setBarState(state) {
        bar.removeClass(opts.barStateClasses).addClass(state);
      }
      /**
       * 按下鼠标开始拖动时触发(mousedown)
       * @method startSplitMouse
       * @param {Event} evt 事件对象
       * @private
       */
      function startSplitMouse(evt) {
        if (evt.which != 1) return; // left button only
        bar._startpos = A[0][opts.pxSplit];

        bar.removeClass(opts.barHoverClass);
        if (1||opts.outline) {
          zombie = zombie || bar.clone(false).insertAfter(A);
          bar.removeClass(opts.barDockedClass);
        }
        setBarState(opts.barActiveClass)
        // Safari selects A/B text on a move; iframes capture mouse events so hide them
        panes.css("-webkit-user-select", "none").find("iframe").addClass(opts.iframeClass);
        A._posSplit = A[0][opts.pxSplit] - evt[opts.eventPos];
        $(document).bind("mousemove" + opts.eventNamespace, doSplitMouse).bind("mouseup" + opts.eventNamespace, evt.data, endSplitMouse);
      }

      /**
       * 鼠标拖动时触发
       * @method doSplitMouse
       * @param {Event} evt 事件对象
       * @private
       */
      function doSplitMouse(evt) {
        var pos = A._posSplit + evt[opts.eventPos],
          range = Math.max(0, Math.min(pos, splitter._DA - bar._DA)),
          limit = Math.max(A._min, splitter._DA - B._max, Math.min(pos, A._max, splitter._DA - bar._DA - B._min));

        A.removeClass(opts.noshow); //css("display","");
        B.removeClass(opts.noshow); //css("display","");
        if (1||opts.outline) {
          // Let docking splitbar be dragged to the dock position, even if min width applies
          if ((opts.dockPane == A && pos < Math.max(A._min, bar._DA)) || (opts.dockPane == B && pos > Math.min(pos, A._max, splitter._DA - bar._DA - B._min))) {
            bar.addClass(opts.barDockedClass).css(opts.origin, range);
          } else {
            bar.removeClass(opts.barDockedClass).css(opts.origin, limit);
          }
          bar._DA = bar[0][opts.pxSplit];
        } else resplit(pos);
        setBarState(pos == limit ? opts.barActiveClass : opts.barLimitClass);
      }
      /**
       * 鼠标按键抬起时触发(mouseup)
       * @method endSplitMouse
       * @param {Event} evt 事件对象
       * @private
       */
      function endSplitMouse(evt) {
        setBarState(opts.barNormalClass);
        bar.addClass(opts.barHoverClass);
        var pos = A._posSplit + evt[opts.eventPos];
        if (1||opts.outline) {
          zombie && zombie.remove();
          zombie = null;
          resplit(pos);
        }
        panes.css("-webkit-user-select", "text").find("iframe").removeClass(opts.iframeClass);
        $(document).unbind("mousemove" + opts.eventNamespace + " mouseup" + opts.eventNamespace);

        var outputObj = {
          A: {
            height: A.height(),
            width: A.width()
          },
          B: {
            height: B.height(),
            width: B.width()
          }
        };
        // 判断开始位置是否和结束位置一致，事件对象是否为函数类型，然后执行
        bar._startpos != A[0][opts.pxSplit] && evt.data.eventObj && typeof evt.data.eventObj == "function" && evt.data.eventObj(outputObj);
      }
      /**
       * 重新进行尺寸分割
       * @method resplit
       * @param {Number} pos      分割点位置
       * @param {object} eventObj 待触发回调的事件函数对象
       * @private
       */
      function resplit(pos, eventObj) {

        bar._DA = bar[0][opts.pxSplit]; // bar size may change during dock
        // Constrain new splitbar position to fit pane size and docking limits
        if ((opts.dockPane == A && pos < Math.max(A._min, bar._DA)) || (opts.dockPane == B && pos > Math.min(pos, A._max, splitter._DA - bar._DA - B._min))) {
          bar.addClass(opts.barDockedClass);
          bar._DA = bar[0][opts.pxSplit];
          pos = opts.dockPane == A ? 0 : splitter._DA - bar._DA;
          if (bar._pos == null) bar._pos = A[0][opts.pxSplit];
        } else {
          bar.removeClass(opts.barDockedClass);
          bar._DA = bar[0][opts.pxSplit];
          bar._pos = null;
          pos = Math.max(A._min, splitter._DA - B._max, Math.min(pos, A._max, splitter._DA - bar._DA - B._min));
        }
        // Resize/position the two panes
        bar.css(opts.origin, pos).css(opts.fixed, splitter._DF);
        // get A Border width infomation 获取A Border 的宽度信息 
        var A_BL = A.css("border-left-width").replace("px", ""),
          A_BR = A.css("border-right-width").replace("px", ""),
          A_BT = A.css("border-top-width").replace("px", ""),
          A_BB = A.css("border-bottom-width").replace("px", ""),

          B_BL = B.css("border-left-width").replace("px", ""),
          B_BR = B.css("border-right-width").replace("px", ""),
          B_BT = B.css("border-top-width").replace("px", ""),
          B_BB = B.css("border-bottom-width").replace("px", "");

        if (opts.type == "v") {
          A.css(opts.origin, 0).css(opts.split, pos < (A_BL + A_BR - 0) ? 0 : pos - A_BL - A_BR).css(opts.fixed, splitter._DF < (A_BT + A_BB - 0) ? 0 : splitter._DF - A_BT - A_BB);

          pos == 0 ? A.addClass(opts.noshow) : ""; //css("display","none"):'';
          B.css(opts.origin, pos + bar._DA).css(opts.split, splitter._DA - bar._DA - pos - B_BL - B_BR).css(opts.fixed, splitter._DF - B_BT - B_BB);

          pos == splitter._DA - bar._DA ? B.addClass(opts.noshow) : ""; //css("display","none"):'';
        } else if (opts.type = "h") {
          A.css(opts.origin, 0).css(opts.split, pos - A_BT - A_BB).css(opts.fixed, splitter._DF - A_BL - A_BR);
          pos == 0 ? A.addClass(opts.noshow) : "";
          B.css(opts.origin, pos + bar._DA).css(opts.split, splitter._DA - bar._DA - pos - B_BT - B_BB).css(opts.fixed, splitter._DF - B_BL - B_BR);
          pos == splitter._DA - bar._DA ? B.addClass(opts.noshow) : "";
        }

        //如父层尺寸又已经发生了变化，则重新调整分割区域的尺寸
        if(splitter._DF != splitter[0][opts.pxFixed] - splitter._PBF || splitter._DA != splitter[0][opts.pxSplit] - splitter._PBA){
          splitter._DF = splitter[0][opts.pxFixed] - splitter._PBF;
          splitter._DA = splitter[0][opts.pxSplit] - splitter._PBA;
          if (opts.type == "v") {
            A.css(opts.origin, 0).css(opts.split, pos < (A_BL + A_BR - 0) ? 0 : pos - A_BL - A_BR).css(opts.fixed, splitter._DF < (A_BT + A_BB - 0) ? 0 : splitter._DF - A_BT - A_BB);

            pos == 0 ? A.addClass(opts.noshow) : ""; //css("display","none"):'';
            B.css(opts.origin, pos + bar._DA).css(opts.split, splitter._DA - bar._DA - pos - B_BL - B_BR).css(opts.fixed, splitter._DF - B_BT - B_BB);

            pos == splitter._DA - bar._DA ? B.addClass(opts.noshow) : ""; //css("display","none"):'';
          } else if (opts.type = "h") {
            A.css(opts.origin, 0).css(opts.split, pos - A_BT - A_BB).css(opts.fixed, splitter._DF - A_BL - A_BR);
            pos == 0 ? A.addClass(opts.noshow) : "";
            B.css(opts.origin, pos + bar._DA).css(opts.split, splitter._DA - bar._DA - pos - B_BT - B_BB).css(opts.fixed, splitter._DF - B_BL - B_BR);
            pos == splitter._DA - bar._DA ? B.addClass(opts.noshow) : "";
          }          
        }

        var outputObj = {
          A: {
            height: A.height(),
            width: A.width()
          },
          B: {
            height: B.height(),
            width: B.width()
          }
        };
        eventObj && typeof eventObj == "function" && eventObj(outputObj);
        // 重新分割后保存新的宽高到_old里面去
        splitter._oldW = splitter.width();
        splitter._oldH = splitter.height();

        // IE fires resize for us; all others pay cash
        if (!resize_auto_fired()) panes.trigger("resize");
      }

      function dimSum(jq, dims) {
        // Opera returns -1 for missing min/max width, turn into 0
        var sum = 0;
        for (var i = 1; i < arguments.length; i++)
        sum += Math.max(parseInt(jq.css(arguments[i]), 10) || 0, 0);
        return sum;
      }
      /**
       * 重算分割尺寸
       * @method resize
       * @param {Number} size  分割点所处位置
       * @private
       */
      function resize(size) {

        // Determine new width/height of splitter container
        splitter._DF = splitter[0][opts.pxFixed] - splitter._PBF;
        splitter._DA = splitter[0][opts.pxSplit] - splitter._PBA;

        // Bail if splitter isn't visible or content isn't there yet
        if (splitter._DF <= 0 || splitter._DA <= 0) return;

        // if nothing changed, no need to resize 
        if (splitter._oldW == splitter.width() && splitter._oldH == splitter.height()) return; // nothing changed
        //splitter._oldW = splitter.width();
        //splitter._oldH = splitter.height();

        // Re-divvy the adjustable dimension; maintain size of the preferred pane
        resplit(!isNaN(size) ? size : (!(opts.sizeRight || opts.sizeBottom) ? A[0][opts.pxSplit] : splitter._DA - B[0][opts.pxSplit] - bar._DA), opts.onresize);
        setBarState(opts.barNormalClass);
      }

      /**
       * 获取panel边框尺寸
       * @method getPanelBorderSize
       * @param  {String} type  h:横向分割 ,v:纵向分割
       * @param  {HTMLElement} panel 区域对象
       * @return {Number} 边框尺寸
       * @private
       */
      function getPanelBorderSize(type, panel) {
        var A = $(panel);
        var A_BL = A.css("border-left-width").replace("px", ""),
          A_BR = A.css("border-right-width").replace("px", ""),
          A_BT = A.css("border-top-width").replace("px", ""),
          A_BB = A.css("border-bottom-width").replace("px", "");

        var bs = 0;

        if (type == "h") {
          bs = A_BT * 1 + A_BB * 1;
        } else {
          bs = A_BL * 1 + A_BR * 1;
        }
        return bs;
      }

      // Determine settings based on incoming opts, element classes, and defaults
      var vh = (this.options.splitHorizontal ? 'h' : this.options.splitVertical ? 'v' : this.options.type) || 'v';
      var opts = $.extend({
        // Defaults here allow easy use with ThemeRoller
        splitterClass: "splitter ui-widget ui-widget-content",
        paneClass: "splitter-pane",
        barClass: "splitter-bar",
        barNormalClass: "ui-state-default",
        // splitbar normal
        barHoverClass: "ui-state-hover",
        // splitbar mouse hover
        barActiveClass: "ui-state-highlight",
        // splitbar being moved
        barLimitClass: "ui-state-error",
        // splitbar at limit
        iframeClass: "splitter-iframe-hide",
        // hide iframes during split
        eventNamespace: ".splitter" + (++splitterCounter),
        pxPerKey: 8,
        // splitter px moved per keypress
        tabIndex: 0,
        // tab order indicator
        accessKey: '',
        // accessKey for splitbar,
        noshow: "none"
      }, {
        // user can override
        v: { // Vertical splitters:
          keyLeft: 39,
          keyRight: 37,
          cursor: "e-resize",
          barStateClass: "splitter-bar-vertical",
          barDockedClass: "splitter-bar-vertical-docked"
        },
        h: { // Horizontal splitters:
          keyTop: 40,
          keyBottom: 38,
          cursor: "n-resize",
          barStateClass: "splitter-bar-horizontal",
          barDockedClass: "splitter-bar-horizontal-docked"
        }
      }[vh], this.options, {
        // user cannot override
        v: { // Vertical splitters:
          type: 'v',
          eventPos: "pageX",
          origin: "left",
          split: "width",
          pxSplit: "offsetWidth",
          pxcSplit: "clientWidth",
          //处理在ie情况下的判断
          side1: "Left",
          side2: "Right",
          fixed: "height",
          pxFixed: "offsetHeight",
          side3: "Top",
          side4: "Bottom"
        },
        h: { // Horizontal splitters:
          type: 'h',
          eventPos: "pageY",
          origin: "top",
          split: "height",
          pxSplit: "offsetHeight",
          pxcSplit: "clientHeight",
          side1: "Top",
          side2: "Bottom",
          fixed: "width",
          pxFixed: "offsetWidth",
          side3: "Left",
          side4: "Right"
        }
      }[vh]);
      opts.barStateClasses = [opts.barNormalClass, opts.barHoverClass, opts.barActiveClass, opts.barLimitClass].join(' ');

      // Create jQuery object closures for splitter and both panes
      var splitter = $(this.element).css({
        position: "relative"
      }).addClass(opts.splitterClass).attr("data-splitter-initialized", true)

      var panes = $(">*", splitter[0]).addClass(opts.paneClass).css({
        position: "absolute",
        // positioned inside splitter container
        "z-index": "1",
        // splitbar is positioned above
        "-moz-outline-style": "none" // don't show dotted outline
      });

      var A = $(panes[0]),
        B = $(panes[1]); // A = left/top, B = right/bottom
      opts.dockPane = opts.dock && (/right|bottom/.test(opts.dock) ? B : A);

      // Focuser element, provides keyboard support; title is shown by Opera accessKeys
      var focuser = $('<a href="javascript:void(0)"></a>').attr({
        accessKey: opts.accessKey,
        tabIndex: opts.tabIndex,
        title: opts.splitbarClass
      }).bind(($.browser.opera ? "click" : "focus") + opts.eventNamespace, function() {
        this.focus();
        bar.addClass(opts.barActiveClass)
      }).bind("keydown" + opts.eventNamespace, function(e) {
        var key = e.which || e.keyCode;
        var dir = key == opts["key" + opts.side1] ? 1 : key == opts["key" + opts.side2] ? -1 : 0;
        if (dir) resplit(A[0][opts.pxSplit] + dir * opts.pxPerKey, false);
      }).bind("blur" + opts.eventNamespace, function() {
        bar.removeClass(opts.barActiveClass)
      });

      // Splitbar element
      var bar = $('<div></div>').insertAfter(A).addClass(opts.barClass).addClass(opts.barStateClass).append(focuser).attr({
        unselectable: "on"
      }).css({
        position: "absolute",
        "user-select": "none",
        "-webkit-user-select": "none",
        "-khtml-user-select": "none",
        "-moz-user-select": "none",
        "z-index": "100"
      }).bind("mousedown" + opts.eventNamespace, {
        eventObj: opts.onresize
      }, startSplitMouse).bind("mouseover" + opts.eventNamespace, function() {
        $(this).addClass(opts.barHoverClass);
      }).bind("mouseout" + opts.eventNamespace, function() {
        $(this).removeClass(opts.barHoverClass);
      });
      // Use our cursor unless the style specifies a non-default cursor
      if (/^(auto|default|)$/.test(bar.css("cursor"))) bar.css("cursor", opts.cursor);

      // Cache several dimensions for speed, rather than re-querying constantly
      // These are saved on the A/B/bar/splitter jQuery vars, which are themselves cached
      // DA=dimension adjustable direction, PBF=padding/border fixed, PBA=padding/border adjustable
      bar._DA = bar[0][opts.pxSplit];
      splitter._PBF = dimSum(splitter, "border" + opts.side3 + "Width", "border" + opts.side4 + "Width");
      splitter._PBA = dimSum(splitter, "border" + opts.side1 + "Width", "border" + opts.side2 + "Width");
      A._pane = opts.side1;
      B._pane = opts.side2;
      $.each([A, B], function() {
        this._splitter_style = this.style;
        this._min = opts["min" + this._pane] || dimSum(this, "min-" + opts.split);
        this._max = opts["max" + this._pane] || dimSum(this, "max-" + opts.split) || 9999;
        //        this._init = opts["size" + this._pane] === true ? parseInt($.css(this[0], opts.split), 10) : opts["size" + this._pane];
        this._init = opts[this._pane] === true ? parseInt($.css(this[0], opts.split), 10) : opts[this._pane];
      });

      // Determine initial position, get from cookie if specified
      var initPos = A._init;
      if (!isNaN(B._init)) // recalc initial B size as an offset from the top or left side
      initPos = splitter[0][opts.pxSplit] - splitter._PBA - B._init - bar._DA;
      if (isNaN(initPos)) // King Solomon's algorithm
      initPos = Math.round((splitter[0][opts.pxSplit] - splitter._PBA - bar._DA) / 2);

      // Resize event propagation and splitter sizing
      if (opts.anchorToWindow) opts.resizeTo = window;
      if (opts.resizeTo) {
        splitter._hadjust = dimSum(splitter, "borderTopWidth", "borderBottomWidth", "marginBottom");
        splitter._hmin = Math.max(dimSum(splitter, "minHeight"), 20);
        $(window).unbind("resize" + opts.eventNamespace).bind("resize" + opts.eventNamespace, function() {

          var top = splitter.offset().top;
          // 在 chrome 浏览器中 window.innerHeight 和 .height() 获取的值有可能不一致，而在ie7又无法获取innerHeight
          var eh = opts.resizeTo.innerHeight || $(opts.resizeTo).height();

          splitter.css("height", Math.max(eh - top - splitter._hadjust, splitter._hmin) + "px");

          if (!resize_auto_fired() && (splitter._oldW!=splitter.width() || splitter._oldH!=splitter.height())) 
            splitter.triggerHandler("resize" + opts.eventNamespace);
        }).triggerHandler("resize" + opts.eventNamespace);
      } else if (opts.resizeToWidth && !resize_auto_fired()) {
        $(window).bind("resize" + opts.eventNamespace, function() {
          resize();
        });
      }

      // Docking support
      if (opts.dock) {
        splitter.bind("toggleDock" + opts.eventNamespace, function() {
          // 获取去除border后的panel尺寸
          //          var pw = opts.dockPane[0][opts.pxSplit] - getPanelBorderSize(opts.type, opts.dockPane[0]);
          //          splitter.triggerHandler(pw ? "dock" : "undock");
          if (opts.dockPane.first().hasClass(opts.noshow)) {
            opts.dockPane.first().removeClass(opts.noshow); //css("display","");
            splitter.triggerHandler("undock");
          } else {
            splitter.triggerHandler("dock");
            A.removeClass(opts.noshow);
            B.removeClass(opts.noshow);
          }

        }).bind("dock" + opts.eventNamespace, function(evt) {
          //var pw = A[0][opts.pxSplit];
          var pw = A[0][opts.pxSplit] - getPanelBorderSize(opts.type, A[0]);

          if (!pw) return;
          //保存原有位置,以便undock时恢复
          bar._oldpos = A[0][opts.pxSplit];
          var x = {};
          x[opts.origin] = opts.dockPane == A ? 0 : splitter[0][opts.pxSplit] - splitter._PBA - bar[0][opts.pxSplit];
          bar.animate(x, opts.dockSpeed || 1, opts.dockEasing, function() {
            bar.addClass(opts.barDockedClass);
            resplit(x[opts.origin], opts.onresize);
          });

        }).bind("undock" + opts.eventNamespace, function(evt) {
          var pw = A[0][opts.pxcSplit] > 0 && splitter._DA - bar._DA > A[0][opts.pxSplit];

          if (pw) return;
          var x = {};
          x[opts.origin] = bar._oldpos + "px";
          bar.removeClass(opts.barDockedClass).animate(x, opts.undockSpeed || opts.dockSpeed || 1, opts.undockEasing || opts.dockEasing, function() {
            resplit(bar._oldpos, opts.onresize);
            bar._oldpos = null;
          });
        });

        if (opts.dockKey) $('<a title="' + opts.splitbarClass + ' toggle dock" href="javascript:void(0)"></a>').attr({
          accessKey: opts.dockKey,
          tabIndex: -1
        }).appendTo(bar).bind($.browser.opera ? "click" : "focus", function() {
          splitter.triggerHandler("toggleDock");
          this.blur();
        });
        bar.bind("dblclick", function() {
          splitter.triggerHandler("toggleDock");
        })
      }

      // Resize event handler; triggered immediately to set initial position
      splitter.bind("destroy" + opts.eventNamespace, function() {
        $([window, document]).unbind(opts.eventNamespace);
        bar.unbind().remove();
        panes.removeClass(opts.paneClass);
        splitter.removeClass(opts.splitterClass).add(panes).unbind(opts.eventNamespace).attr("style", function(el) {
          return this._splitter_style || ""; //TODO: save style
        });
        splitter = bar = focuser = panes = A = B = opts = options = null;
      }).bind("resize" + opts.eventNamespace, function(e, size) {  
        resize(size);
      }).trigger("resize" + opts.eventNamespace, [initPos]);
    }
  }

  /* TAB PLUGIN DEFINITION
   * ===================== */

  var old = $.fn.splitter

  $.fn.splitter = function(option, param) {
      return this.each(function() {
        var $this = $(this),
          data = $this.data('splitter')
          if (!data) $this.data('splitter', (data = new Splitter(this)))
          if (typeof option == 'string') data[option](param)
      })
    }

  $.fn.splitter.Constructor = Splitter

  /* SPLITTER NO CONFLICT
   * =============== */

  $.fn.splitter.noConflict = function() {
    $.fn.splitter = old
    return this
  }

  /* SPLITTER DATA-API
   * ============ */
  /**
   * data-api 接口 
   * @event click.splitter.data-api
   * @param {[type]} e 事件对象
   */
  $(document).on('click.splitter.data-api', '[data-toggle="splitter"]', function(e) {

    var $this = $(this),
      href = $this.attr('href'),
      $targetList = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))),
      option, $target, iCount = $targetList.length; //strip for ie7
    e.preventDefault();

    if (iCount > 0) {
      //处理第一个
      $target = $($targetList[0])
      option = $target.data('splitter') ? 'create' : $.extend($target.data(), $this.data())
      $target.splitter('create', option);
      //处理多重分割
      for (var i = 1; i < iCount; i++) {
        $target = $($targetList[i])
        option = $target.data('splitter') ? 'create' : $.extend($target.data(), $this.data())

        $target.css({
          "overflow": "hidden"
        }).splitter('create', option);
      }
    }
  });

})(window.jQuery);