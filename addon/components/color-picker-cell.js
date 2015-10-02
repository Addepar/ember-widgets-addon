import Ember from 'ember';
import layout from '../../templates/components/color-picker-cell';
 Ember.Widgets.StyleBindingsMixin
export default Ember.Component.extend({
  layout: layout,
  templateName: 'color-picker-cell',
  classNames: ['pull-left', 'color-picker-cell'],
  classNameBindings: Ember.A(['isActive:active:inactive']),
  styleBindings: 'color:background-color',
  color: null,
  isActive: Ember.computed(function() {
    return colorToHex(this.get('controller.selectedColor')) === colorToHex(this.get('color'));
  }).property('controller.selectedColor', 'color'),
  click: function(event) {
    this.get('controller').send('setColor', this.get('color'));
    return this.get('controller').userDidSelect(this.get('color'));
  }
});
