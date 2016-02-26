import Ember from 'ember';
import layout from '../templates/components/popover-box';

import StyleBindingsMixin from '../mixins/style-bindings';
import BodyEventListener from '../mixins/body-event-listener';

import viewParentViewContent from '../templates/view-parent-view-content';

// TODO(jordan): fix ember environment disable animations stuff
var ENV = {};

var PopoverBoxComponent = Ember.View.extend(StyleBindingsMixin,
BodyEventListener, {
  layout: layout,
  layoutName: 'popover',
  classNames: ['popover'],
  classNameBindings: ['isShowing:in', 'fadeEnabled:fade', 'placement'],
  styleBindings: ['left', 'top', 'display', 'visibility'],

  // The target element to anchor the popover to
  targetElement: null,
  contentViewClass: null,
  fade: true,
  escToCancel: true,
  placement: 'top',
  display: 'block',
  visibility: 'hidden',
  debounceTime: 100,
  fadeEnabled: Ember.computed(function() {
    if (ENV.EMBER_WIDGETS_DISABLE_ANIMATIONS) {
      return false;
    }
    return this.get('fade');
  }).property('fade'),
  left: 0,
  top: 0,
  marginTop: 23,
  marginLeft: 10,
  isShowing: false,
  inserted: false,
  title: '',
  content: '',
  _resizeHandler: null,
  _scrollHandler: null,
  _contentViewClass: Ember.computed(function() {
    if (this.get('contentViewClass')) {
      return this.get('contentViewClass');
    }
    return Ember.View.extend({
      content: Ember.computed.alias('parentView.content'),
      layout: viewParentViewContent
    });
  }).property('contentViewClass'),
  didInsertElement: function() {
    this._super();
    // we want the view to render first and then we snap to position after
    // it is renered
    this.snapToPosition();
    this.set('visibility', 'visible');
    return this.set('isShowing', true);
  },
  willDestroyElement: function() {
    this.$().off($.support.transition.end);
    return this._super();
  },
  bodyClick: function() {
    return this.hide();
  },
  hide: function() {
    if (this.get('isDestroyed')) {
      return;
    }
    this.set('isShowing', false);
    if (this.get('fadeEnabled')) {
      return this.$().one($.support.transition.end,
        (function() {
          // We need to wrap this in a run-loop otherwise ember-testing will complain
          // about auto run being disabled when we are in testing mode.
          return Ember.run(this, this.destroy);
        }).bind(this)
      );
    } else {
      return Ember.run(this, this.destroy);
    }
  },

  /*
  Calculate the offset of the given iframe relative to the top window.
  - Walks up the iframe chain, checking the offset of each one till it reaches top
  - Only works with friendly iframes.
  - Takes into account scrolling, but comes up with a result relative to
  top iframe, regardless of being visibile withing intervening frames.

  @param window win    the iframe we're interested in (e.g. window)
  @param object pos   an object containing the offset so far:
  { left: [x], top: [y] }
  (optional - initializes with 0,0 if undefined)
  @return pos object above

  via http://stackoverflow.com/a/9676655
   */
  computeFrameOffset: function(win, pos) {
    // find our <iframe> tag within our parent window
    var found, frame, frames, i, len, rect;
    if (pos == null) {
      pos = {
        top: 0,
        left: 0
      };
    }
    frames = win.parent.document.getElementsByTagName("iframe");
    found = false;
    for (i = 0, len = frames.length; i < len; i++) {
      frame = frames[i];
      if (frame.contentWindow === win) {
        found = true;
        break;
      }
    }
    // add the offset & recur up the frame chain
    if (found) {
      rect = frame.getBoundingClientRect();
      pos.left += rect.left;
      pos.top += rect.top;
      if (win !== top) {
        this.computeFrameOffset(win.parent, pos);
      }
    }
    return pos;
  },
  getOffset: function($target) {
    var doc, pos, win;
    pos = $target.offset();
    doc = $target[0].ownerDocument;
    win = doc.defaultView;
    return this.computeFrameOffset(win, pos);
  },
  snapToPosition: function() {
    var $target, actualHeight, actualWidth, pos;
    $target = $(this.get('targetElement'));
    if ((this.get('_state') || this.get('state')) !== 'inDOM') {
      return;
    }
    actualWidth = this.$()[0].offsetWidth;
    actualHeight = this.$()[0].offsetHeight;
    // For context menus where the position is set directly, rather
    // than by a target element, $target is empty. Therefore, we
    // set top, left, width, and height manually.
    if (Ember.isEmpty($target)) {
      pos = {
        top: this.get('top'),
        left: this.get('left'),
        width: 0,
        height: 0
      };
    } else {
      pos = this.getOffset($target);
      pos.width = $target[0].offsetWidth;
      pos.height = $target[0].offsetHeight;
    }
    switch (this.get('placement')) {
      case 'bottom':
        this.set('top', pos.top + pos.height);
        this.set('left', pos.left + pos.width / 2 - actualWidth / 2);
        break;
      case 'top':
        this.set('top', pos.top - actualHeight);
        this.set('left', pos.left + pos.width / 2 - actualWidth / 2);
        break;
      case 'top-right':
        this.set('top', pos.top);
        this.set('left', pos.left + pos.width);
        break;
      case 'top-left':
        this.set('top', pos.top);
        this.set('left', pos.left - actualWidth);
        break;
      case 'bottom-right':
        this.set('top', pos.top + pos.height);
        this.set('left', pos.left + pos.width - actualWidth);
        break;
      case 'bottom-left':
        this.set('top', pos.top + pos.height);
        this.set('left', pos.left);
        break;
      case 'left':
        this.set('top', pos.top - this.get('marginTop'));
        this.set('left', pos.left - actualWidth);
        break;
      case 'right':
        this.set('top', pos.top - this.get('marginTop'));
        this.set('left', pos.left + pos.width);
        break;
    }
    this.correctIfOffscreen();
    // In the case of a context menu with no target element, there is no
    // need to display a position arrow.
    if (!Ember.isEmpty($target)) {
      return this.positionArrow();
    }
  },
  positionArrow: function() {
    var $target, arrowSize, left, pos, top;
    $target = $(this.get('targetElement'));
    pos = this.getOffset($target);
    pos.width = $target[0].offsetWidth;
    pos.height = $target[0].offsetHeight;
    arrowSize = 22;
    switch (this.get('placement')) {
      case 'left':
      case 'right':
        top = pos.top + pos.height / 2 - this.get('top') - arrowSize / 2;
        return this.set('arrowStyle', "margin-top:" + top + "px;");
      case 'top':
      case 'bottom':
        left = pos.left + pos.width / 2 - this.get('left') - arrowSize / 2;
        return this.set('arrowStyle', "margin-left:" + left + "px;");
    }
  },
  correctIfOffscreen: function() {
    var actualHeight, actualWidth, bodyHeight, bodyWidth;
    bodyWidth = $('body').width();
    bodyHeight = $('body').height();
    actualWidth = this.$()[0].offsetWidth;
    actualHeight = this.$()[0].offsetHeight;
    if (this.get('left') + actualWidth > bodyWidth) {
      this.set('left', bodyWidth - actualWidth - this.get('marginLeft'));
    }
    if (this.get('left') < 0) {
      this.set('left', this.get('marginLeft'));
    }
    if (this.get('top') + actualHeight > bodyHeight) {
      this.set('top', bodyHeight - actualHeight - this.get('marginTop'));
    }
    if (this.get('top') < 0) {
      return this.set('top', this.get('marginTop'));
    }
  },
  keyHandler: Ember.computed(function() {
    return (function(_this) {
      return function(event) {
        if (event.keyCode === 27 && _this.get('escToCancel')) {
          return _this.hide();
        }
      };
    })(this);
  }),
  // We need to put this in a computed because this is attached to the
  // resize and scroll events before snapToPosition is defined. We
  // throttle for 100 ms because that looks nice.
  debounceSnapToPosition: Ember.computed( function() {
    return function() {
      return Ember.run.debounce(this, this.snapToPosition, this.get('debounceTime'));
    }.bind(this);
  }),

  _setupDocumentHandlers: function() {
    this._super();
    if (!this._hideHandler) {
      this._hideHandler = (function(_this) {
        return function() {
          return _this.hide();
        };
      })(this);
      $(document).on('popover:hide', this._hideHandler);
    }
    if (!this._resizeHandler) {
      this._resizeHandler = this.get('debounceSnapToPosition');
      $(document).on('resize', this._resizeHandler);
    }
    if (!this._scrollHandler) {
      this._scrollHandler = this.get('debounceSnapToPosition');
      $(document).on('scroll', this._scrollHandler);
    }
    return $(document).on('keyup', this.get('keyHandler'));
  },
  _removeDocumentHandlers: function() {
    this._super();
    $(document).off('popover:hide', this._hideHandler);
    this._hideHandler = null;
    $(document).off('resize', this._resizeHandler);
    this._resizeHandler = null;
    $(document).off('scroll', this._scrollHandler);
    this._scrollHandler = null;
    return $(document).off('keyup', this.get('keyHandler'));
  }
});
PopoverBoxComponent.reopenClass({
  rootElement: '.ember-application',
  hideAll: function() {
   return $(document).trigger('popover:hide');
  },
  popup: function(options) {
   var popover, rootElement;
   this.hideAll();
   rootElement = options.rootElement || this.rootElement;
   popover = this.create(options);
   if (popover.get('targetObject.container')) {
     popover.set('container', popover.get('targetObject.container'));
   }
   popover.appendTo(rootElement);
   return popover;
  }
});
export default PopoverBoxComponent;
