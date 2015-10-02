import Ember from 'ember';
import layout from '../templates/components/radio-button-wrapper';

export default Ember.Component.extend({
  layout: layout,
  layoutName: 'radio-button-layout',
  value: null,
  disabled: false,
  selectedValue: Ember.computed.alias('parentView.selectedValue'),
  classNames: ['radio-button'],
  checked: false,
  _disabled: Ember.computed.or('parentView.disabled', 'disabled'),
  selectedValueChanged: Ember.on('init', Ember.observer(function() {
    var selectedValue;
    selectedValue = this.get('selectedValue');
    if (!Ember.isEmpty(selectedValue) && this.get('value') === selectedValue) {
      return this.set('checked', true);
    } else {
      return this.set('checked', false);
    }
  }, 'selectedValue')),
  click: function(event) {
    if (this.get('_disabled')) {
      return;
    }
    this.set('checked', true);
    return this.set('selectedValue', this.get('value'));
  }
});
