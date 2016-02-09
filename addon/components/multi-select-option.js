import Ember from 'ember';
import layout from '../templates/components/multi-select-option';
import MultiSelectItemTemplate from '../templates/components/multi-select-item'

export default Ember.View.extend({
  layout: layout,
  tagName: 'li',
  template: MultiSelectItemTemplate,
  classNames: 'ember-select-search-choice',
  labelPath: Ember.computed.alias('controller.optionLabelPath'),
  didInsertElement: function() {
    this._super();
    return this.labelPathDidChange();
  },
  labelPathDidChange: Ember.observer(function() {
    var labelPath, path;
    labelPath = this.get('labelPath');
    path = labelPath ? "context." + labelPath : 'context';
    Ember.defineProperty(this, 'label', Ember.computed.alias(path));
    return this.notifyPropertyChange('label');
  }, 'context', 'labelPath')
});
