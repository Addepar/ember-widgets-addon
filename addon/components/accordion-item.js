import Ember from 'ember';
import layout from '../../templates/components/accordion-item';

export default Ember.Component.extend({
  layout: layout,
  layoutName: 'accordion-group',
  classNames: 'panel panel-default',
  title: 'Untitled Accordion Group',
  index: 0,
  isActive: false,
  content: Ember.computed.alias 'parentView.content',

  isActiveDidChange: Ember.observer(function() {
    this.set('isActive', this.get('parentView.activeIndex') === this.get('index'));
    if (this.get('isActive')) {
      return this.show();
    } else {
      return this.hide();
    }
  }, 'parentView.activeIndex'),

  didInsertElement: function() {
    var index;
    index = this.get('parentView').$('.panel').index(this.$());
    this.set('index', index);
    return this.isActiveDidChange();
  },

  click: function(event) {
    if (!(this.$(event.target).closest('.panel-heading').length > 0)) {
      return;
    }
    if (this.get('isActive')) {
      return this.set('parentView.activeIndex', null);
    } else {
      return this.set('parentView.activeIndex', this.get('index'));
    }
  },

  hide: function() {
    var $accordionBody;
    $accordionBody = this.$('.panel-collapse');
    $accordionBody.height($accordionBody.height())[0].offsetHeight;
    $accordionBody.removeClass('collapse').removeClass('in').addClass('collapsing');
    $accordionBody.height(0);
    return this._onTransitionEnd($accordionBody, (function(_this) {
      return function() {
        return $accordionBody.removeClass('collapsing').addClass('collapse');
      };
    })(this));
  },

  show: function() {
    var $accordionBody;
    $accordionBody = this.$('.panel-collapse');
    $accordionBody.removeClass('collapse').addClass('collapsing').height(0);
    $accordionBody.height($accordionBody[0]['scrollHeight']);
    return this._onTransitionEnd($(), (function(_this) {
      return function() {
        return $accordionBody.removeClass('collapsing').addClass('in').height('auto');
      };
    })(this));
  },

  _onTransitionEnd: function($el, callback) {
    if (Ember.Widgets.DISABLE_ANIMATIONS) {
      return callback();
    } else {
      return $el.one($.support.transition.end, callback);
    }
  }
  
});
