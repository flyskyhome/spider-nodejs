/* ========================================================
 * bootstrap-tab.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#tabs
 * ========================================================
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
 * ======================================================== */

/**
 * js插件:标签页
 * @module Tab
 */

!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  /**
   * @class Tab
   * @constructor
   * @param {String} element jQuery dom 选择器
   */ 
  
  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype = {
    /**
     * Tab 实例
     * @property constructor
     * @type {Object}
     */   
    constructor: Tab,     
    /**
     * Tab 显示函数
     * @method show
     * @example
     * ```javascript
     *   $(sSign).tab("show");
     * ```
     */
    show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active:last a')[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    },
    /**
     * 激活标签页
     * @method activate
     * @param  {jQuery-Object}  element  jQuery dom元素
     * @param  {jQuery-Object} container tab容器
     * @param  {Function} callback  事件回调函数
     */
    activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    },
    /**
     *  创建Tab一个标签
     *  @method create
     *  @param {object} options 新建标签的配置项信息
     *  @param {String} options.name 待调用方法名称
     *  @param {String} options.info 相关信息
     *  @example
     *  ```javascript
     *    $(sSign).tab('show')
     *    $(sSign).tab({name:"create",info:"tab标签名称"})
     *  ```
     */
    create: function(options){
      var $this = this.element;
      
      var iSign=($this.find("> li > a[data-toggle='tab']").last().attr("href").replace("#tab","") - 0) + 1;

      var sCaption="tab"+iSign;

      $this.append('<li><a href="#tab'+iSign+'" data-toggle="tab">'+options+'</a></li>');
      $this.next().append('<div class="tab-pane" id="tab'+iSign+'"></div>');
      $this.find('a:last').tab('show');
    },
    /**
     * 删除一个标签页
     * @method remove
     * @example
     * ```javascript
     *   $(sSign).tab("remove");
     * ```
     */
    remove: function(){
      var $this = this.element;
      // 获取tab body 标识
      var sAttr=$this.attr("href");
      // 删除tab body
      $(sAttr).remove();
      // 删除tab
      $this.parent().remove();
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
      if(typeof option=="object") data[option.name](option.info); 
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB NO CONFLICT
  * =============== */

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


 /* TAB DATA-API
  * ============ */
  /**
   * data-api 接口
   * @event click.tab.data-api
   * @param {Object} e 事件对象
   */
  $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  });

}(window.jQuery);