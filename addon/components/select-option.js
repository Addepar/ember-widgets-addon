import Ember from 'ember';
import layout from '../templates/components/select-option';

export default Ember.ListItemView.extend({
  layout: layout,
  tagName: 'li',
  templateName: 'select-item',
  layoutName: 'select-item-layout',
  classNames: 'ember-select-result-item',
  classNameBindings: Ember.A(['content.isGroupOption:ember-select-group', 'isHighlighted:highlighted']),
  labelPath: Ember.computed.alias('controller.optionLabelPath'),
  isHighlighted: Ember.computed(function() {
    return this.get('controller.highlighted') === this.get('content');
  }).property('controller.highlighted', 'content'),
  labelPathDidChange: Ember.observer(function() {
    var labelPath, path;
    labelPath = this.get('labelPath');
    path = labelPath ? "content." + labelPath : 'content';
    Ember.defineProperty(this, 'label', Ember.computed.alias(path));
    return this.notifyPropertyChange('label');
  }, 'content', 'labelPath'),
  processDropDownShown: function() {
    return this.get('controller').send('hideDropdown');
  },
  didInsertElement: function() {
    this._super();
    return this.labelPathDidChange();
  },
  updateContext: function(context) {
    this._super(context);
    return this.set('content', context);
  },
  click: function() {
    if (this.get('content.isGroupOption')) {
      return;
    }
    this.set('controller.selection', this.get('content'));
    this.get('controller').userDidSelect(this.get('content'));
    if (this.get('controller.showDropdown')) {
      this.processDropDownShown();
      return false;
    }
  },
  mouseEnter: function() {
    if (this.get('content.isGroupOption')) {
      return;
    }
    return this.set('controller.highlighted', this.get('content'));
  }
});
