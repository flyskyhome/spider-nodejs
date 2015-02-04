/* ===================================================
 * bootstrap-transition.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#transitions
 * ===================================================
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
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


  /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
   * ======================================================= */

  $(function () {

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd otransitionend'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);/* ==========================================================
 * bootstrap-alert.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#alerts
 * ==========================================================
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
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /* ALERT NO CONFLICT
  * ================= */

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


 /* ALERT DATA-API
  * ============== */

  $(document).on('click.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);/* ============================================================
 * bootstrap-button.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#buttons
 * ============================================================
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
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Button = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.button.defaults, options)
  }

  Button.prototype.setState = function (state) {
    var d = 'disabled'
      , $el = this.$element
      , data = $el.data()
      , val = $el.is('input') ? 'val' : 'html'

    state = state + 'Text'
    data.resetText || $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d)
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons-radio"]')

    $parent && $parent
      .find('.active')
      .removeClass('active')

    this.$element.toggleClass('active')
  }


 /* BUTTON PLUGIN DEFINITION
  * ======================== */

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('button')
        , options = typeof option == 'object' && option
      if (!data) $this.data('button', (data = new Button(this, options)))
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.defaults = {
    loadingText: 'loading...'
  }

  $.fn.button.Constructor = Button


 /* BUTTON NO CONFLICT
  * ================== */

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


 /* BUTTON DATA-API
  * =============== */

  $(document).on('click.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
  })

}(window.jQuery);/* ==========================================================
 * bootstrap-carousel.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#carousel
 * ==========================================================
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
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options = options
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      if (this.interval) clearInterval(this.interval);
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , getActiveIndex: function () {
      this.$active = this.$element.find('.item.active')
      this.$items = this.$active.parent().children()
      return this.$items.index(this.$active)
    }

  , to: function (pos) {
      var activeIndex = this.getActiveIndex()
        , that = this

      if (pos > (this.$items.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activeIndex == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      if (this.$element.find('.next, .prev').length && $.support.transition.end) {
        this.$element.trigger($.support.transition.end)
        this.cycle(true)
      }
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.item.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      e = $.Event('slide', {
        relatedTarget: $next[0]
      , direction: direction
      })

      if ($next.hasClass('active')) return

      if (this.$indicators.length) {
        this.$indicators.find('.active').removeClass('active')
        this.$element.one('slid', function () {
          var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
          $nextIndicator && $nextIndicator.addClass('active')
        })
      }

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
        , action = typeof option == 'string' ? option : options.slide
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL NO CONFLICT
  * ==================== */

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }

 /* CAROUSEL DATA-API
  * ================= */

  $(document).on('click.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this = $(this), href
      , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      , options = $.extend({}, $target.data(), $this.data())
      , slideIndex

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('carousel').pause().to(slideIndex).cycle()
    }

    e.preventDefault()
  })

}(window.jQuery);/* =============================================================
 * bootstrap-collapse.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#collapse
 * =============================================================
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
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.collapse.defaults, options)

    if (this.options.parent) {
      this.$parent = $(this.options.parent)
    }

    this.options.toggle && this.toggle()
  }

  Collapse.prototype = {

    constructor: Collapse

  , dimension: function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning || this.$element.hasClass('in')) return

      dimension = this.dimension()
      scroll = $.camelCase(['scroll', dimension].join('-'))
      actives = this.$parent && this.$parent.find('> .accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$element[dimension](0)
      this.transition('addClass', $.Event('show'), 'shown')
      $.support.transition && this.$element[dimension](this.$element[0][scroll])
    }

  , hide: function () {
      var dimension
      if (this.transitioning || !this.$element.hasClass('in')) return
      dimension = this.dimension()
      this.reset(this.$element[dimension]())
      this.transition('removeClass', $.Event('hide'), 'hidden')
      this.$element[dimension](0)
    }

  , reset: function (size) {
      var dimension = this.dimension()

      this.$element
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

      return this
    }

  , transition: function (method, startEvent, completeEvent) {
      var that = this
        , complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$element.trigger(completeEvent)
          }

      this.$element.trigger(startEvent)

      if (startEvent.isDefaultPrevented()) return

      this.transitioning = 1

      this.$element[method]('in')

      $.support.transition && this.$element.hasClass('collapse') ?
        this.$element.one($.support.transition.end, complete) :
        complete()
    }

  , toggle: function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* COLLAPSE PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('collapse')
        , options = $.extend({}, $.fn.collapse.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.defaults = {
    toggle: true
  }

  $.fn.collapse.Constructor = Collapse


 /* COLLAPSE NO CONFLICT
  * ==================== */

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


 /* COLLAPSE DATA-API
  * ================= */

  $(document).on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this = $(this), href
      , target = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
      , option = $(target).data('collapse') ? 'toggle' : $this.data()
    $this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    $(target).collapse(option)
  })

}(window.jQuery);/* ============================================================
 * bootstrap-dropdown.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#dropdowns
 * ============================================================
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
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle=dropdown]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , isActive

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) {
        if ('ontouchstart' in document.documentElement) {
          // if mobile we we use a backdrop because click events don't delegate
          $('<div class="dropdown-backdrop"/>').insertBefore($(this)).on('click', clearMenus)
        }
        $parent.toggleClass('open')
      }

      $this.focus()

      return false
    }

  , keydown: function (e) {
      var $this
        , $items
        , $active
        , $parent
        , isActive
        , index

      if (!/(38|40|27)/.test(e.keyCode)) return

      $this = $(this)

      e.preventDefault()
      e.stopPropagation()

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      if (!isActive || (isActive && e.keyCode == 27)) {
        if (e.which == 27) $parent.find(toggle).focus()
        return $this.click()
      }

      $items = $('[role=menu] li:not(.divider):visible a', $parent)

      if (!$items.length) return

      index = $items.index($items.filter(':focus'))

      if (e.keyCode == 38 && index > 0) index--                                        // up
      if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
      if (!~index) index = 0

      $items
        .eq(index)
        .focus()
    }

  }

  function clearMenus() {
    $('.dropdown-backdrop').remove()
    $(toggle).each(function () {
      getParent($(this)).removeClass('open')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = selector && $(selector)

    if (!$parent || !$parent.length) $parent = $this.parent()

    return $parent
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


 /* DROPDOWN NO CONFLICT
  * ==================== */

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(document)
    .on('click.dropdown.data-api', clearMenus)
    .on('click.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);
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


!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  //var Modal = function (element, options) {
  var Modal = function (element) {
    //this.options = options
    this.$element = $(element)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
    /*
    this.options.remote && (
    	this.$element.find('.modal-body').html("") &&
    	this.$element.find('.modal-body').load(this.options.remote)
    );
    */
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function (options) {
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
            , elehead=ele.find('.modal-header')
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
      }

    , hide: function (e) {
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
      }

    , enforceFocus: function () {
        var that = this
        $(document).on('focusin.modal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }

    , escape: function () {
        var that = this
        if (this.isShown && this.options && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal')
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end)
              that.hideModal()
            }, 500)

        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          that.hideModal()
        })
      }

    , hideModal: function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
          that.removeBackdrop()
          that.$element.trigger('hidden')
        })
      }

    , removeBackdrop: function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
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
/* ===========================================================
 * bootstrap-tooltip.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
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
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut
        , triggers
        , trigger
        , i

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      triggers = this.options.trigger.split(' ')

      for (i = triggers.length; i--;) {
        trigger = triggers[i]
        if (trigger == 'click') {
          this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
        } else if (trigger != 'manual') {
          eventIn = trigger == 'hover' ? 'mouseenter' : 'focus'
          eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'
          this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
          this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
        }
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options)

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var defaults = $.fn[this.type].defaults
        , options = {}
        , self

      this._options && $.each(this._options, function (key, value) {
        if (defaults[key] != value) options[key] = value
      }, this)

      self = $(e.currentTarget)[this.type](options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp
        , e = $.Event('show')

      if (this.hasContent() && this.enabled) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        $tip
          .detach()
          .css({ top: 0, left: 0, display: 'block' })

        this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

        pos = this.getPosition()

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        this.applyPlacement(tp, placement)
        this.$element.trigger('shown')
      }
    }

  , applyPlacement: function(offset, placement){
      var $tip = this.tip()
        , width = $tip[0].offsetWidth
        , height = $tip[0].offsetHeight
        , actualWidth
        , actualHeight
        , delta
        , replace

      $tip
        .offset(offset)
        .addClass(placement)
        .addClass('in')

      actualWidth = $tip[0].offsetWidth
      actualHeight = $tip[0].offsetHeight

      if (placement == 'top' && actualHeight != height) {
        offset.top = offset.top + height - actualHeight
        replace = true
      }

      if (placement == 'bottom' || placement == 'top') {
        delta = 0

        if (offset.left < 0){
          delta = offset.left * -2
          offset.left = 0
          $tip.offset(offset)
          actualWidth = $tip[0].offsetWidth
          actualHeight = $tip[0].offsetHeight
        }

        this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
      } else {
        this.replaceArrow(actualHeight - height, actualHeight, 'top')
      }

      if (replace) $tip.offset(offset)
    }

  , replaceArrow: function(delta, dimension, position){
      this
        .arrow()
        .css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()
        , e = $.Event('hide')

      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).detach()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.detach()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.detach()

      this.$element.trigger('hidden')

      return this
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function () {
      var el = this.$element[0]
      return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
        width: el.offsetWidth
      , height: el.offsetHeight
      }, this.$element.offset())
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , arrow: function(){
      return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function (e) {
      var self = e ? $(e.currentTarget)[this.type](this._options).data(this.type) : this
      self.tip().hasClass('in') ? self.hide() : self.show()
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  var old = $.fn.tooltip

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }


 /* TOOLTIP NO CONFLICT
  * =================== */

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);
/* ===========================================================
 * bootstrap-popover.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#popovers
 * ===========================================================
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
 * =========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
      $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)
        || $e.attr('data-content')

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


 /* POPOVER NO CONFLICT
  * =================== */

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);
/* =============================================================
 * bootstrap-scrollspy.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#scrollspy
 * =============================================================
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
 * ============================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* SCROLLSPY CLASS DEFINITION
  * ========================== */

  function ScrollSpy(element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href
    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll-spy.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.$body = $('body')
    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {
        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && $href.length
              && [[ $href.position().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
          , maxScroll = scrollHeight - this.$scrollElement.height()
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets.last()[0])
            && this.activate ( i )
        }

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
      }

    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        active = $(selector)
          .parent('li')
          .addClass('active')

        if (active.parent('.dropdown-menu').length)  {
          active = active.closest('li.dropdown').addClass('active')
        }

        active.trigger('activate')
      }

  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY NO CONFLICT
  * ===================== */

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


 /* SCROLLSPY DATA-API
  * ================== */

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);/* ========================================================
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


!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
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
    }

  , activate: function ( element, container, callback) {
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
    }
  , create: function(options){
      var $this = this.element;
      
      var iSign=($this.find("> li > a[data-toggle='tab']").last().attr("href").replace("#tab","") - 0) + 1;

      var sCaption="tab"+iSign;

      $this.append('<li><a href="#tab'+iSign+'" data-toggle="tab">'+options+'</a></li>');
      $this.next().append('<div class="tab-pane" id="tab'+iSign+'"></div>');
      $this.find('a:last').tab('show');
    }
  , remove: function(){
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
      if (typeof option == 'string') data[option]();
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

  $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);/* =============================================================
 * bootstrap-typeahead.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#typeahead
 * =============================================================
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
 * ============================================================ */


!function($){

  "use strict"; // jshint ;_;


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.source = this.options.source
    this.$menu = $(this.options.menu)
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
    }

  , updater: function (item) {
      return item
    }

  , show: function () {
      var pos = $.extend({}, this.$element.position(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu
        .insertAfter(this.$element)
        .css({
          top: pos.top + pos.height
        , left: pos.left
        })
        .show()

      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var items

      this.query = this.$element.val()

      if (!this.query || this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this
      }

      items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source

      return items ? this.process(items) : this
    }

  , process: function (items) {
      var that = this

      items = $.grep(items, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('focus',    $.proxy(this.focus, this))
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
        .on('mouseleave', 'li', $.proxy(this.mouseleave, this))
    }

  , eventSupported: function(eventName) {
      var isSupported = eventName in this.$element
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;')
        isSupported = typeof this.$element[eventName] === 'function'
      }
      return isSupported
    }

  , move: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , keydown: function (e) {
      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27])
      this.move(e)
    }

  , keypress: function (e) {
      if (this.suppressKeyPressRepeat) return
      this.move(e)
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , focus: function (e) {
      this.focused = true
    }

  , blur: function (e) {
      this.focused = false
      if (!this.mousedover && this.shown) this.hide()
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
      this.$element.focus()
    }

  , mouseenter: function (e) {
      this.mousedover = true
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  , mouseleave: function (e) {
      this.mousedover = false
      if (!this.focused && this.shown) this.hide()
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  var old = $.fn.typeahead

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  , minLength: 1
  }

  $.fn.typeahead.Constructor = Typeahead


 /* TYPEAHEAD NO CONFLICT
  * =================== */

  $.fn.typeahead.noConflict = function () {
    $.fn.typeahead = old
    return this
  }


 /* TYPEAHEAD DATA-API
  * ================== */

  $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
    var $this = $(this)
    if ($this.data('typeahead')) return
    $this.typeahead($this.data())
  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-affix.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#affix
 * ==========================================================
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
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* AFFIX CLASS DEFINITION
  * ====================== */

  var Affix = function (element, options) {
    this.options = $.extend({}, $.fn.affix.defaults, options)
    this.$window = $(window)
      .on('scroll.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.affix.data-api',  $.proxy(function () { setTimeout($.proxy(this.checkPosition, this), 1) }, this))
    this.$element = $(element)
    this.checkPosition()
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
      , scrollTop = this.$window.scrollTop()
      , position = this.$element.offset()
      , offset = this.options.offset
      , offsetBottom = offset.bottom
      , offsetTop = offset.top
      , reset = 'affix affix-top affix-bottom'
      , affix

    if (typeof offset != 'object') offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function') offsetTop = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ?
      false    : offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ?
      'bottom' : offsetTop != null && scrollTop <= offsetTop ?
      'top'    : false

    if (this.affixed === affix) return

    this.affixed = affix
    this.unpin = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''))
  }


 /* AFFIX PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('affix')
        , options = typeof option == 'object' && option
      if (!data) $this.data('affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix

  $.fn.affix.defaults = {
    offset: 0
  }


 /* AFFIX NO CONFLICT
  * ================= */

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


 /* AFFIX DATA-API
  * ============== */

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
        , data = $spy.data()

      data.offset = data.offset || {}

      data.offsetBottom && (data.offset.bottom = data.offsetBottom)
      data.offsetTop && (data.offset.top = data.offsetTop)

      $spy.affix(data)
    })
  })


}(window.jQuery);

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
        //console.log("in resplit splitter._oldW:"+splitter._oldW);
        //console.log("in resplit splitter._oldH:"+splitter._oldH);
        //console.log("in resplit splitter.width():"+splitter.width());
        //console.log("in resplit splitter.height():"+splitter.height());

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

        //        A.css(opts.origin, 0).css(opts.split, pos-2).css(opts.fixed, splitter._DF-2);
        //        B.css(opts.origin, pos + bar._DA).css(opts.split, splitter._DA - bar._DA - pos-2).css(opts.fixed, splitter._DF-2);
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

        //console.log("out resplit splitter._oldW:"+splitter._oldW);
        //console.log("out resplit splitter._oldH:"+splitter._oldH);
        //console.log("out resplit splitter.width():"+splitter.width());
        //console.log("out resplit splitter.height():"+splitter.height());

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
        //console.log("in resize splitter._oldW:"+splitter._oldW);
        //console.log("in resize splitter._oldH:"+splitter._oldH);
        //console.log("in resize splitter.width():"+splitter.width());
        //console.log("in resize splitter.height():"+splitter.height());

        // Determine new width/height of splitter container
        splitter._DF = splitter[0][opts.pxFixed] - splitter._PBF;
        splitter._DA = splitter[0][opts.pxSplit] - splitter._PBA;

        // Bail if splitter isn't visible or content isn't there yet
        if (splitter._DF <= 0 || splitter._DA <= 0) return;

        // if nothing changed, no need to resize 
        if (splitter._oldW == splitter.width() && splitter._oldH == splitter.height()) return; // nothing changed
        //splitter._oldW = splitter.width();
        //splitter._oldH = splitter.height();
        //console.log("out resize splitter._oldW:"+splitter._oldW);
        //console.log("out resize splitter._oldH:"+splitter._oldH);
        //console.log("out resize splitter.width():"+splitter.width());
        //console.log("out resize splitter.height():"+splitter.height());

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
          //console.log("in Winresize opts.eventNamespace:"+opts.eventNamespace);
          //console.log("in Winresize splitter._oldW:"+splitter._oldW);
          //console.log("in Winresize splitter._oldH:"+splitter._oldH);
          //console.log("in Winresize splitter.width():"+splitter.width());
          //console.log("in Winresize splitter.height():"+splitter.height());

          var top = splitter.offset().top;
          // 在 chrome 浏览器中 window.innerHeight 和 .height() 获取的值有可能不一致，而在ie7又无法获取innerHeight
          var eh = opts.resizeTo.innerHeight || $(opts.resizeTo).height();

          //console.log("out Winresize eh:"+ eh);
          //console.log("out Winresize top:"+ top);
          //console.log("out Winresize splitter._hadjust:"+ splitter._hadjust);
          //console.log("out Winresize size_01:"+ (eh - top - splitter._hadjust));
          //console.log("out Winresize size_02:"+splitter._hmin);

          splitter.css("height", Math.max(eh - top - splitter._hadjust, splitter._hmin) + "px");
          //splitter._oldH= Math.max(eh - top - splitter._hadjust, splitter._hmin);
        
          //console.log("out Winresize splitter._oldW:"+splitter._oldW);
          //console.log("out Winresize splitter._oldH:"+splitter._oldH);
          //console.log("out Winresize splitter.width():"+splitter.width());
          //console.log("out Winresize splitter.height():"+splitter.height());
//          if (!resize_auto_fired()) splitter.triggerHandler("resize" + opts.eventNamespace);
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
        //console.log("in SplitterResize splitter._oldW:"+splitter._oldW);
        //console.log("in SplitterResize splitter._oldH:"+splitter._oldH);
        //console.log("in SplitterResize splitter.width():"+splitter.width());
        //console.log("in SplitterResize splitter.height():"+splitter.height());     
        resize(size);
        //console.log("out SplitterResize splitter._oldW:"+splitter._oldW);
        //console.log("out SplitterResize splitter._oldH:"+splitter._oldH);
        //console.log("out SplitterResize splitter.width():"+splitter.width());
        //console.log("out SplitterResize splitter.height():"+splitter.height());     
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