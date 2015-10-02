import Ember from 'ember';
import layout from '../../templates/components/color-picker';

export default Ember.Component.extend({
  layout: layout,
  layoutName: 'color-picker',
  classNames: ['color-picker-button'],
  colorPickerPlacement: 'right',
  dropdownClass: null,
  INITIAL_COLOR: '#0074D9',
  selectedColor: '#0074D9',
  selectedColorRGB: Ember.computed(function() {
    return colorToHex(this.get('selectedColor'));
  }).property('selectedColor'),
  customColor: '',
  isColorTransparent: Ember.computed.equal('selectedColorRGB', 'transparent'),
  colorRows: Ember.A([Ember.A(['#000000', '#111111', '#434343', '#666666', '#999999', '#AAAAAA', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF']), Ember.A(['#001F3F', '#0074D9', '#7FDBFF', '#39CCCC', '#2ECC40', '#01FF70', '#FFDC00', '#FF851B', '#FF4136', '#85144B', '#B10DC9', 'transparent'])]),
  setCustomColor: Ember.on('init', Ember.observer(function() {
    var selectedColor;
    selectedColor = this.get('selectedColor');
    selectedColor = colorToHex(selectedColor);
    if (this.get('colorRows').find(function(row) {
      return indexOf.call(row.invoke('toLowerCase'), selectedColor) >= 0;
    })) {
      return this.set('customColor', '');
    }
    return this.set('customColor', selectedColor);
  }, 'selectedColor', 'colorRows')),
  isCustomColorValid: Ember.computed(function() {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test("" + (this.get('customColor')));
  }).property('customColor'),
  customColorCSS: Ember.computed(function() {
    return "background-color: " + (this.get('customColor'));
  }).property('customColor'),
  actions: {
    setColor: function(color) {
      this.set('customColor', '');
      return this.set('selectedColor', color);
    },
    sendCustomColor: function() {
      var color;
      color = this.get('customColor');
      this.set('selectedColor', color);
      return this.userDidSelect(color);
    }
  },
  userDidSelect: function(selection) {
    return this.sendAction('userSelected', selection);
  }
});
