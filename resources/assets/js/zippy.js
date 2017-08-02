(function ($) {

  "use strict"

  var DATA_KEY = 'ca.zippy'
  var EVENT_KEY = DATA_KEY+'.'

  var Event = {
    HIDE: EVENT_KEY+'hide',
    HIDDEN: EVENT_KEY+'hidden',
    SHOW: EVENT_KEY+'show',
    SHOWN: EVENT_KEY+'shown'
  }

  var Selector = {
    ZIPPY: '.zippy',
    DATA_TOGGLE: '[data-toggle="zippy"]'
  }

  var Zippy = function (){

    var Zippy  = function(element, config) {
      this.$zippy_ = $(element)
      this.isShown_ = false
      this.isAnimating_ = false
      this.init(config)
    }

    Zippy.prototype.VERSION = '1.0'

    Zippy.prototype.Default = {
      show: false,
      parent: false
    }

    Zippy.prototype.Classes_ = {
      ZIPPY_WRAPPER: 'zippy__wrapper',
      IS_OPEN: 'zippy--open',
      IS_ANIMATING: 'zippy--animating'
    }

    Zippy.prototype.init = function (config) {
      if(this.$zippy_.length){
        this.config = $.extend({}, this.Default, config)
        this.$zippyWrapper_ = this.$zippy_.find('.'+this.Classes_.ZIPPY_WRAPPER)
        let rect = this.$zippyWrapper.get(0).getBoundingClientRect();
        this.$zippyWrapper_.css('margin-top',-rect.height);
        this.currentMargin = rect.height;
        this.boundOnTransitionEnd_ = this.onTransitionEnd_.bind(this)
      }
    }

    Zippy.prototype.show = function () {
      this.$zippy_.addClass(this.Classes_.IS_ANIMATING).addClass(this.Classes_.IS_OPEN)
      this.$zippy_.trigger(Event.SHOW)
      this.isShown_ = true
      this.isAnimating_ = true
      this.$zippyWrapper_.css('margin-top','0');
      this.$zippy_.attr('aria-expanded', 'true');
      this.$zippyWrapper_.on('transitionend', this.boundOnTransitionEnd_)
    }

    Zippy.prototype.hide = function () {
      this.$zippy_.addClass(this.Classes_.IS_ANIMATING).addClass(this.Classes_.IS_OPEN)
      this.$zippy_.trigger(Event.SHOW)
      this.isShown_ = false
      this.isAnimating_ = true
      this.$zippyWrapper_.css('margin-top',-this.currentMargin);
      this.$zippy_.attr('aria-expanded', 'true');
      this.$zippyWrapper_.on('transitionend', this.boundOnTransitionEnd_)
    }

    Zippy.prototype.toggle = function () {
      if(this.isAnimating_)
          return
      this.isShown_? this.hide() : this.show()
    }

    Zippy.prototype.onTransitionEnd_ = function () {
      this.$zippy_.removeClass(this.Classes_.IS_ANIMATING)
      this.isAnimating_ = false
      this.$zippyWrapper_.unbind('transitionend',this.boundOnTransitionEnd_)
      this.isShown_?this.$zippy_.trigger(Event.SHOWN):this.$zippy_.trigger(Event.HIDDEN)
    }

    Zippy.Plugin_ = function Plugin_(config) {
      return this.each(function () {
        var $this = $(this)
        var data  = $this.data(DATA_KEY)
        if (!data){
          $this.data(DATA_KEY, (data = new Zippy(this, config)))
        }
        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new Error('No method named "' + config + '"')
          }
          data[config]()
        }
      })
    }
    return Zippy
  }()

  /**
   * -----------------------
   * Data Api
   * -----------------------
   */
  $(document).on('click', Selector.DATA_TOGGLE, function (event) {
    var $this = $(this)
    if (this.tagName === 'A') {
      event.preventDefault()
    }
    var target = $this.attr('data-target')
    if(typeof target === typeof undefined){
      throw new Error('Target Zippy not specified.')
      return
    }
    var config = $(target).data(DATA_KEY) ? 'toggle' : $.extend({}, $(target).data(), $(this).data())
    Zippy.Plugin_.call($(target), config)
  })
  $.fn.Zippy = Zippy.Plugin_
  $.fn.Zippy.Constructor = Zippy
  $.fn.Zippy.noConflict = function () {
    $.fn.Zippy = Zippy
    return Zippy.Plugin_
  }
}( jQuery ))