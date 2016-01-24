import Ember from 'ember';
import PopoverBox from '../components/popover-box';

export default Ember.Component.extend({
  classNames: ['popover-link'],
  classNameBindings: ['disabled'],
  placement: 'top',
  content: null,
  title: null,
  contentViewClass: null,
  disabled: false,
  popoverClassNames: [],
  rootElement: '.ember-application',
  fade: true,
  _popover: null,
  willDestroyElement: function() {
    var ref;
    if ((ref = this.get('_popover')) != null) {
      ref.destroy();
    }
    return this._super();
  },
  _contentViewClass: Ember.computed(function() {
    var contentViewClass;
    contentViewClass = this.get('contentViewClass');
    if (typeof contentViewClass === 'string') {
      return Ember.get(contentViewClass);
    }
    return contentViewClass;
  }).property('contentViewClass'),
  click: function() {
    var popover, popoverView;
    if (this.get('disabled')) {
      return;
    }
    popover = this.get('_popover');
    if (((popover != null ? popover.get('_state') : void 0) || (popover != null ? popover.get('state') : void 0)) === 'inDOM') {
      return popover.hide();
    } else {
      popoverView = PopoverBox.extend({
        layoutName: 'popover-link-popover',
        classNames: this.get('popoverClassNames'),
        controller: this,
        targetElement: this.get('element'),
        container: this.get('container'),
        placement: Ember.computed.alias('controller.placement'),
        title: Ember.computed.alias('controller.title'),
        contentViewClass: this.get('_contentViewClass'),
        fade: this.get('fade')
      });
      popover = popoverView.create();
      // popover.set('controller', this);
      this.set('_popover', popover);
      return popover.appendTo(this.get('rootElement'));
    }
  }
});
