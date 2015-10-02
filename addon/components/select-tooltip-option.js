import Ember from 'ember';
import layout from '../templates/components/select-tooltip-option';

export default Ember.Widgets.SelectOptionView.extend({
  layout: layout,
  attributeBindings: ['contentLabel:title'],
  contentLabel: Ember.computed(function() {
    var labelPath;
    labelPath = this.get('labelPath');
    return this.get("content." + labelPath);
  }).property('content', 'labelPath')
});
