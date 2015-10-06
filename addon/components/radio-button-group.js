import Ember from 'ember';
import layout from '../templates/components/radio-button-group';

export default Ember.Component.extend({
  layout: layout,
  classNames: ['ember-radio-button-group'],
  // Bound to the value of the selected radio button in this group
  selectedValue: null,
  disabled: false,
  selectedValueChanged: Ember.on('init', Ember.observer(function() {
   return this.sendAction('action', this.get('selectedValue'));
  }, 'selectedValue'))
});
