import Ember from 'ember';
import layout from '../templates/components/modal-box';

Ember.Widgets.StyleBindingsMixin, Ember.Widgets.TabbableModal

export default Ember.Component.extend({
  layout: layout,
  layoutName: 'modal',
  classNames: ['modal'],
  classNameBindings: ['isShowing:in', 'hasCloseButton::has-no-close-button', 'fadeEnabled:fade'],
  modalPaneBackdrop: '<div class="modal-backdrop"></div>',
  bodyElementSelector: '.modal-backdrop',
  enforceModality: false,
  escToCancel: true,
  backdrop: true,
  isShowing: false,
  hasCloseButton: true,
  fade: true,
  headerText: "Modal Header",
  confirmText: "Confirm",
  cancelText: "Cancel",
  closeText: null,
  content: "",
  size: "normal",
  isValid: true,
  confirm: Ember.K,
  cancel: Ember.K,
  close: Ember.K,
  isDisabled: Ember.computed.not('isValid'),
  fadeEnabled: Ember.computed(function() {
    if (Ember.Widgets.DISABLE_ANIMATIONS) {
      return false;
    }
    return this.get('fade');
  }).property('fade'),
  confirm: null,
  cancel: null,
  close: null,
  _runFocusTabbable: null,
  headerViewClass: Ember.View.extend({
    templateName: 'modal_header'
  }),
  contentViewClass: Ember.View.extend({
    template: Ember.Handlebars.compile("<p>{{content}}</p>")
  }),
  footerViewClass: Ember.View.extend({
    templateName: 'modal-footer'
  }),
  _headerViewClass: Ember.computed(function() {
    var headerViewClass;
    headerViewClass = this.get('headerViewClass');
    if (typeof headerViewClass === 'string') {
      return Ember.get(headerViewClass);
    } else {
      return headerViewClass;
    }
  }).property('headerViewClass'),
  _contentViewClass: Ember.computed(function() {
    var contentViewClass;
    contentViewClass = this.get('contentViewClass');
    if (typeof contentViewClass === 'string') {
      return Ember.get(contentViewClass);
    } else {
      return contentViewClass;
    }
  }).property('contentViewClass'),
  _footerViewClass: Ember.computed(function() {
    var footerViewClass;
    footerViewClass = this.get('footerViewClass');
    if (typeof footerViewClass === 'string') {
      return Ember.get(footerViewClass);
    } else {
      return footerViewClass;
    }
  }).property('footerViewClass'),
  sizeClass: Ember.computed(function() {
    switch (this.get('size')) {
      case 'large':
        return 'modal-lg';
      case 'small':
        return 'modal-sm';
      default:
        return '';
    }
  }).property('size'),
  actions: {
    sendCancel: function() {
      var cancel;
      if (!this.get('isShowing')) {
        return;
      }
      cancel = this.get('cancel');
      if (typeof cancel === 'function') {
        this.cancel(this);
      } else {
        this.sendAction('cancel');
      }
      return this.hide();
    },
    sendConfirm: function() {
      var confirm;
      if (!this.get('isShowing')) {
        return;
      }
      confirm = this.get('confirm');
      if (typeof confirm === 'function') {
        this.confirm(this);
      } else {
        this.sendAction('confirm');
      }
      return this.hide();
    },
    sendClose: function() {
      var close;
      if (!this.get('isShowing')) {
        return;
      }
      close = this.get('close');
      if (typeof close === 'function') {
        this.close(this);
      } else {
        this.sendAction('close');
      }
      return this.hide();
    }
  },
  didInsertElement: function() {
    this._super();
    this._runFocusTabbable = Ember.run.schedule('afterRender', this, function() {
      return this._focusTabbable();
    });
    if (this.get('fade')) {
      this.$()[0].offsetWidth;
    }
    if (this.get('backdrop')) {
      this._appendBackdrop();
    }
    Ember.run.next(this, function() {
      if (this.isDestroying) {
        return;
      }
      return this.set('isShowing', true);
    });
    $(document.body).addClass('modal-open');
    return this._setupDocumentHandlers();
  },
  willDestroyElement: function() {
    if (this._runFocusTabbable) {
      Ember.run.cancel(this._runFocusTabbable);
    }
    this._super();
    this._removeDocumentHandlers();
    if (this._backdrop) {
      return this._backdrop.remove();
    }
  },
  click: function(event) {
    this._super(event);
    if (event.target === event.currentTarget) {
      if (!this.get('enforceModality')) {
        return this.send('sendCancel');
      }
    }
  },
  hide: function() {
    if (this.isDestroying) {
      return;
    }
    this.set('isShowing', false);
    $(document.body).removeClass('modal-open');
    if (this._backdrop) {
      this._backdrop.removeClass('in');
    }
    if (this.get('fadeEnabled')) {
      return this.$().one($.support.transition.end, (function(_this) {
        return function() {
          return Ember.run(_this, _this.destroy);
        };
      })(this));
    } else {
      return Ember.run(this, this.destroy);
    }
  },
  _appendBackdrop: function() {
    var modalPaneBackdrop, parentLayer;
    parentLayer = this.$().parent();
    modalPaneBackdrop = this.get('modalPaneBackdrop');
    this._backdrop = jQuery(modalPaneBackdrop);
    if (this.get('fadeEnabled')) {
      this._backdrop.addClass('fade');
    }
    this._backdrop.appendTo(parentLayer);
    return Ember.run.next(this, function() {
      return this._backdrop.addClass('in');
    });
  },
  _setupDocumentHandlers: function() {
    this._super();
    if (!this._hideHandler) {
      this._hideHandler = (function(_this) {
        return function() {
          return _this.hide();
        };
      })(this);
      return $(document).on('modal:hide', this._hideHandler);
    }
  },
  _removeDocumentHandlers: function() {
    this._super();
    $(document).off('modal:hide', this._hideHandler);
    this._hideHandler = null;
    $(document).off('keyup', this.get('keyHandler'));
    return this.$().off($.support.transition.end);
  }
});
