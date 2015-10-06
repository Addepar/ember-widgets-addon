import Ember from 'ember';
import layout from '../templates/components/color-picker-cell';
import StyleBindingsMixin from '../mixins/style-bindings';
import ColorPicker from '../utils/color-picker';

export default Ember.Component.extend(StyleBindingsMixin, {
  layout: layout,
  templateName: 'color-picker-cell',
  classNames: ['pull-left', 'color-picker-cell'],
  classNameBindings: Ember.A(['isActive:active:inactive']),
  styleBindings: 'color:background-color',
  color: null,
  isActive: Ember.computed(function() {
    return ColorPicker.colorToHex(this.get('controller.selectedColor')) === ColorPicker.colorToHex(this.get('color'));
  }).property('controller.selectedColor', 'color'),
  click: function() {
    this.get('controller').send('setColor', this.get('color'));
    return this.get('controller').userDidSelect(this.get('color'));
  }
});
