import Ember from 'ember';
import SelectOption from './select-option';
import layout from '../templates/components/select-tooltip-option';

export default SelectOption.extend({
  layout: layout,
  attributeBindings: ['contentLabel:title'],
  contentLabel: Ember.computed(function() {
    var labelPath;
    labelPath = this.get('labelPath');
    return this.get("content." + labelPath);
  }).property('content', 'labelPath')
});
