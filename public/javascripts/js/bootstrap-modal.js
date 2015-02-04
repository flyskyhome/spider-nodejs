/* =========================================================
 * bootstrap-modal.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#modals
 * =========================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

 /**
  * js插件:模态窗口
  * @module Modal
  */


!function ($) {

  "use strict"; // jshint ;_;
  
  /**
   * 当show方法被调用时，此事件将被立即触发
   * @event show
   * @param {jQuery.Event} ev 事件对象
   * @example
   * ```javasctipt
   *   $(sSign).on('show', function (ev){});
   * ```
   */

  /**
   * 当模态对话框呈现完毕时（会等待过渡效果执行结束）触发
   * @event shown
   * @param {jQuery.Event} ev 事件对象
   * @example
   * ```javascript
   *   $(sSign).on('shown', function (ev){});
   * ```
   */

  /**
   * 当hide方法被调用时，此事件被立即触发。
   * @event hide
   * @param {jQuery.Event} ev 事件对象
   * @example
   * ```javascript
   *   $(sSign).on('hide', function (ev){});
   * ```
   */

  /**
   * 当模态对话框被隐藏（而且过渡效果执行完毕）之后，此事件将被触发
   * @event hidden
   * @param {jQuery.Event} ev 事件对象
   * @example
   * ```javascript
   *   $(sSign).on('hidden', function (ev){});
   * ```
   */

  /**
   * @class Modal
   * @constructor
   * @param {String} element jQuery选择器
   */
  var Modal = function (element) {
    this.$element = $(element)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
  }

  Modal.prototype ={
      /**
       * Modal 的一个实例
       * @property {Object} constructor
       */
      constructor: Modal, 
      /**
       * 手工显示/隐藏一个模块框
       * @method toggle
       * @example
       * ```javascript
       *   $(sSign).modal("toggle")
       * ```
       */
      toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      },
      /**
       * 手工显示模态框
       * @method show
       * @param {Object} options 显示方式配置信息
       * @param {String} options.title 标题
       * @param {Boolean} options.backdrop 是否添加背景元素。=static时，点击模态对话框的外部区域不会将其关闭
       * @param {Boolean} options.keyboard 按Esc 键时是否关闭模态框
       * @param {Boolean} options.show 初始化时即显示模态对话框
       * @param {String} options.remote 如果提供了远程url地址，就会通过 jQuery的load方法加载内容并注入到.modal-body中
       * @param {String} options.content 模态框内显示的文本内容
       * @param {String} options.frame 嵌入模态框内的页面地址
       * @param {String} options.height 模态框内容显示高度 
       * @param {String} options.width 模态框显示宽度
       * @example
       * ```javascript
       *  //初次显示可用
       *  $(sSign).modal(options);
       *  //以后显示可用
       *  $(sSign).modal("show");
       * ```
       */
      show: function (options) {
        this.options=options;
        var that = this
          , e = $.Event('show');

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('fade')
          var opt=that.options
            , ele=that.$element
            , elebody=ele.find('.modal-body')
            , elehead=ele.find('.modal-header>button')
            // 后缀
            , suf
            // 真实数字
            , num
            //  整体样式
            , hwCss={}
            // body的height样式
            , bhCss;

          if(opt){
            if(opt.height){            
              bhCss={height:opt.height};
            }

            if(opt.width){
              hwCss['width']=opt.width;

              if(opt.width.substr(opt.width.length-1,1)=='%'){
                suf="%";
                num=opt.width.substr(0,opt.width.length-1);
              }
              else{
                suf="px";
                num=opt.width.substr(0,opt.width.length-2);
              }
              
              hwCss['margin-left']=(0-num/2)+suf;
            }

            ele.removeAttr("style"); 
            if(hwCss){
              ele.css(hwCss);

              if(bhCss){
                elebody.css(bhCss);          
              }
            }
            // 设置标题
            if(opt.title){
              var cn=elehead[0].childNodes[0];
              // 如果是文本节点则直接替换，否则追加
              cn.nodeType==3?cn.data=opt.title:elehead.prepend(opt.title);
            }

            // 如果有以下三种情况之一，则清除body内原有信息
            opt.remote||opt.frame||opt.content?elebody.html(""):"";
            if(opt.remote){
              elebody.load(that.options.remote);
            }

            if(opt.frame){
              elebody.append("<iframe frameborder='0' scrolling='no' src='"+opt.frame+"' class='w_100 h_100'></iframe>");
            }
            
            if(opt.content){
              elebody.append(opt.content);
            }
          }
          
          if (!ele.parent().length) {
            ele.appendTo(document.body) //don't move modals dom position
          }

          ele.css({"margin-top":(0-ele.height())/2+"px"});
          ele.show()

          if (transition) {
            ele[0].offsetWidth // force reflow
          }

          ele
            .addClass('in')
            .attr('aria-hidden', false)

          that.enforceFocus()

          transition ?
            ele.one($.support.transition.end, function () {ele.focus().trigger('shown') }) :
            ele.focus().trigger('shown')

        })
      },
      /**
       * 隐藏模态框
       * @method  hide
       * @param  {Object} e 事件对象
       * @example
       * ```javascript
       *  $(sSign).modal("hide");
       * ```
       */
      hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)

        $.support.transition && this.$element.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideModal()
      }, 
      /**
       * 定位到某一个dom对象上
       * @method enforceFocus
       * @private
       */
      enforceFocus: function () {
        var that = this
        $(document).on('focusin.modal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }, 
      /**
       * 根据参数设置,绑定Esc按键事件
       * @method escape
       * @private
       */
      escape: function () {
        var that = this
        if (this.isShown && this.options && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal')
        }
      }, 
      /**
       * 隐藏时显示过度动画
       * @method  hideWithTransition
       * @private
       */
      hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end)
              that.hideModal()
            }, 500)

        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          that.hideModal()
        })
      }, 
      /**
       * 隐藏模态窗口
       * @method hideModal
       * @private
       */
      hideModal: function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
          that.removeBackdrop()
          that.$element.trigger('hidden')
        })
      }, 
      /**
       * 移除模态框的背景
       * @method removeBackdrop
       * @private
       */
      removeBackdrop: function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
      }, 
      /**
       * 生成模态框背景
       * @method backdrop
       * @param  {Function} callback 生成完成之后的回调函数
       * @private
       */
      backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options && this.options.backdrop) {
          var doAnimate = $.support.transition && animate

          this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
            .appendTo(document.body)

          this.$backdrop.click(
            this.options.backdrop == 'static' ?
              $.proxy(this.$element[0].focus, this.$element[0])
            : $.proxy(this.hide, this)
          )

          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

          this.$backdrop.addClass('in')

          if (!callback) return

          doAnimate ?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('in')

          $.support.transition && this.$element.hasClass('fade')?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (callback) {
          callback()
        }
      }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.modal

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
//      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (!data) $this.data('modal', (data = new Modal(this)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show(options)
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL NO CONFLICT
  * ================= */

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


 /* MODAL DATA-API
  * ============== */
  /**
   * data-api 实现
   * @event click.modal.data-api
   * @param {Object} e 事件对象Event
   */

  $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this)
      , href = $this.attr('href')
      , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      , option = $target.data('modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option)
      .one('hide', function () {
        $this.focus()
      })
  })

}(window.jQuery);
