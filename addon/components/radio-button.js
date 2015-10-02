import Ember from 'ember';
import layout from '../templates/components/radio-button';

export default Ember.Component.extend({
  layout: layout,
  attributeBindings: ['type', 'checked', 'disabled'],
  classNames: ['radio-input'],
  tagName: 'input',
  type: 'radio',
  checked: Ember.computed.alias('parentView.checked'),
  disabled: Ember.computed.alias('parentView._disabled')
});
